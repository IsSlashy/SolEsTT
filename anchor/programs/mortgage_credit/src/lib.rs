use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("844W813eCyb4cAsUV6yC7P4Vc7AYAP1KHJiFBkBy1vcq");

#[program]
pub mod mortgage_credit {
    use super::*;

    /// Create a mortgage pool for property-backed lending
    pub fn create_mortgage_pool(
        ctx: Context<CreateMortgagePool>,
        pool_name: String,
        interest_rate: u64, // basis points (e.g., 500 = 5%)
        max_ltv: u64,       // max loan-to-value ratio in basis points
        min_credit_score: u16,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.mortgage_pool;

        pool.authority = ctx.accounts.authority.key();
        pool.pool_name = pool_name;
        pool.interest_rate = interest_rate;
        pool.max_ltv = max_ltv;
        pool.min_credit_score = min_credit_score;
        pool.total_liquidity = 0;
        pool.total_borrowed = 0;
        pool.is_active = true;
        pool.created_at = Clock::get()?.unix_timestamp;
        pool.bump = ctx.bumps.mortgage_pool;

        msg!("Mortgage pool created: {}", pool.pool_name);
        Ok(())
    }

    /// Deposit liquidity into mortgage pool
    pub fn deposit_liquidity(
        ctx: Context<DepositLiquidity>,
        amount: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.mortgage_pool;

        require!(pool.is_active, MortgageError::InactivePool);

        // Transfer USDC to pool
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.depositor_token_account.to_account_info(),
                    to: ctx.accounts.pool_token_account.to_account_info(),
                    authority: ctx.accounts.depositor.to_account_info(),
                },
            ),
            amount,
        )?;

        pool.total_liquidity = pool.total_liquidity.checked_add(amount).unwrap();

        msg!("Deposited {} USDC to pool", amount);
        Ok(())
    }

    /// Request a mortgage loan backed by property tokens
    pub fn request_mortgage(
        ctx: Context<RequestMortgage>,
        property_mint: Pubkey,
        loan_amount: u64,
        collateral_shares: u64,
        credit_score: u16,
    ) -> Result<()> {
        let pool = &ctx.accounts.mortgage_pool;
        let mortgage = &mut ctx.accounts.mortgage;

        require!(pool.is_active, MortgageError::InactivePool);
        require!(credit_score >= pool.min_credit_score, MortgageError::InsufficientCreditScore);

        // Calculate max loan based on LTV
        let max_loan = (collateral_shares as u128)
            .checked_mul(pool.max_ltv as u128)
            .unwrap()
            .checked_div(10000)
            .unwrap() as u64;

        require!(loan_amount <= max_loan, MortgageError::ExceedsMaxLTV);

        mortgage.borrower = ctx.accounts.borrower.key();
        mortgage.pool = pool.key();
        mortgage.property_mint = property_mint;
        mortgage.loan_amount = loan_amount;
        mortgage.collateral_shares = collateral_shares;
        mortgage.interest_rate = pool.interest_rate;
        mortgage.outstanding_balance = loan_amount;
        mortgage.credit_score = credit_score;
        mortgage.is_active = true;
        mortgage.start_date = Clock::get()?.unix_timestamp;
        mortgage.last_payment_date = 0;
        mortgage.bump = ctx.bumps.mortgage;

        msg!("Mortgage requested: {} USDC at {}%", loan_amount, pool.interest_rate / 100);
        Ok(())
    }

    /// Approve and fund mortgage
    pub fn approve_mortgage(
        ctx: Context<ApproveMortgage>,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.mortgage_pool;
        let mortgage = &ctx.accounts.mortgage;

        require!(mortgage.is_active, MortgageError::InactiveMortgage);
        require!(pool.total_liquidity >= mortgage.loan_amount, MortgageError::InsufficientLiquidity);

        // Transfer loan to borrower
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.pool_token_account.to_account_info(),
                    to: ctx.accounts.borrower_token_account.to_account_info(),
                    authority: ctx.accounts.authority.to_account_info(),
                },
            ),
            mortgage.loan_amount,
        )?;

        pool.total_borrowed = pool.total_borrowed.checked_add(mortgage.loan_amount).unwrap();
        pool.total_liquidity = pool.total_liquidity.checked_sub(mortgage.loan_amount).unwrap();

        msg!("Mortgage approved and funded: {} USDC", mortgage.loan_amount);
        Ok(())
    }

    /// Make mortgage payment
    pub fn pay_mortgage(
        ctx: Context<PayMortgage>,
        payment_amount: u64,
    ) -> Result<()> {
        let mortgage = &mut ctx.accounts.mortgage;
        let pool = &mut ctx.accounts.mortgage_pool;

        require!(mortgage.is_active, MortgageError::InactiveMortgage);
        require_keys_eq!(mortgage.borrower, ctx.accounts.borrower.key(), MortgageError::Unauthorized);

        // Calculate interest
        let current_time = Clock::get()?.unix_timestamp;
        let time_elapsed = if mortgage.last_payment_date == 0 {
            current_time - mortgage.start_date
        } else {
            current_time - mortgage.last_payment_date
        };

        let interest = (mortgage.outstanding_balance as u128)
            .checked_mul(mortgage.interest_rate as u128)
            .unwrap()
            .checked_mul(time_elapsed as u128)
            .unwrap()
            .checked_div(10000 * 365 * 86400)
            .unwrap() as u64;

        // Transfer payment to pool
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.borrower_token_account.to_account_info(),
                    to: ctx.accounts.pool_token_account.to_account_info(),
                    authority: ctx.accounts.borrower.to_account_info(),
                },
            ),
            payment_amount,
        )?;

        // Update balances
        let principal_payment = if payment_amount > interest {
            payment_amount - interest
        } else {
            0
        };

        mortgage.outstanding_balance = mortgage.outstanding_balance.saturating_sub(principal_payment);
        mortgage.last_payment_date = current_time;
        pool.total_liquidity = pool.total_liquidity.checked_add(payment_amount).unwrap();
        pool.total_borrowed = pool.total_borrowed.saturating_sub(principal_payment);

        if mortgage.outstanding_balance == 0 {
            mortgage.is_active = false;
        }

        msg!("Payment: {} USDC (Interest: {}, Principal: {})", payment_amount, interest, principal_payment);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(pool_name: String)]
