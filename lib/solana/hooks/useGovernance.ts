import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { useState } from 'react';

export interface Proposal {
  id: string;
  propertyAddress: string;
  title: string;
  description: string;
  proposer: string;
  votesFor: number;
  votesAgainst: number;
  status: 'active' | 'passed' | 'rejected' | 'executed';
  createdAt: number;
  endTime: number;
}

export function useGovernance() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a new governance proposal
   */
  const createProposal = async (
    propertyAddress: string,
    title: string,
    description: string,
    votingPeriod: number = 7 * 24 * 60 * 60 // 7 days in seconds
  ) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // For now, create a simulated proposal
      // TODO: Replace with actual on-chain instruction when governance program is deployed

      const proposalId = `prop_${Date.now()}`;
      const proposal: Proposal = {
        id: proposalId,
        propertyAddress,
        title,
        description,
        proposer: publicKey.toBase58(),
        votesFor: 0,
        votesAgainst: 0,
        status: 'active',
        createdAt: Date.now(),
        endTime: Date.now() + (votingPeriod * 1000),
      };

      // Store in localStorage for demo
      const proposals = JSON.parse(localStorage.getItem('governance_proposals') || '[]');
      proposals.push(proposal);
      localStorage.setItem('governance_proposals', JSON.stringify(proposals));

      setLoading(false);
      return { proposalId, proposal };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Vote on a proposal
   */
  const vote = async (
    proposalId: string,
    support: boolean, // true = for, false = against
    tokenAmount: number // voting power based on tokens held
  ) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // For now, update localStorage
      // TODO: Replace with actual on-chain instruction

      const proposals = JSON.parse(localStorage.getItem('governance_proposals') || '[]');
      const proposalIndex = proposals.findIndex((p: Proposal) => p.id === proposalId);

      if (proposalIndex === -1) {
        throw new Error('Proposal not found');
      }

      const proposal = proposals[proposalIndex];

      if (proposal.status !== 'active') {
        throw new Error('Proposal is not active');
      }

      if (Date.now() > proposal.endTime) {
        throw new Error('Voting period has ended');
      }

      // Record vote
      const votes = JSON.parse(localStorage.getItem('governance_votes') || '{}');
      const voteKey = `${proposalId}_${publicKey.toBase58()}`;

      if (votes[voteKey]) {
        throw new Error('Already voted on this proposal');
      }

      votes[voteKey] = { support, amount: tokenAmount, timestamp: Date.now() };
      localStorage.setItem('governance_votes', JSON.stringify(votes));

      // Update proposal counts
      if (support) {
        proposal.votesFor += tokenAmount;
      } else {
        proposal.votesAgainst += tokenAmount;
      }

      proposals[proposalIndex] = proposal;
      localStorage.setItem('governance_proposals', JSON.stringify(proposals));

      setLoading(false);
      return { proposalId, support, tokenAmount };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Get all proposals for a property
   */
  const getProposals = (propertyAddress?: string): Proposal[] => {
    const proposals = JSON.parse(localStorage.getItem('governance_proposals') || '[]');

    if (propertyAddress) {
      return proposals.filter((p: Proposal) => p.propertyAddress === propertyAddress);
    }

    return proposals;
  };

  /**
   * Execute a passed proposal
   */
  const executeProposal = async (proposalId: string) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const proposals = JSON.parse(localStorage.getItem('governance_proposals') || '[]');
      const proposalIndex = proposals.findIndex((p: Proposal) => p.id === proposalId);

      if (proposalIndex === -1) {
        throw new Error('Proposal not found');
      }

      const proposal = proposals[proposalIndex];

      // Check if proposal passed
      if (proposal.votesFor <= proposal.votesAgainst) {
        proposal.status = 'rejected';
      } else {
        proposal.status = 'executed';
      }

      proposals[proposalIndex] = proposal;
      localStorage.setItem('governance_proposals', JSON.stringify(proposals));

      setLoading(false);
      return { proposalId, status: proposal.status };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    createProposal,
    vote,
    getProposals,
    executeProposal,
    loading,
    error,
  };
}
