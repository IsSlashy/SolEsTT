use anchor_lang::prelude::*;

declare_id!("3sAgvazb2XkbD5EPgZS73jLiKFtJAtBS5ujB1dzCHofU");

#[program]
pub mod property_diligence {
    use super::*;

    /// Create property verification registry
    pub fn create_registry(
        ctx: Context<CreateRegistry>,
        registry_name: String,
    ) -> Result<()> {
        let registry = &mut ctx.accounts.registry;

        registry.authority = ctx.accounts.authority.key();
        registry.registry_name = registry_name;
        registry.total_properties = 0;
        registry.total_verifiers = 0;
        registry.created_at = Clock::get()?.unix_timestamp;
        registry.bump = *ctx.bumps.get("registry").unwrap();

        msg!("Property registry created: {}", registry.registry_name);
        Ok(())
    }

    /// Register a verifier (inspector, notary, etc.)
    pub fn register_verifier(
        ctx: Context<RegisterVerifier>,
        verifier_name: String,
        verifier_type: VerifierType,
        credentials: String,
    ) -> Result<()> {
        let registry = &mut ctx.accounts.registry;
        let verifier = &mut ctx.accounts.verifier;

        require_keys_eq!(registry.authority, ctx.accounts.authority.key(), DiligenceError::Unauthorized);

        verifier.registry = registry.key();
        verifier.verifier_address = ctx.accounts.verifier_address.key();
        verifier.verifier_name = verifier_name;
        verifier.verifier_type = verifier_type;
        verifier.credentials = credentials;
        verifier.total_verifications = 0;
        verifier.is_active = true;
        verifier.registered_at = Clock::get()?.unix_timestamp;
        verifier.bump = *ctx.bumps.get("verifier").unwrap();

        registry.total_verifiers = registry.total_verifiers.checked_add(1).unwrap();

        msg!("Verifier registered: {}", verifier.verifier_name);
        Ok(())
    }

    /// Submit property for verification
    pub fn submit_property_verification(
        ctx: Context<SubmitPropertyVerification>,
        property_address: String,
        property_type: PropertyType,
        declared_value: u64,
        document_hash: String,
    ) -> Result<()> {
        let registry = &mut ctx.accounts.registry;
        let verification = &mut ctx.accounts.property_verification;

        verification.registry = registry.key();
        verification.property_owner = ctx.accounts.owner.key();
        verification.property_address = property_address;
        verification.property_type = property_type;
        verification.declared_value = declared_value;
        verification.document_hash = document_hash;
        verification.verification_status = VerificationStatus::Pending;
        verification.verifications_count = 0;
        verification.submitted_at = Clock::get()?.unix_timestamp;
        verification.bump = *ctx.bumps.get("property_verification").unwrap();

        registry.total_properties = registry.total_properties.checked_add(1).unwrap();

        msg!("Property submitted for verification: {}", verification.property_address);
        Ok(())
    }

    /// Verify property (by authorized verifier)
    pub fn verify_property(
        ctx: Context<VerifyProperty>,
        verification_result: VerificationResult,
        verified_value: u64,
        notes: String,
    ) -> Result<()> {
        let verifier = &mut ctx.accounts.verifier;
        let verification = &mut ctx.accounts.property_verification;
        let attestation = &mut ctx.accounts.verification_attestation;

        require!(verifier.is_active, DiligenceError::InactiveVerifier);
        require_keys_eq!(verifier.verifier_address, ctx.accounts.verifier_signer.key(), DiligenceError::Unauthorized);

        attestation.property_verification = verification.key();
        attestation.verifier = verifier.key();
        attestation.verification_result = verification_result;
        attestation.verified_value = verified_value;
        attestation.notes = notes;
        attestation.verified_at = Clock::get()?.unix_timestamp;
        attestation.bump = *ctx.bumps.get("verification_attestation").unwrap();

        verification.verifications_count = verification.verifications_count.checked_add(1).unwrap();
        verifier.total_verifications = verifier.total_verifications.checked_add(1).unwrap();

        // Update status if verified by multiple verifiers
        if verification.verifications_count >= 2 {
            verification.verification_status = VerificationStatus::Verified;
            verification.verified_at = Clock::get()?.unix_timestamp;
        }

        msg!("Property verification completed by {}", verifier.verifier_name);
        Ok(())
    }

    /// Record ownership transfer with verification
    pub fn record_ownership_transfer(
        ctx: Context<RecordOwnershipTransfer>,
        new_owner: Pubkey,
        transfer_price: u64,
    ) -> Result<()> {
        let verification = &mut ctx.accounts.property_verification;

        require_keys_eq!(verification.property_owner, ctx.accounts.current_owner.key(), DiligenceError::Unauthorized);
        require!(verification.verification_status == VerificationStatus::Verified, DiligenceError::UnverifiedProperty);

        verification.property_owner = new_owner;
        verification.declared_value = transfer_price;

        msg!("Ownership transferred to {}", new_owner);
        Ok(())
    }

