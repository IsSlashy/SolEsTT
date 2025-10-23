use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};

declare_id!("9pC3GtwFCH8AE4aKMzda1EjqzH74GJ6CYMC2fWKoXKKN");

#[program]
pub mod loyalty_rewards {
    use super::*;

    /// Create loyalty program
    pub fn create_loyalty_program(
        ctx: Context<CreateLoyaltyProgram>,
        program_name: String,
        reward_rate: u64, // Points per USDC spent/earned
    ) -> Result<()> {
        let program = &mut ctx.accounts.loyalty_program;

        program.authority = ctx.accounts.authority.key();
        program.program_name = program_name;
        program.reward_token_mint = ctx.accounts.reward_token_mint.key();
        program.reward_rate = reward_rate;
        program.total_members = 0;
        program.total_rewards_distributed = 0;
        program.is_active = true;
        program.created_at = Clock::get()?.unix_timestamp;
        program.bump = ctx.bumps.loyalty_program;

        msg!("Loyalty program created: {}", program.program_name);
        Ok(())
    }

    /// Join loyalty program
    pub fn join_program(
        ctx: Context<JoinProgram>,
    ) -> Result<()> {
        let program = &mut ctx.accounts.loyalty_program;
        let member = &mut ctx.accounts.member;

        require!(program.is_active, LoyaltyError::InactiveProgram);

        member.program = program.key();
        member.user = ctx.accounts.user.key();
        member.points_earned = 0;
        member.rewards_claimed = 0;
        member.tier = MemberTier::Bronze;
        member.joined_at = Clock::get()?.unix_timestamp;
        member.bump = ctx.bumps.member;

        program.total_members = program.total_members.checked_add(1).unwrap();

        msg!("User joined loyalty program");
        Ok(())
    }

    /// Earn rewards from property investment
    pub fn earn_rewards(
        ctx: Context<EarnRewards>,
        amount: u64, // Amount invested/earned
        action: RewardAction,
    ) -> Result<()> {
        let program = &ctx.accounts.loyalty_program;
        let member = &mut ctx.accounts.member;

        require!(program.is_active, LoyaltyError::InactiveProgram);
        require_keys_eq!(member.user, ctx.accounts.user.key(), LoyaltyError::Unauthorized);

        // Calculate points based on action multiplier
        let multiplier = match action {
            RewardAction::PropertyPurchase => 2,
            RewardAction::RentalPayment => 1,
            RewardAction::StakingRewards => 3,
            RewardAction::Referral => 5,
        };

        let points = (amount as u128)
            .checked_mul(program.reward_rate as u128)
            .unwrap()
            .checked_mul(multiplier)
            .unwrap() as u64;

        member.points_earned = member.points_earned.checked_add(points).unwrap();

        // Update tier based on total points
        member.tier = calculate_tier(member.points_earned);

        msg!("Earned {} points for {:?}", points, action);
        Ok(())
    }

