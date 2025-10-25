use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("pRoPoA8Q748zuxX2DptJpC9b8e3a56Ap3FVUu5U7r6Z");

#[program]
pub mod property_tokenization {
    use super::*;

    /// Initialize a new property NFT
    pub fn create_property(
        ctx: Context<CreateProperty>,
        name: String,
        location: String,
        total_value: u64,
        total_shares: u64,
        rent_per_month: u64,
        metadata_uri: String,
    ) -> Result<()> {
        let property = &mut ctx.accounts.property;

        property.authority = ctx.accounts.authority.key();
        property.name = name;
        property.location = location;
        property.total_value = total_value;
        property.total_shares = total_shares;
        property.available_shares = total_shares;
        property.rent_per_month = rent_per_month;
        property.metadata_uri = metadata_uri;
        property.is_tokenized = false;
        property.created_at = Clock::get()?.unix_timestamp;
        property.bump = *ctx.bumps.get("property").unwrap();

        msg!("Property created: {}", property.name);
        Ok(())
    }

    /// Tokenize the property by creating fractional shares (SPL tokens)
    pub fn tokenize_property(
        ctx: Context<TokenizeProperty>,
    ) -> Result<()> {
        let property = &mut ctx.accounts.property;

        require!(!property.is_tokenized, PropertyError::AlreadyTokenized);
        require_keys_eq!(property.authority, ctx.accounts.authority.key(), PropertyError::Unauthorized);

        property.token_mint = ctx.accounts.token_mint.key();
        property.is_tokenized = true;

        msg!("Property tokenized with {} shares", property.total_shares);
        Ok(())
    }

    /// Buy fractional shares of a property
    pub fn buy_shares(
        ctx: Context<BuyShares>,
        amount: u64,
    ) -> Result<()> {
        let property = &mut ctx.accounts.property;

        require!(property.is_tokenized, PropertyError::NotTokenized);
        require!(amount <= property.available_shares, PropertyError::InsufficientShares);

        // Transfer SOL from buyer to property owner
        let transfer_amount = (amount as u128)
            .checked_mul(property.total_value as u128)
            .unwrap()
            .checked_div(property.total_shares as u128)
            .unwrap() as u64;

        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.property_owner.to_account_info(),
                },
            ),
            transfer_amount,
        )?;

        // Transfer tokens to buyer
        token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.token_mint.to_account_info(),
                    to: ctx.accounts.buyer_token_account.to_account_info(),
                    authority: property.to_account_info(),
                },
                &[&[
                    b"property",
                    property.authority.as_ref(),
                    property.name.as_bytes(),
                    &[property.bump],
                ]],
            ),
            amount,
        )?;

        property.available_shares = property.available_shares.checked_sub(amount).unwrap();

        msg!("Bought {} shares for {} lamports", amount, transfer_amount);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateProperty<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Property::INIT_SPACE,
        seeds = [b"property", authority.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub property: Account<'info, Property>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TokenizeProperty<'info> {
    #[account(mut)]
    pub property: Account<'info, Property>,

    #[account(
        init,
        payer = authority,
        mint::decimals = 0,
        mint::authority = property,
    )]
    pub token_mint: Account<'info, Mint>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct BuyShares<'info> {
    #[account(mut)]
    pub property: Account<'info, Property>,

    #[account(mut)]
    pub token_mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = token_mint,
        associated_token::authority = buyer,
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    /// CHECK: Property owner receives payment
    #[account(mut)]
    pub property_owner: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, anchor_spl::associated_token::AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Property {
    pub authority: Pubkey,
    #[max_len(100)]
    pub name: String,
    #[max_len(200)]
    pub location: String,
    pub total_value: u64,
    pub total_shares: u64,
    pub available_shares: u64,
    pub rent_per_month: u64,
    #[max_len(200)]
    pub metadata_uri: String,
    pub token_mint: Pubkey,
    pub is_tokenized: bool,
    pub created_at: i64,
    pub bump: u8,
}

#[error_code]
pub enum PropertyError {
    #[msg("Property is already tokenized")]
    AlreadyTokenized,
    #[msg("Property is not tokenized yet")]
    NotTokenized,
    #[msg("Insufficient shares available")]
    InsufficientShares,
    #[msg("Unauthorized access")]
    Unauthorized,
}