pub struct CreateMortgagePool<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + MortgagePool::INIT_SPACE,
        seeds = [b"mortgage_pool", authority.key().as_ref(), pool_name.as_bytes()],
        bump
    )]
    pub mortgage_pool: Account<'info, MortgagePool>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositLiquidity<'info> {
    #[account(mut)]
    pub mortgage_pool: Account<'info, MortgagePool>,

    #[account(mut)]
    pub depositor_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub pool_token_account: Account<'info, TokenAccount>,

    pub depositor: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct RequestMortgage<'info> {
    pub mortgage_pool: Account<'info, MortgagePool>,

    #[account(
        init,
        payer = borrower,
        space = 8 + Mortgage::INIT_SPACE,
        seeds = [b"mortgage", borrower.key().as_ref(), mortgage_pool.key().as_ref()],
        bump
    )]
    pub mortgage: Account<'info, Mortgage>,

    #[account(mut)]
    pub borrower: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApproveMortgage<'info> {
    #[account(mut)]
    pub mortgage_pool: Account<'info, MortgagePool>,

    pub mortgage: Account<'info, Mortgage>,

    #[account(mut)]
    pub pool_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub borrower_token_account: Account<'info, TokenAccount>,

    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct PayMortgage<'info> {
    #[account(mut)]
    pub mortgage: Account<'info, Mortgage>,

    #[account(mut)]
    pub mortgage_pool: Account<'info, MortgagePool>,

    #[account(mut)]
    pub borrower_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub pool_token_account: Account<'info, TokenAccount>,

    pub borrower: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(InitSpace)]
pub struct MortgagePool {
    pub authority: Pubkey,
    #[max_len(50)]
    pub pool_name: String,
    pub interest_rate: u64,
    pub max_ltv: u64,
    pub min_credit_score: u16,
    pub total_liquidity: u64,
    pub total_borrowed: u64,
    pub is_active: bool,
    pub created_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Mortgage {
    pub borrower: Pubkey,
    pub pool: Pubkey,
    pub property_mint: Pubkey,
    pub loan_amount: u64,
    pub collateral_shares: u64,
    pub interest_rate: u64,
    pub outstanding_balance: u64,
    pub credit_score: u16,
    pub is_active: bool,
    pub start_date: i64,
    pub last_payment_date: i64,
    pub bump: u8,
}

#[error_code]
pub enum MortgageError {
    #[msg("Mortgage pool is not active")]
    InactivePool,
    #[msg("Mortgage is not active")]
    InactiveMortgage,
    #[msg("Credit score is too low")]
    InsufficientCreditScore,
    #[msg("Loan amount exceeds maximum LTV ratio")]
    ExceedsMaxLTV,
    #[msg("Insufficient liquidity in pool")]
    InsufficientLiquidity,
    #[msg("Unauthorized access")]
    Unauthorized,
}
