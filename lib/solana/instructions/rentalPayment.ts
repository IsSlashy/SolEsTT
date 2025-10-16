import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { RENTAL_PAYMENT_PROGRAM_ID, USDC_MINT_DEVNET } from '../programs';
import * as borsh from 'borsh';

// Instruction discriminators
const INSTRUCTION_DISCRIMINATORS = {
  CREATE_RENTAL_AGREEMENT: Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]),
  PAY_RENT: Buffer.from([1, 0, 0, 0, 0, 0, 0, 0]),
  DISTRIBUTE_INCOME: Buffer.from([2, 0, 0, 0, 0, 0, 0, 0]),
};

// Schema for CreateRentalAgreement instruction
class CreateRentalAgreementArgs {
  property_id: Uint8Array;
  rent_amount: bigint;
  payment_frequency: bigint;

  constructor(fields: {
    property_id: Uint8Array;
    rent_amount: bigint;
    payment_frequency: bigint;
  }) {
    this.property_id = fields.property_id;
    this.rent_amount = fields.rent_amount;
    this.payment_frequency = fields.payment_frequency;
  }
}

const CreateRentalAgreementSchema = new Map([
  [
    CreateRentalAgreementArgs,
    {
      kind: 'struct',
      fields: [
        ['property_id', [32]],
        ['rent_amount', 'u64'],
        ['payment_frequency', 'u64'],
      ],
    },
  ],
]);

/**
 * Creates a rental agreement on-chain
 */
export async function createRentalAgreementInstruction(
  landlord: PublicKey,
  tenant: PublicKey,
  rentalAgreement: PublicKey,
  propertyId: PublicKey,
  rentAmount: number,
  paymentFrequency: number
): Promise<TransactionInstruction> {
  const instructionData = Buffer.concat([
    INSTRUCTION_DISCRIMINATORS.CREATE_RENTAL_AGREEMENT,
    borsh.serialize(
      CreateRentalAgreementSchema,
      new CreateRentalAgreementArgs({
        property_id: propertyId.toBytes(),
        rent_amount: BigInt(rentAmount),
        payment_frequency: BigInt(paymentFrequency),
      })
    ),
  ]);

  const keys = [
    { pubkey: rentalAgreement, isSigner: false, isWritable: true },
    { pubkey: landlord, isSigner: true, isWritable: true },
    { pubkey: tenant, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: RENTAL_PAYMENT_PROGRAM_ID,
    data: instructionData,
  });
}

/**
 * Pays rent using USDC
 */
export async function payRentInstruction(
  tenant: PublicKey,
  landlord: PublicKey,
  rentalAgreement: PublicKey,
  tenantUsdcAccount: PublicKey,
  landlordUsdcAccount: PublicKey,
  amount: number
): Promise<TransactionInstruction> {
  const instructionData = INSTRUCTION_DISCRIMINATORS.PAY_RENT;

  const keys = [
    { pubkey: rentalAgreement, isSigner: false, isWritable: true },
    { pubkey: tenant, isSigner: true, isWritable: false },
    { pubkey: landlord, isSigner: false, isWritable: false },
    { pubkey: tenantUsdcAccount, isSigner: false, isWritable: true },
    { pubkey: landlordUsdcAccount, isSigner: false, isWritable: true },
    { pubkey: USDC_MINT_DEVNET, isSigner: false, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: RENTAL_PAYMENT_PROGRAM_ID,
    data: instructionData,
  });
}

/**
 * Distributes rental income to token holders
 */
export async function distributeIncomeInstruction(
  landlord: PublicKey,
  rentalAgreement: PublicKey,
  propertyMint: PublicKey,
  amount: number
): Promise<TransactionInstruction> {
  const instructionData = Buffer.concat([
    INSTRUCTION_DISCRIMINATORS.DISTRIBUTE_INCOME,
    Buffer.from(new BigUint64Array([BigInt(amount)]).buffer),
  ]);

  const keys = [
    { pubkey: rentalAgreement, isSigner: false, isWritable: true },
    { pubkey: landlord, isSigner: true, isWritable: false },
    { pubkey: propertyMint, isSigner: false, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: RENTAL_PAYMENT_PROGRAM_ID,
    data: instructionData,
  });
}

/**
 * Derives the PDA for a rental agreement
 */
export function deriveRentalAgreementPDA(
  propertyId: PublicKey,
  tenant: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('rental'), propertyId.toBuffer(), tenant.toBuffer()],
    RENTAL_PAYMENT_PROGRAM_ID
  );
}

/**
 * Gets the USDC token account for a user
 */
export async function getUsdcTokenAccount(
  connection: Connection,
  userPublicKey: PublicKey
): Promise<PublicKey> {
  return await getAssociatedTokenAddress(
    USDC_MINT_DEVNET,
    userPublicKey
  );
}