    /// Flag property for re-verification
    pub fn flag_for_reverification(
        ctx: Context<FlagForReverification>,
        reason: String,
    ) -> Result<()> {
        let registry = &ctx.accounts.registry;
        let verification = &mut ctx.accounts.property_verification;

        require_keys_eq!(registry.authority, ctx.accounts.authority.key(), DiligenceError::Unauthorized);

        verification.verification_status = VerificationStatus::Flagged;
        verification.flag_reason = Some(reason);

        msg!("Property flagged for re-verification");
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(registry_name: String)]
pub struct CreateRegistry<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + PropertyRegistry::INIT_SPACE,
        seeds = [b"registry", authority.key().as_ref(), registry_name.as_bytes()],
        bump
    )]
    pub registry: Account<'info, PropertyRegistry>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterVerifier<'info> {
    #[account(mut)]
    pub registry: Account<'info, PropertyRegistry>,

    #[account(
        init,
        payer = authority,
        space = 8 + Verifier::INIT_SPACE,
        seeds = [b"verifier", registry.key().as_ref(), verifier_address.key().as_ref()],
        bump
    )]
    pub verifier: Account<'info, Verifier>,

    /// CHECK: Verifier's wallet address
    pub verifier_address: AccountInfo<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(property_address: String)]
pub struct SubmitPropertyVerification<'info> {
    #[account(mut)]
    pub registry: Account<'info, PropertyRegistry>,

    #[account(
        init,
        payer = owner,
        space = 8 + PropertyVerification::INIT_SPACE,
        seeds = [b"property", registry.key().as_ref(), property_address.as_bytes()],
        bump
    )]
    pub property_verification: Account<'info, PropertyVerification>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyProperty<'info> {
    #[account(mut)]
    pub verifier: Account<'info, Verifier>,

    #[account(mut)]
    pub property_verification: Account<'info, PropertyVerification>,

    #[account(
        init,
        payer = verifier_signer,
        space = 8 + VerificationAttestation::INIT_SPACE,
        seeds = [b"attestation", property_verification.key().as_ref(), verifier.key().as_ref()],
        bump
    )]
    pub verification_attestation: Account<'info, VerificationAttestation>,

    #[account(mut)]
    pub verifier_signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RecordOwnershipTransfer<'info> {
    #[account(mut)]
    pub property_verification: Account<'info, PropertyVerification>,

    pub current_owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct FlagForReverification<'info> {
    pub registry: Account<'info, PropertyRegistry>,

    #[account(mut)]
    pub property_verification: Account<'info, PropertyVerification>,

    pub authority: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct PropertyRegistry {
    pub authority: Pubkey,
    #[max_len(50)]
    pub registry_name: String,
    pub total_properties: u64,
    pub total_verifiers: u32,
    pub created_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Verifier {
    pub registry: Pubkey,
    pub verifier_address: Pubkey,
    #[max_len(100)]
    pub verifier_name: String,
    pub verifier_type: VerifierType,
    #[max_len(200)]
    pub credentials: String,
    pub total_verifications: u64,
    pub is_active: bool,
    pub registered_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct PropertyVerification {
    pub registry: Pubkey,
    pub property_owner: Pubkey,
    #[max_len(200)]
    pub property_address: String,
    pub property_type: PropertyType,
    pub declared_value: u64,
    #[max_len(64)]
    pub document_hash: String,
    pub verification_status: VerificationStatus,
    pub verifications_count: u8,
    pub submitted_at: i64,
    pub verified_at: i64,
    #[max_len(200)]
    pub flag_reason: Option<String>,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct VerificationAttestation {
    pub property_verification: Pubkey,
    pub verifier: Pubkey,
    pub verification_result: VerificationResult,
    pub verified_value: u64,
    #[max_len(500)]
    pub notes: String,
    pub verified_at: i64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum VerifierType {
    Inspector,
    Notary,
    Appraiser,
    TitleCompany,
    Government,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum PropertyType {
    Residential,
    Commercial,
    Industrial,
    Land,
    MixedUse,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum VerificationStatus {
    Pending,
    Verified,
    Flagged,
    Rejected,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum VerificationResult {
    Approved,
    ApprovedWithConditions,
    Rejected,
}

#[error_code]
pub enum DiligenceError {
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Verifier is not active")]
    InactiveVerifier,
    #[msg("Property has not been verified")]
    UnverifiedProperty,
}
