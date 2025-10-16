import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PROPERTY_TOKENIZATION_PROGRAM_ID } from '../programs';
import * as borsh from 'borsh';

// Instruction discriminators (first 8 bytes of instruction data)
const INSTRUCTION_DISCRIMINATORS = {
  CREATE_PROPERTY: Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]),
  TOKENIZE_PROPERTY: Buffer.from([1, 0, 0, 0, 0, 0, 0, 0]),
  BUY_SHARES: Buffer.from([2, 0, 0, 0, 0, 0, 0, 0]),
};

// Schema for CreateProperty instruction
class CreatePropertyArgs {
  name: string;
  location: string;
  total_value: bigint;
  total_shares: bigint;
  rent_per_month: bigint;
  metadata_uri: string;

  constructor(fields: {
    name: string;
    location: string;
    total_value: bigint;
    total_shares: bigint;
    rent_per_month: bigint;
    metadata_uri: string;
  }) {
    this.name = fields.name;
    this.location = fields.location;
    this.total_value = fields.total_value;
    this.total_shares = fields.total_shares;
    this.rent_per_month = fields.rent_per_month;
    this.metadata_uri = fields.metadata_uri;
  }
}

const CreatePropertySchema = new Map([
  [
    CreatePropertyArgs,
    {
      kind: 'struct',
      fields: [
        ['name', 'string'],
        ['location', 'string'],
        ['total_value', 'u64'],
        ['total_shares', 'u64'],
        ['rent_per_month', 'u64'],
        ['metadata_uri', 'string'],
      ],
    },
  ],
]);

/**
 * Creates a property on-chain
 */
export async function createPropertyInstruction(
  owner: PublicKey,
  property: PublicKey,
  args: {
    name: string;
    location: string;
    totalValue: number;
    totalShares: number;
    rentPerMonth: number;
    metadataUri: string;
  }
): Promise<TransactionInstruction> {
  const instructionData = Buffer.concat([
    INSTRUCTION_DISCRIMINATORS.CREATE_PROPERTY,
    borsh.serialize(
      CreatePropertySchema,
      new CreatePropertyArgs({
        name: args.name,
        location: args.location,
        total_value: BigInt(args.totalValue),
        total_shares: BigInt(args.totalShares),
        rent_per_month: BigInt(args.rentPerMonth),
        metadata_uri: args.metadataUri,
      })
    ),
  ]);

  const keys = [
    { pubkey: property, isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: true, isWritable: true },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: PROPERTY_TOKENIZATION_PROGRAM_ID,
    data: instructionData,
  });
}

/**
 * Tokenizes a property (creates SPL tokens for shares)
 */
export async function tokenizePropertyInstruction(
  owner: PublicKey,
  property: PublicKey,
  mint: PublicKey,
  tokenAccount: PublicKey
): Promise<TransactionInstruction> {
  const instructionData = INSTRUCTION_DISCRIMINATORS.TOKENIZE_PROPERTY;

  const keys = [
    { pubkey: property, isSigner: false, isWritable: true },
    { pubkey: mint, isSigner: false, isWritable: true },
    { pubkey: tokenAccount, isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: true, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: PROPERTY_TOKENIZATION_PROGRAM_ID,
    data: instructionData,
  });
}

/**
 * Buys shares of a property
 */
export async function buySharesInstruction(
  buyer: PublicKey,
  property: PublicKey,
  mint: PublicKey,
  buyerTokenAccount: PublicKey,
  vaultTokenAccount: PublicKey,
  amount: number
): Promise<TransactionInstruction> {
  const instructionData = Buffer.concat([
    INSTRUCTION_DISCRIMINATORS.BUY_SHARES,
    Buffer.from(new BigUint64Array([BigInt(amount)]).buffer),
  ]);

  const keys = [
    { pubkey: property, isSigner: false, isWritable: true },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: buyerTokenAccount, isSigner: false, isWritable: true },
    { pubkey: vaultTokenAccount, isSigner: false, isWritable: true },
    { pubkey: buyer, isSigner: true, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: PROPERTY_TOKENIZATION_PROGRAM_ID,
    data: instructionData,
  });
}

/**
 * Derives the PDA for a property account
 */
export function derivePropertyPDA(
  owner: PublicKey,
  propertyName: string
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('property'), owner.toBuffer(), Buffer.from(propertyName)],
    PROPERTY_TOKENIZATION_PROGRAM_ID
  );
}

/**
 * Derives the PDA for a property's token mint
 */
export function derivePropertyMintPDA(property: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('mint'), property.toBuffer()],
    PROPERTY_TOKENIZATION_PROGRAM_ID
  );
}
