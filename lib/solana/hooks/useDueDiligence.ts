import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';

export interface PropertyDocument {
  id: string;
  propertyAddress: string;
  type: 'title' | 'inspection' | 'appraisal' | 'insurance' | 'permit' | 'other';
  name: string;
  ipfsHash: string; // For decentralized storage
  uploadedBy: string;
  uploadedAt: number;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: number;
}

export interface PropertyVerification {
  propertyAddress: string;
  titleVerified: boolean;
  inspectionCompleted: boolean;
  appraisalCompleted: boolean;
  insuranceActive: boolean;
  complianceScore: number; // 0-100
  lastUpdated: number;
}

export function useDueDiligence() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload a property document
   */
  const uploadDocument = async (
    propertyAddress: string,
    type: PropertyDocument['type'],
    name: string,
    file: File
  ) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // In production, upload to IPFS/Arweave
      // For demo, create a mock hash
      const ipfsHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

      const document: PropertyDocument = {
        id: `doc_${Date.now()}`,
        propertyAddress,
        type,
        name,
        ipfsHash,
        uploadedBy: publicKey.toBase58(),
        uploadedAt: Date.now(),
        verified: false,
      };

      // Store document metadata
      const documents = JSON.parse(localStorage.getItem('property_documents') || '[]');
      documents.push(document);
      localStorage.setItem('property_documents', JSON.stringify(documents));

      setLoading(false);
      return { document };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Verify a document (for authorized verifiers)
   */
  const verifyDocument = async (documentId: string) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const documents = JSON.parse(localStorage.getItem('property_documents') || '[]');
      const docIndex = documents.findIndex((d: PropertyDocument) => d.id === documentId);

      if (docIndex === -1) {
        throw new Error('Document not found');
      }

      documents[docIndex].verified = true;
      documents[docIndex].verifiedBy = publicKey.toBase58();
      documents[docIndex].verifiedAt = Date.now();

      localStorage.setItem('property_documents', JSON.stringify(documents));

      setLoading(false);
      return { documentId };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Get documents for a property
   */
  const getPropertyDocuments = (propertyAddress: string): PropertyDocument[] => {
    const documents = JSON.parse(localStorage.getItem('property_documents') || '[]');
    return documents.filter((d: PropertyDocument) =>
      d.propertyAddress === propertyAddress
    );
  };

  /**
   * Get verification status for a property
   */
  const getVerificationStatus = (propertyAddress: string): PropertyVerification => {
    const documents = getPropertyDocuments(propertyAddress);

    const titleDoc = documents.find(d => d.type === 'title' && d.verified);
    const inspectionDoc = documents.find(d => d.type === 'inspection' && d.verified);
    const appraisalDoc = documents.find(d => d.type === 'appraisal' && d.verified);
    const insuranceDoc = documents.find(d => d.type === 'insurance' && d.verified);

    const verifiedCount = [titleDoc, inspectionDoc, appraisalDoc, insuranceDoc]
      .filter(Boolean).length;

    return {
      propertyAddress,
      titleVerified: !!titleDoc,
      inspectionCompleted: !!inspectionDoc,
      appraisalCompleted: !!appraisalDoc,
      insuranceActive: !!insuranceDoc,
      complianceScore: (verifiedCount / 4) * 100,
      lastUpdated: Date.now(),
    };
  };

  /**
   * Create a proof-of-ownership NFT
   */
  const mintOwnershipNFT = async (propertyAddress: string) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // In production, mint an actual NFT on Solana
      // For demo, create a mock NFT
      const nft = {
        id: `nft_${Date.now()}`,
        propertyAddress,
        owner: publicKey.toBase58(),
        mintedAt: Date.now(),
        metadata: {
          name: `Property Ownership - ${propertyAddress.substring(0, 8)}`,
          symbol: 'PROPNFT',
          uri: `https://arweave.net/mock-${Date.now()}`,
        },
      };

      // Store NFT
      const nfts = JSON.parse(localStorage.getItem('ownership_nfts') || '[]');
      nfts.push(nft);
      localStorage.setItem('ownership_nfts', JSON.stringify(nfts));

      setLoading(false);
      return { nft };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    uploadDocument,
    verifyDocument,
    getPropertyDocuments,
    getVerificationStatus,
    mintOwnershipNFT,
    loading,
    error,
  };
}
