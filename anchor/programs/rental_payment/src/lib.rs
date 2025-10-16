use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("11111111111111111111111111111111");

#[program]
pub mod rental_payment {
    use super::*;

    /// Create a rental agreement
    pub fn create_rental_agreement(
        ctx: Context<CreateRentalAgreement>,
        property_id: Pubkey,
        rent_amount: u64,
        payment_frequency: u64, // in seconds (e.g., 30 days = 2592000)
    ) -> Result<()> {
        let rental = &mut ctx.accounts.rental_agreement;

        rental.landlord = ctx.accounts.landlord.key();
        rental.tenant = ctx.accounts.tenant.key();
        rental.property_id = property_id;
        rental.rent_amount = rent_amount;
        rental.payment_frequency = payment_frequency;
        rental.last_payment_date = 0;
        rental.total_payments = 0;
        rental.is_active = true;
        rental.created_at = Clock::get()?.unix_timestamp;
        rental.bump = ctx.bumps.rental_agreement;

        msg!("Rental agreement created for property: {}", property_id);
        Ok(())
    }

    /// Pay rent using USDC
    pub fn pay_rent(
        ctx: Context<PayRent>,
    ) -> Result<()> {
        let rental = &mut ctx.accounts.rental_agreement;

        require!(rental.is_active, RentalError::InactiveAgreement);
        require_keys_eq!(rental.tenant, ctx.accounts.tenant.key(), RentalError::Unauthorized);

        let current_time = Clock::get()?.unix_timestamp;

        // Check if payment is due
        if rental.last_payment_date != 0 {
            let time_since_last_payment = current_time - rental.last_payment_date;
            require!(
                time_since_last_payment as u64 >= rental.payment_frequency,
                RentalError::PaymentNotDue
            );
        }

        // Transfer USDC from tenant to landlord
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.tenant_token_account.to_account_info(),
                    to: ctx.accounts.landlord_token_account.to_account_info(),
                    authority: ctx.accounts.tenant.to_account_info(),
                },
            ),
            rental.rent_amount,
        )?;

        rental.last_payment_date = current_time;
        rental.total_payments = rental.total_payments.checked_add(1).unwrap();

        msg!("Rent paid: {} USDC", rental.rent_amount);
        Ok(())
    }

    /// Terminate rental agreement
    pub fn terminate_rental(
        ctx: Context<TerminateRental>,
    ) -> Result<()> {
        let rental = &mut ctx.accounts.rental_agreement;

        require!(rental.is_active, RentalError::InactiveAgreement);
        require!(
            rental.landlord == ctx.accounts.authority.key() || rental.tenant == ctx.accounts.authority.key(),
            RentalError::Unauthorized
        );

        rental.is_active = false;

        msg!("Rental agreement terminated");
        Ok(())
    }

    /// Distribute rental income to property token holders
    pub fn distribute_rental_income(
        ctx: Context<DistributeIncome>,
        amount: u64,
    ) -> Result<()> {
        let rental = &ctx.accounts.rental_agreement;

        require!(rental.is_active, RentalError::InactiveAgreement);
        require_keys_eq!(rental.landlord, ctx.accounts.landlord.key(), RentalError::Unauthorized);

        // Transfer USDC from landlord to token holder
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.landlord_token_account.to_account_info(),
                    to: ctx.accounts.holder_token_account.to_account_info(),
                    authority: ctx.accounts.landlord.to_account_info(),
                },
            ),
            amount,
        )?;

        msg!("Distributed {} USDC to token holder", amount);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(property_id: Pubkey)]
pub struct CreateRentalAgreement<'info> {
    #[account(
        init,
        payer = landlord,
        space = 8 + RentalAgreement::INIT_SPACE,
        seeds = [b"rental", landlord.key().as_ref(), tenant.key().as_ref(), property_id.as_ref()],
        bump
    )]
    pub rental_agreement: Account<'info, RentalAgreement>,

    #[account(mut)]
    pub landlord: Signer<'info>,

    /// CHECK: Tenant address
    pub tenant: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PayRent<'info> {
    #[account(mut)]
    pub rental_agreement: Account<'info, RentalAgreement>,

    #[account(mut)]
    pub tenant_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub landlord_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub tenant: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct TerminateRental<'info> {
    #[account(mut)]
    pub rental_agreement: Account<'info, RentalAgreement>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct DistributeIncome<'info> {
    pub rental_agreement: Account<'info, RentalAgreement>,

    #[account(mut)]
    pub landlord_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub holder_token_account: Account<'info, TokenAccount>,

    pub landlord: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(InitSpace)]
pub struct RentalAgreement {
    pub landlord: Pubkey,
    pub tenant: Pubkey,
    pub property_id: Pubkey,
    pub rent_amount: u64,
    pub payment_frequency: u64,
    pub last_payment_date: i64,
    pub total_payments: u64,
    pub is_active: bool,
    pub created_at: i64,
    pub bump: u8,
}

#[error_code]
pub enum RentalError {
    #[msg("Rental agreement is not active")]
    InactiveAgreement,
    #[msg("Payment is not due yet")]
    PaymentNotDue,
    #[msg("Unauthorized access")]
    Unauthorized,
}