    /// Claim reward tokens
    pub fn claim_rewards(
        ctx: Context<ClaimRewards>,
        amount: u64,
    ) -> Result<()> {
        let program = &mut ctx.accounts.loyalty_program;
        let member = &mut ctx.accounts.member;

        require!(program.is_active, LoyaltyError::InactiveProgram);
        require_keys_eq!(member.user, ctx.accounts.user.key(), LoyaltyError::Unauthorized);
        require!(member.points_earned >= amount, LoyaltyError::InsufficientPoints);

        // Mint reward tokens to user
        token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.reward_token_mint.to_account_info(),
                    to: ctx.accounts.user_reward_account.to_account_info(),
                    authority: program.to_account_info(),
                },
                &[&[
                    b"loyalty_program",
                    program.authority.as_ref(),
                    program.program_name.as_bytes(),
                    &[program.bump],
                ]],
            ),
            amount,
        )?;

        member.points_earned = member.points_earned.checked_sub(amount).unwrap();
        member.rewards_claimed = member.rewards_claimed.checked_add(amount).unwrap();
        program.total_rewards_distributed = program.total_rewards_distributed.checked_add(amount).unwrap();

        msg!("Claimed {} reward tokens", amount);
        Ok(())
    }

    /// Stake property tokens for yield
    pub fn stake_property_tokens(
        ctx: Context<StakePropertyTokens>,
        amount: u64,
        lock_period: i64, // seconds
    ) -> Result<()> {
        let program = &ctx.accounts.loyalty_program;
        let stake = &mut ctx.accounts.stake_position;

        require!(program.is_active, LoyaltyError::InactiveProgram);

        // Transfer property tokens to stake account
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.user_property_account.to_account_info(),
                    to: ctx.accounts.stake_property_account.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount,
        )?;

        let current_time = Clock::get()?.unix_timestamp;

        stake.program = program.key();
        stake.user = ctx.accounts.user.key();
        stake.property_mint = ctx.accounts.property_mint.key();
        stake.staked_amount = amount;
        stake.lock_period = lock_period;
        stake.stake_start = current_time;
        stake.unlock_time = current_time + lock_period;
        stake.yield_claimed = 0;
        stake.is_active = true;
        stake.bump = ctx.bumps.stake_position;

        msg!("Staked {} property tokens for {} seconds", amount, lock_period);
        Ok(())
    }

    /// Claim staking yield
    pub fn claim_staking_yield(
        ctx: Context<ClaimStakingYield>,
    ) -> Result<()> {
        let program = &mut ctx.accounts.loyalty_program;
        let stake = &mut ctx.accounts.stake_position;
        let member = &mut ctx.accounts.member;

        require!(stake.is_active, LoyaltyError::InactiveStake);
        require_keys_eq!(stake.user, ctx.accounts.user.key(), LoyaltyError::Unauthorized);

        let current_time = Clock::get()?.unix_timestamp;
        let time_staked = current_time - stake.stake_start;

        // Calculate yield (example: 10% APY)
        let base_yield_rate = 1000; // 10% in basis points
        let yield_amount = (stake.staked_amount as u128)
            .checked_mul(base_yield_rate as u128)
            .unwrap()
            .checked_mul(time_staked as u128)
            .unwrap()
            .checked_div(10000 * 365 * 86400)
            .unwrap() as u64;

        // Apply tier bonus
        let tier_bonus = match member.tier {
            MemberTier::Bronze => 0,
            MemberTier::Silver => 500,  // +5%
            MemberTier::Gold => 1000,   // +10%
            MemberTier::Platinum => 2000, // +20%
        };

        let bonus_yield = (yield_amount as u128)
            .checked_mul(tier_bonus as u128)
            .unwrap()
            .checked_div(10000)
            .unwrap() as u64;

        let total_yield = yield_amount + bonus_yield;

        // Mint reward tokens as yield
        token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.reward_token_mint.to_account_info(),
                    to: ctx.accounts.user_reward_account.to_account_info(),
                    authority: program.to_account_info(),
                },
                &[&[
                    b"loyalty_program",
                    program.authority.as_ref(),
                    program.program_name.as_bytes(),
                    &[program.bump],
                ]],
            ),
            total_yield,
        )?;

        stake.yield_claimed = stake.yield_claimed.checked_add(total_yield).unwrap();
        program.total_rewards_distributed = program.total_rewards_distributed.checked_add(total_yield).unwrap();

        msg!("Claimed {} yield tokens (base: {}, bonus: {})", total_yield, yield_amount, bonus_yield);
        Ok(())
    }

    /// Unstake property tokens
    pub fn unstake_property_tokens(
        ctx: Context<UnstakePropertyTokens>,
    ) -> Result<()> {
        let program = &ctx.accounts.loyalty_program;
        let stake = &mut ctx.accounts.stake_position;

        require!(stake.is_active, LoyaltyError::InactiveStake);
        require_keys_eq!(stake.user, ctx.accounts.user.key(), LoyaltyError::Unauthorized);

        let current_time = Clock::get()?.unix_timestamp;
        require!(current_time >= stake.unlock_time, LoyaltyError::StakeLocked);

        // Transfer property tokens back to user
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.stake_property_account.to_account_info(),
                    to: ctx.accounts.user_property_account.to_account_info(),
                    authority: program.to_account_info(),
                },
                &[&[
                    b"loyalty_program",
                    program.authority.as_ref(),
                    program.program_name.as_bytes(),
                    &[program.bump],
                ]],
            ),
            stake.staked_amount,
        )?;

        stake.is_active = false;

        msg!("Unstaked {} property tokens", stake.staked_amount);
        Ok(())
    }
}

