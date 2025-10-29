'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useWallet } from '@solana/wallet-adapter-react';
import PageTransition from '@/components/animations/PageTransition';
import { useGovernance, Proposal } from '@/lib/solana/hooks/useGovernance';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function GovernancePage() {
  const { t } = useLanguage();
  const { connected, publicKey } = useWallet();
  const { createProposal, vote, getProposals, executeProposal, loading } = useGovernance();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProposal, setNewProposal] = useState({
    propertyAddress: '',
    title: '',
    description: '',
  });

  const proposals = getProposals();

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProposal(
        newProposal.propertyAddress,
        newProposal.title,
        newProposal.description
      );
      setShowCreateModal(false);
      setNewProposal({ propertyAddress: '', title: '', description: '' });
      alert('Proposal created successfully!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleVote = async (proposalId: string, support: boolean) => {
    try {
      // In production, get actual token balance
      const tokenAmount = 100; // Mock value
      await vote(proposalId, support, tokenAmount);
      alert(`Voted ${support ? 'FOR' : 'AGAINST'} the proposal!`);
      window.location.reload();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'passed': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'executed': return 'bg-purple-500/20 text-purple-400 border-purple-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="modern-card p-12 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🗳️</div>
            <h2 className="text-3xl font-bold mb-4 text-junot-text-dark">{t('governance.connectWallet')}</h2>
            <p className="text-junot-text-muted">{t('governance.connectDesc')}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <PageTransition>
        <main className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-junot-text-dark">{t('governance.title')}</h1>
              <p className="text-junot-text-muted">{t('governance.subtitle')}</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="modern-button px-6 py-3 rounded-lg font-semibold"
            >
              {t('governance.createProposal')}
            </button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="modern-card p-6">
              <div className="text-junot-text-muted text-sm mb-2 uppercase tracking-wider">Total Propositions</div>
              <div className="text-3xl font-bold text-junot-text-dark">{proposals.length}</div>
            </div>
            <div className="modern-card p-6">
              <div className="text-junot-text-muted text-sm mb-2 uppercase tracking-wider">Votes Actifs</div>
              <div className="text-3xl font-bold text-junot-text-dark">
                {proposals.filter(p => p.status === 'active').length}
              </div>
            </div>
            <div className="modern-card p-6">
              <div className="text-junot-text-muted text-sm mb-2 uppercase tracking-wider">Approuvées</div>
              <div className="text-3xl font-bold text-junot-text-dark">
                {proposals.filter(p => p.status === 'passed' || p.status === 'executed').length}
              </div>
            </div>
            <div className="modern-card p-6 border-junot-gold/40">
              <div className="text-junot-gold text-sm mb-2 uppercase tracking-wider">Votre Pouvoir de Vote</div>
              <div className="text-3xl font-bold text-junot-text-dark">100</div>
            </div>
          </div>

          {/* Proposals List */}
          <div className="space-y-6">
            {proposals.length === 0 ? (
              <div className="modern-card p-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-junot-text-muted mb-4">Aucune proposition pour le moment</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="modern-button px-6 py-3 rounded-lg font-semibold"
                >
                  Créer la Première Proposition
                </button>
              </div>
            ) : (
              proposals.map((proposal) => (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="modern-card p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-junot-text-dark">{proposal.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(proposal.status)}`}>
                          {proposal.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-junot-text-muted text-sm mb-2">{proposal.description}</p>
                      <p className="text-xs text-junot-text-muted">
                        Proposé par {proposal.proposer.substring(0, 8)}...{proposal.proposer.substring(proposal.proposer.length - 6)}
                      </p>
                    </div>
                  </div>

                  {/* Voting Results */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-junot-text-muted">Pour: {proposal.votesFor}</span>
                      <span className="text-junot-text-muted">Contre: {proposal.votesAgainst}</span>
                    </div>
                    <div className="w-full h-3 bg-junot-cream-dark rounded-full overflow-hidden flex">
                      <div
                        className="bg-green-500"
                        style={{
                          width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst || 1)) * 100}%`
                        }}
                      />
                      <div
                        className="bg-red-500"
                        style={{
                          width: `${(proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst || 1)) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Voting Buttons */}
                  {proposal.status === 'active' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleVote(proposal.id, true)}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-600 rounded-lg transition-colors border border-green-500/30 font-semibold"
                      >
                        Voter Pour
                      </button>
                      <button
                        onClick={() => handleVote(proposal.id, false)}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-600 rounded-lg transition-colors border border-red-500/30 font-semibold"
                      >
                        Voter Contre
                      </button>
                    </div>
                  )}

                  {/* Time remaining */}
                  <div className="mt-4 text-xs text-junot-text-muted">
                    {proposal.status === 'active' && (
                      <>
                        Se termine le {new Date(proposal.endTime).toLocaleDateString('fr-FR')}
                      </>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </main>
      </PageTransition>

      {/* Create Proposal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modern-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-6 text-junot-text-dark">Créer une Proposition</h2>

            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-junot-text-dark">Adresse de la Propriété</label>
                <input
                  type="text"
                  required
                  value={newProposal.propertyAddress}
                  onChange={(e) => setNewProposal({ ...newProposal, propertyAddress: e.target.value })}
                  className="modern-input"
                  placeholder="Entrez l'adresse de la propriété"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-junot-text-dark">Titre</label>
                <input
                  type="text"
                  required
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                  className="modern-input"
                  placeholder="Titre de la proposition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-junot-text-dark">Description</label>
                <textarea
                  required
                  rows={5}
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                  className="modern-input resize-none"
                  placeholder="Décrivez la proposition..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 bg-white/60 hover:bg-white border border-junot-border text-junot-text-dark rounded-lg font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 modern-button px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  {loading ? 'Création...' : 'Créer la Proposition'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
