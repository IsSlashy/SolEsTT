use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("AMghnPb4GogyZVYhRo5AhVw6obSMNtEV3mTff7efHjap");

#[program]
pub mod rwa_collateral {
    use super::*;

    /// Create a collateral vault for property tokens
    pub fn create_vault(
        ctx: Context<CreateVault>,
        vault_name: String,
        collateral_ratio: u64, // basis points (e.g., 15000 = 150%)
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;

        vault.authority = ctx.accounts.authority.key();
        vault.vault_name = vault_name;
        vault.collateral_ratio = collateral_ratio;
        vault.total_collateral_value = 0;
        vault.total_borrowed = 0;
        vault.is_active = true;
        vault.created_at = Clock::get()?.unix_timestamp;
        vault.bump = ctx.bumps.vault;

        msg!("Collateral vault created: {}", vault.vault_name);
        Ok(())
    }

    /// Deposit property tokens as collateral
    pub fn deposit_collateral(
        ctx: Context<DepositCollateral>,
        amount: u64,
        property_value: u64, // Value per token in USDC
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let position = &mut ctx.accounts.collateral_position;

        require!(vault.is_active, CollateralError::InactiveVault);

        // Transfer property tokens to vault
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_property_account.to_account_info(),
                    to: ctx.accounts.vault_property_account.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount,
        )?;

        let collateral_value = (amount as u128)
            .checked_mul(property_value as u128)
            .unwrap() as u64;

        position.user = ctx.accounts.user.key();
        position.vault = vault.key();
        position.property_mint = ctx.accounts.property_mint.key();
        position.collateral_amount = position.collateral_amount.checked_add(amount).unwrap();
        position.collateral_value = position.collateral_value.checked_add(collateral_value).unwrap();
        position.borrowed_amount = 0;
        position.last_update = Clock::get()?.unix_timestamp;
        position.bump = ctx.bumps.collateral_position;

        vault.total_collateral_value = vault.total_collateral_value.checked_add(collateral_value).unwrap();