fn calculate_tier(total_points: u64) -> MemberTier {
    if total_points >= 100000 {
        MemberTier::Platinum
    } else if total_points >= 50000 {
        MemberTier::Gold
    } else if total_points >= 10000 {
        MemberTier::Silver
    } else {
        MemberTier::Bronze
    }
}

#[derive(Accounts)]
#[instruction(program_name: String)]
pub struct CreateLoyaltyProgram<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + LoyaltyProgram::INIT_SPACE,
        seeds = [b"loyalty_program", authority.key().as_ref(), program_name.as_bytes()],
        bump
    )]
    pub loyalty_program: Account<'info, LoyaltyProgram>,

    #[account(
        init,
        payer = authority,
        mint::decimals = 6,
        mint::authority = loyalty_program,
    )]
    pub reward_token_mint: Account<'info, Mint>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct JoinProgram<'info> {
    #[account(mut)]
    pub loyalty_program: Account<'info, LoyaltyProgram>,

    #[account(
        init,
        payer = user,
        space = 8 + Member::INIT_SPACE,
        seeds = [b"member", loyalty_program.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub member: Account<'info, Member>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct EarnRewards<'info> {
    pub loyalty_program: Account<'info, LoyaltyProgram>,

    #[account(mut)]
    pub member: Account<'info, Member>,

    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub loyalty_program: Account<'info, LoyaltyProgram>,

    #[account(mut)]
    pub member: Account<'info, Member>,

    #[account(mut)]
    pub reward_token_mint: Account<'info, Mint>,

    #[account(mut)]
    pub user_reward_account: Account<'info, TokenAccount>,

    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct StakePropertyTokens<'info> {
    pub loyalty_program: Account<'info, LoyaltyProgram>,

    #[account(
        init,
        payer = user,
        space = 8 + StakePosition::INIT_SPACE,
        seeds = [b"stake", loyalty_program.key().as_ref(), user.key().as_ref(), property_mint.key().as_ref()],
        bump
    )]
    pub stake_position: Account<'info, StakePosition>,

    pub property_mint: Account<'info, Mint>,

    #[account(mut)]
    pub user_property_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub stake_property_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimStakingYield<'info> {
    #[account(mut)]
    pub loyalty_program: Account<'info, LoyaltyProgram>,

    #[account(mut)]
    pub stake_position: Account<'info, StakePosition>,

    #[account(mut)]
    pub member: Account<'info, Member>,

    #[account(mut)]
    pub reward_token_mint: Account<'info, Mint>,

    #[account(mut)]
    pub user_reward_account: Account<'info, TokenAccount>,

    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UnstakePropertyTokens<'info> {
    pub loyalty_program: Account<'info, LoyaltyProgram>,

    #[account(mut)]
    pub stake_position: Account<'info, StakePosition>,

    #[account(mut)]
    pub stake_property_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user_property_account: Account<'info, TokenAccount>,

    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(InitSpace)]
pub struct LoyaltyProgram {
    pub authority: Pubkey,
    #[max_len(50)]
    pub program_name: String,
    pub reward_token_mint: Pubkey,
    pub reward_rate: u64,
    pub total_members: u64,
    pub total_rewards_distributed: u64,
    pub is_active: bool,
    pub created_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Member {
    pub program: Pubkey,
    pub user: Pubkey,
    pub points_earned: u64,
    pub rewards_claimed: u64,
    pub tier: MemberTier,
    pub joined_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct StakePosition {
    pub program: Pubkey,
    pub user: Pubkey,
    pub property_mint: Pubkey,
    pub staked_amount: u64,
    pub lock_period: i64,
    pub stake_start: i64,
    pub unlock_time: i64,
    pub yield_claimed: u64,
    pub is_active: bool,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum MemberTier {
    Bronze,
    Silver,
    Gold,
    Platinum,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub enum RewardAction {
    PropertyPurchase,
    RentalPayment,
    StakingRewards,
    Referral,
}

#[error_code]
pub enum LoyaltyError {
    #[msg("Loyalty program is not active")]
    InactiveProgram,
    #[msg("Stake position is not active")]
    InactiveStake,
    #[msg("Insufficient points")]
    InsufficientPoints,
    #[msg("Stake is still locked")]
    StakeLocked,
    #[msg("Unauthorized access")]
    Unauthorized,
}
