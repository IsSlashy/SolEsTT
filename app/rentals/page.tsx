'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useWallet } from '@solana/wallet-adapter-react';
import { getAllProperties, formatPrice } from '@/lib/solana/mockData';

export default function Rentals() {
  const { connected, publicKey } = useWallet();
  const [view, setView] = useState<'tenant' | 'landlord'>('tenant');
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null);
  const properties = getAllProperties();

  // Mock rental agreements as tenant
  const mockTenantAgreements = connected ? [
    {
      id: '1',
      property: properties[2], // Brussels loft
      landlord: 'BvzK...ojJx',
      rentAmount: 1800,
      paymentFrequency: 30, // days
      lastPayment: Date.now() - 86400000 * 22,
      nextDueDate: Date.now() + 86400000 * 8,
      totalPayments: 3,
      status: 'active' as const,
    },
  ] : [];

  // Mock rental agreements as landlord
  const mockLandlordAgreements = connected ? [
    {
      id: '2',
      property: properties[0], // Paris apartment (we "own" this via investments)
      tenant: '7fUA...oLS7',
      rentAmount: 2500,
      paymentFrequency: 30,
      lastPayment: Date.now() - 86400000 * 5,
      nextDueDate: Date.now() + 86400000 * 25,
      totalPayments: 5,
      status: 'active' as const,
    },
  ] : [];

  // Mock rental income history
  const mockIncomeHistory = [
    {
      id: '1',
      property: 'Luxury Apartment - Paris 16th',
      tenant: '7fUA...oLS7',
      amount: 2500,
      date: Date.now() - 86400000 * 5,
      status: 'received' as const,
    },
    {
      id: '2',
      property: 'Luxury Apartment - Paris 16th',
      tenant: '7fUA...oLS7',
      amount: 2500,
      date: Date.now() - 86400000 * 35,
      status: 'received' as const,
    },
  ];

  if (!connected) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-8 text-junot-text-dark">Paiements Locatifs</h1>
          <div className="modern-card p-12 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold mb-4 text-junot-text-dark">Connectez Votre Wallet</h3>
            <p className="text-junot-text-muted">Connectez votre wallet pour gérer les paiements locatifs</p>
          </div>
        </main>
      </div>
    );
  }

  const getDaysUntilDue = (dueDate: number) => {
    const days = Math.ceil((dueDate - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-junot-text-dark">Paiements Locatifs</h1>
          <p className="text-junot-text-muted">Collection automatique des loyers via USDC sur Solana</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="modern-card p-6">
            <div className="text-junot-text-muted text-sm mb-2 uppercase tracking-wider">En Tant Que Locataire</div>
            <div className="text-3xl font-bold text-junot-text-dark">{mockTenantAgreements.length}</div>
            <div className="text-sm text-junot-text-muted mt-1">contrats de location</div>
          </div>
          <div className="modern-card p-6">
            <div className="text-junot-text-muted text-sm mb-2 uppercase tracking-wider">En Tant Que Propriétaire</div>
            <div className="text-3xl font-bold text-junot-text-dark">{mockLandlordAgreements.length}</div>
            <div className="text-sm text-junot-text-muted mt-1">contrats de location</div>
          </div>
          <div className="modern-card p-6">
            <div className="text-junot-text-muted text-sm mb-2 uppercase tracking-wider">Total Collecté</div>
            <div className="text-3xl font-bold text-junot-gold">{formatPrice(mockIncomeHistory.reduce((sum, i) => sum + i.amount, 0))}</div>
            <div className="text-sm text-junot-text-muted mt-1">revenus totaux</div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setView('tenant')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              view === 'tenant' ? 'bg-junot-gold text-junot-text-dark shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
            }`}
          >
            Locataire ({mockTenantAgreements.length})
          </button>
          <button
            onClick={() => setView('landlord')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              view === 'landlord' ? 'bg-junot-gold text-junot-text-dark shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
            }`}
          >
            Propriétaire ({mockLandlordAgreements.length})
          </button>
        </div>

        {/* Tenant View */}
        {view === 'tenant' && (
          <div className="space-y-6">
            {mockTenantAgreements.map((agreement) => {
              const daysUntilDue = getDaysUntilDue(agreement.nextDueDate);
              const isOverdue = daysUntilDue < 0;

              return (
                <div key={agreement.id} className="modern-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-white/60 border border-junot-border rounded-lg overflow-hidden">
                        {agreement.property.images[0] ? (
                          <img
                            src={agreement.property.images[0]}
                            alt={agreement.property.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            🏠
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-junot-text-dark">{agreement.property.name}</h3>
                        <p className="text-junot-text-muted text-sm">📍 {agreement.property.location}</p>
                        <p className="text-junot-text-muted text-sm mt-1">Propriétaire: {agreement.landlord}</p>
                      </div>
                    </div>

                    <div className={`px-4 py-2 rounded-lg ${
                      agreement.status === 'active' ? 'bg-junot-gold/20 text-junot-gold border border-junot-gold/40' : 'bg-junot-cream-dark text-junot-text-muted'
                    }`}>
                      {agreement.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-6 mb-6">
                    <div>
                      <div className="text-junot-text-muted text-sm mb-1">Loyer Mensuel</div>
                      <div className="text-2xl font-bold text-junot-text-dark">{formatPrice(agreement.rentAmount)}</div>
                    </div>
                    <div>
                      <div className="text-junot-text-muted text-sm mb-1">Prochain Paiement</div>
                      <div className={`text-2xl font-bold ${isOverdue ? 'text-red-600' : 'text-junot-text-dark'}`}>
                        {isOverdue ? 'EN RETARD' : `${daysUntilDue} jours`}
                      </div>
                    </div>
                    <div>
                      <div className="text-junot-text-muted text-sm mb-1">Dernier Paiement</div>
                      <div className="text-lg font-semibold text-junot-text-dark">
                        {new Date(agreement.lastPayment).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div>
                      <div className="text-junot-text-muted text-sm mb-1">Total Paiements</div>
                      <div className="text-lg font-semibold text-junot-text-dark">{agreement.totalPayments}</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      disabled={isOverdue ? false : daysUntilDue > 5}
                      className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                        isOverdue
                          ? 'bg-red-600 hover:bg-red-700 text-junot-text-dark'
                          : daysUntilDue <= 5
                          ? 'modern-button'
                          : 'bg-junot-cream-dark text-junot-text-muted cursor-not-allowed border border-junot-border'
                      }`}
                    >
                      {isOverdue ? '⚠️ Payer Maintenant (EN RETARD)' : daysUntilDue <= 5 ? 'Payer le Loyer en USDC' : `Paiement dû dans ${daysUntilDue} jours`}
                    </button>
                    <button
                      onClick={() => setSelectedAgreement({ ...agreement, viewType: 'tenant' })}
                      className="px-6 py-3 bg-white/60 hover:bg-white text-junot-text-dark border border-junot-border rounded-lg font-semibold transition-colors"
                    >
                      Voir Détails
                    </button>
                  </div>
                </div>
              );
            })}

            {mockTenantAgreements.length === 0 && (
              <div className="modern-card p-12 text-center">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-bold mb-2">No Active Rentals</h3>
                <p className="text-neutral-400">You are not currently renting any properties</p>
              </div>
            )}
          </div>
        )}

        {/* Landlord View */}
        {view === 'landlord' && (
          <div className="space-y-6">
            {/* Active Agreements */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Active Rental Agreements</h2>
              {mockLandlordAgreements.map((agreement) => {
                const daysUntilDue = getDaysUntilDue(agreement.nextDueDate);

                return (
                  <div key={agreement.id} className="modern-card p-6 mb-4">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-white/60 border border-junot-border rounded-lg overflow-hidden">
                          {agreement.property.images[0] ? (
                            <img
                              src={agreement.property.images[0]}
                              alt={agreement.property.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">
                              🏠
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{agreement.property.name}</h3>
                          <p className="text-neutral-400 text-sm">📍 {agreement.property.location}</p>
                          <p className="text-neutral-400 text-sm mt-1">Tenant: {agreement.tenant}</p>
                        </div>
                      </div>

                      <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg">
                        ACTIVE
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6 mb-6">
                      <div>
                        <div className="text-neutral-400 text-sm mb-1">Monthly Rent</div>
                        <div className="text-2xl font-bold text-green-400">{formatPrice(agreement.rentAmount)}</div>
                      </div>
                      <div>
                        <div className="text-neutral-400 text-sm mb-1">Next Payment Expected</div>
                        <div className="text-lg font-semibold">{daysUntilDue} days</div>
                      </div>
                      <div>
                        <div className="text-neutral-400 text-sm mb-1">Last Received</div>
                        <div className="text-lg font-semibold">
                          {new Date(agreement.lastPayment).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-neutral-400 text-sm mb-1">Total Collected</div>
                        <div className="text-lg font-semibold text-green-400">
                          {formatPrice(agreement.rentAmount * agreement.totalPayments)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedAgreement({ ...agreement, viewType: 'landlord' })}
                      className="px-6 py-3 bg-white/60 border border-junot-border hover:bg-white/80 rounded-lg font-semibold transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Income History */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Income History</h2>
              <div className="modern-card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-junot-gold/10">
                    <tr>
                      <th className="text-left p-4 font-semibold text-junot-text-dark">Property</th>
                      <th className="text-left p-4 font-semibold text-junot-text-dark">Tenant</th>
                      <th className="text-left p-4 font-semibold text-junot-text-dark">Amount</th>
                      <th className="text-left p-4 font-semibold text-junot-text-dark">Date</th>
                      <th className="text-left p-4 font-semibold text-junot-text-dark">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockIncomeHistory.map((income) => (
                      <tr key={income.id} className="border-t border-neutral-800">
                        <td className="p-4 font-semibold">{income.property}</td>
                        <td className="p-4">{income.tenant}</td>
                        <td className="p-4 font-bold text-green-400">{formatPrice(income.amount)}</td>
                        <td className="p-4 text-neutral-400">
                          {new Date(income.date).toLocaleDateString()} {new Date(income.date).toLocaleTimeString()}
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                            {income.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {selectedAgreement && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6" onClick={() => setSelectedAgreement(null)}>
            <div className="bg-junot-cream-light/95 backdrop-blur-xl rounded-2xl border border-junot-border shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="sticky top-0 bg-junot-cream/90 backdrop-blur-xl border-b border-junot-border p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-junot-text-dark">Détails du Contrat de Location</h2>
                <button
                  onClick={() => setSelectedAgreement(null)}
                  className="text-junot-text-muted hover:text-junot-text-dark text-3xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Property Info */}
                <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="w-24 h-24 bg-white/60 border border-junot-border rounded-lg overflow-hidden flex-shrink-0">
                    {selectedAgreement.property.images[0] ? (
                      <img
                        src={selectedAgreement.property.images[0]}
                        alt={selectedAgreement.property.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🏠</div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedAgreement.property.name}</h3>
                    <p className="text-neutral-400">📍 {selectedAgreement.property.location}</p>
                    <p className="text-neutral-400 text-sm mt-1">
                      {selectedAgreement.viewType === 'tenant' ? `Landlord: ${selectedAgreement.landlord}` : `Tenant: ${selectedAgreement.tenant}`}
                    </p>
                  </div>
                </div>

                {/* Agreement Terms */}
                <div>
                  <h3 className="text-lg font-bold mb-3">Agreement Terms</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                      <div className="text-neutral-400 text-sm mb-1">Monthly Rent</div>
                      <div className="text-2xl font-bold text-junot-text-dark">{formatPrice(selectedAgreement.rentAmount)}</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                      <div className="text-neutral-400 text-sm mb-1">Payment Frequency</div>
                      <div className="text-2xl font-bold">{selectedAgreement.paymentFrequency} days</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                      <div className="text-neutral-400 text-sm mb-1">Agreement Status</div>
                      <div className="text-lg font-bold text-green-400">{selectedAgreement.status.toUpperCase()}</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                      <div className="text-neutral-400 text-sm mb-1">Total Payments Made</div>
                      <div className="text-2xl font-bold">{selectedAgreement.totalPayments}</div>
                    </div>
                  </div>
                </div>

                {/* Payment Schedule */}
                <div>
                  <h3 className="text-lg font-bold mb-3">Payment Schedule</h3>
                  <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Last Payment:</span>
                      <span className="font-semibold">{new Date(selectedAgreement.lastPayment).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Next Payment Due:</span>
                      <span className="font-semibold text-junot-text-dark">
                        {new Date(selectedAgreement.nextDueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Days Until Due:</span>
                      <span className={`font-semibold ${getDaysUntilDue(selectedAgreement.nextDueDate) < 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {getDaysUntilDue(selectedAgreement.nextDueDate) < 0 ? 'OVERDUE' : `${getDaysUntilDue(selectedAgreement.nextDueDate)} days`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment History */}
                <div>
                  <h3 className="text-lg font-bold mb-3">Payment History</h3>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-junot-gold/10">
                        <tr>
                          <th className="text-left p-3 text-sm font-semibold text-junot-text-dark">Paiement #</th>
                          <th className="text-left p-3 text-sm font-semibold text-junot-text-dark">Montant</th>
                          <th className="text-left p-3 text-sm font-semibold text-junot-text-dark">Date</th>
                          <th className="text-left p-3 text-sm font-semibold text-junot-text-dark">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: selectedAgreement.totalPayments }).map((_, i) => {
                          const paymentDate = new Date(selectedAgreement.lastPayment - (selectedAgreement.totalPayments - 1 - i) * selectedAgreement.paymentFrequency * 86400000);
                          return (
                            <tr key={i} className="border-t border-gray-800">
                              <td className="p-3">#{selectedAgreement.totalPayments - i}</td>
                              <td className="p-3 font-semibold text-green-400">{formatPrice(selectedAgreement.rentAmount)}</td>
                              <td className="p-3 text-neutral-400">{paymentDate.toLocaleDateString()}</td>
                              <td className="p-3">
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                                  PAID
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Financial Summary */}
                <div>
                  <h3 className="text-lg font-bold mb-3">Financial Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                      <div className="text-neutral-400 text-sm mb-1">Total Paid/Collected</div>
                      <div className="text-2xl font-bold text-green-400">
                        {formatPrice(selectedAgreement.rentAmount * selectedAgreement.totalPayments)}
                      </div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                      <div className="text-neutral-400 text-sm mb-1">Average Monthly</div>
                      <div className="text-2xl font-bold">{formatPrice(selectedAgreement.rentAmount)}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-neutral-800">
                  {selectedAgreement.viewType === 'tenant' && (
                    <button className="flex-1 py-3 modern-button rounded-lg font-semibold transition-colors">
                      Pay Rent with USDC
                    </button>
                  )}
                  <button className="flex-1 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-semibold transition-colors border border-red-500/50">
                    Terminate Agreement
                  </button>
                  <button
                    onClick={() => setSelectedAgreement(null)}
                    className="px-6 py-3 bg-white/60 border border-junot-border hover:bg-white/80 rounded-lg font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Demo Notice */}
        <div className="mt-8 p-6 bg-junot-gold/10 border border-junot-gold/30 rounded-xl text-center">
          <p className="text-junot-text font-medium">
            💰 <span className="font-bold text-junot-gold">Mode Démo</span> - Les données de location sont simulées. Les paiements réels en USDC seront automatisés une fois l'intégration blockchain terminée.
          </p>
        </div>
      </main>
    </div>
  );
}