        msg!("Deposited {} property tokens as collateral (value: {} USDC)", amount, collateral_value);
        Ok(())
    }

    /// Borrow against collateral
    pub fn borrow_against_collateral(
        ctx: Context<BorrowAgainstCollateral>,
        borrow_amount: u64,
    ) -> Result<()> {
        let vault = &ctx.accounts.vault;
        let position = &mut ctx.accounts.collateral_position;

        require!(vault.is_active, CollateralError::InactiveVault);
        require_keys_eq!(position.user, ctx.accounts.user.key(), CollateralError::Unauthorized);

        // Calculate max borrowable amount
        let max_borrow = (position.collateral_value as u128)
            .checked_mul(10000)
            .unwrap()
            .checked_div(vault.collateral_ratio as u128)
            .unwrap() as u64;

        let new_borrowed = position.borrowed_amount.checked_add(borrow_amount).unwrap();
        require!(new_borrowed <= max_borrow, CollateralError::ExceedsCollateralRatio);

        // Transfer USDC to user
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault_usdc_account.to_account_info(),
                    to: ctx.accounts.user_usdc_account.to_account_info(),
                    authority: ctx.accounts.authority.to_account_info(),
                },
            ),
            borrow_amount,
        )?;

        position.borrowed_amount = new_borrowed;
        position.last_update = Clock::get()?.unix_timestamp;

        msg!("Borrowed {} USDC against collateral", borrow_amount);
        Ok(())
    }

    /// Repay borrowed amount
    pub fn repay_loan(
        ctx: Context<RepayLoan>,
        repay_amount: u64,
    ) -> Result<()> {
        let position = &mut ctx.accounts.collateral_position;

        require_keys_eq!(position.user, ctx.accounts.user.key(), CollateralError::Unauthorized);

        // Transfer USDC from user to vault
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_usdc_account.to_account_info(),
                    to: ctx.accounts.vault_usdc_account.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            repay_amount,
        )?;

        position.borrowed_amount = position.borrowed_amount.saturating_sub(repay_amount);
        position.last_update = Clock::get()?.unix_timestamp;

        msg!("Repaid {} USDC", repay_amount);
        Ok(())
    }

    /// Withdraw collateral after repaying
    pub fn withdraw_collateral(
        ctx: Context<WithdrawCollateral>,
        amount: u64,
    ) -> Result<()> {
        let vault = &ctx.accounts.vault;
        let position = &mut ctx.accounts.collateral_position;

        require_keys_eq!(position.user, ctx.accounts.user.key(), CollateralError::Unauthorized);
        require!(position.borrowed_amount == 0, CollateralError::OutstandingDebt);
        require!(amount <= position.collateral_amount, CollateralError::InsufficientCollateral);

        // Transfer property tokens back to user
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault_property_account.to_account_info(),
                    to: ctx.accounts.user_property_account.to_account_info(),
                    authority: vault.to_account_info(),
                },
                &[&[
                    b"vault",
                    vault.authority.as_ref(),
                    vault.vault_name.as_bytes(),
                    &[vault.bump],
                ]],
            ),
            amount,
        )?;

        position.collateral_amount = position.collateral_amount.checked_sub(amount).unwrap();
        position.last_update = Clock::get()?.unix_timestamp;

        msg!("Withdrew {} property tokens", amount);
        Ok(())
    }

    /// Liquidate undercollateralized position
    pub fn liquidate_position(
        ctx: Context<LiquidatePosition>,
    ) -> Result<()> {
        let vault = &ctx.accounts.vault;
        let position = &mut ctx.accounts.collateral_position;

        // Check if position is undercollateralized
        let current_ratio = if position.borrowed_amount > 0 {
            (position.collateral_value as u128)
                .checked_mul(10000)
                .unwrap()
                .checked_div(position.borrowed_amount as u128)
                .unwrap() as u64
        } else {
            u64::MAX
        };

        require!(current_ratio < vault.collateral_ratio, CollateralError::HealthyPosition);

        // Transfer collateral to liquidator
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault_property_account.to_account_info(),
                    to: ctx.accounts.liquidator_property_account.to_account_info(),
                    authority: vault.to_account_info(),
                },
                &[&[
                    b"vault",
                    vault.authority.as_ref(),
                    vault.vault_name.as_bytes(),
                    &[vault.bump],
                ]],
            ),
            position.collateral_amount,
        )?;

        // Reset position
        position.collateral_amount = 0;
        position.collateral_value = 0;
        position.borrowed_amount = 0;

        msg!("Position liquidated");
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(vault_name: String)]
pub struct CreateVault<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Vault::INIT_SPACE,
        seeds = [b"vault", authority.key().as_ref(), vault_name.as_bytes()],
        bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositCollateral<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,

    #[account(
        init_if_needed,
        payer = user,
        space = 8 + CollateralPosition::INIT_SPACE,
        seeds = [b"collateral", user.key().as_ref(), vault.key().as_ref(), property_mint.key().as_ref()],
        bump
    )]
    pub collateral_position: Account<'info, CollateralPosition>,

    pub property_mint: Account<'info, Mint>,

    #[account(mut)]
    pub user_property_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub vault_property_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BorrowAgainstCollateral<'info> {
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub collateral_position: Account<'info, CollateralPosition>,

    #[account(mut)]
    pub vault_usdc_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user_usdc_account: Account<'info, TokenAccount>,

    pub user: Signer<'info>,
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct RepayLoan<'info> {
    #[account(mut)]
    pub collateral_position: Account<'info, CollateralPosition>,

    #[account(mut)]
    pub user_usdc_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub vault_usdc_account: Account<'info, TokenAccount>,

    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct WithdrawCollateral<'info> {
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub collateral_position: Account<'info, CollateralPosition>,

    #[account(mut)]
    pub vault_property_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user_property_account: Account<'info, TokenAccount>,

    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct LiquidatePosition<'info> {
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub collateral_position: Account<'info, CollateralPosition>,

    #[account(mut)]
    pub vault_property_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub liquidator_property_account: Account<'info, TokenAccount>,

    pub liquidator: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(InitSpace)]
pub struct Vault {
    pub authority: Pubkey,
    #[max_len(50)]
    pub vault_name: String,
    pub collateral_ratio: u64,
    pub total_collateral_value: u64,
    pub total_borrowed: u64,
    pub is_active: bool,
    pub created_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct CollateralPosition {
    pub user: Pubkey,
    pub vault: Pubkey,
    pub property_mint: Pubkey,
    pub collateral_amount: u64,
    pub collateral_value: u64,
    pub borrowed_amount: u64,
    pub last_update: i64,
    pub bump: u8,
}

#[error_code]
pub enum CollateralError {
    #[msg("Vault is not active")]
    InactiveVault,
    #[msg("Borrow amount exceeds collateral ratio")]
    ExceedsCollateralRatio,
    #[msg("Outstanding debt must be repaid first")]
    OutstandingDebt,
    #[msg("Insufficient collateral")]
    InsufficientCollateral,
    #[msg("Position is healthy, cannot liquidate")]
    HealthyPosition,
    #[msg("Unauthorized access")]
    Unauthorized,
}
