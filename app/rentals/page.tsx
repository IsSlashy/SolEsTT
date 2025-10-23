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
      <div className="min-h-screen  text-white">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-8">Rental Payments</h1>
          <div className="modern-card p-12 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
            <p className="text-neutral-400">Connect your wallet to manage rental payments</p>
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
    <div className="min-h-screen  text-white">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Rental Payments</h1>
          <p className="text-neutral-400">Automated rent collection powered by USDC on Solana</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="modern-card p-6">
            <div className="text-neutral-400 text-sm mb-2">Active as Tenant</div>
            <div className="text-3xl font-bold">{mockTenantAgreements.length}</div>
            <div className="text-sm text-neutral-400 mt-1">rental agreements</div>
          </div>
          <div className="modern-card p-6">
            <div className="text-neutral-400 text-sm mb-2">Active as Landlord</div>
            <div className="text-3xl font-bold">{mockLandlordAgreements.length}</div>
            <div className="text-sm text-neutral-400 mt-1">rental agreements</div>
          </div>
          <div className="modern-card p-6">
            <div className="text-neutral-400 text-sm mb-2">Total Collected</div>
            <div className="text-3xl font-bold text-green-400">{formatPrice(mockIncomeHistory.reduce((sum, i) => sum + i.amount, 0))}</div>
            <div className="text-sm text-neutral-400 mt-1">lifetime earnings</div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setView('tenant')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              view === 'tenant' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            As Tenant ({mockTenantAgreements.length})
          </button>
          <button
            onClick={() => setView('landlord')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              view === 'landlord' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            As Landlord ({mockLandlordAgreements.length})
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
                      <div className="w-20 h-20 bg-gray-700 rounded-lg overflow-hidden">
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
                        <p className="text-neutral-400 text-sm mt-1">Landlord: {agreement.landlord}</p>
                      </div>
                    </div>

                    <div className={`px-4 py-2 rounded-lg ${
                      agreement.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-neutral-400'
                    }`}>
                      {agreement.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-6 mb-6">
                    <div>
                      <div className="text-neutral-400 text-sm mb-1">Monthly Rent</div>
                      <div className="text-2xl font-bold">{formatPrice(agreement.rentAmount)}</div>
                    </div>
                    <div>
                      <div className="text-neutral-400 text-sm mb-1">Next Payment Due</div>
                      <div className={`text-2xl font-bold ${isOverdue ? 'text-red-400' : 'text-white'}`}>
                        {isOverdue ? 'OVERDUE' : `${daysUntilDue} days`}
                      </div>
                    </div>
                    <div>
                      <div className="text-neutral-400 text-sm mb-1">Last Payment</div>
                      <div className="text-lg font-semibold">
                        {new Date(agreement.lastPayment).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-neutral-400 text-sm mb-1">Total Payments</div>
                      <div className="text-lg font-semibold">{agreement.totalPayments}</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      disabled={isOverdue ? false : daysUntilDue > 5}
                      className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                        isOverdue
                          ? 'bg-red-600 hover:bg-red-700'
                          : daysUntilDue <= 5
                          ? 'modern-button'
                          : 'bg-gray-700 cursor-not-allowed'
                      }`}
                    >
                      {isOverdue ? '⚠️ Pay Now (OVERDUE)' : daysUntilDue <= 5 ? 'Pay Rent with USDC' : `Payment due in ${daysUntilDue} days`}
                    </button>
                    <button
                      onClick={() => setSelectedAgreement({ ...agreement, viewType: 'tenant' })}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                    >
                      View Details
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
                        <div className="w-20 h-20 bg-gray-700 rounded-lg overflow-hidden">
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
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
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
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="text-left p-4 font-semibold">Property</th>
                      <th className="text-left p-4 font-semibold">Tenant</th>
                      <th className="text-left p-4 font-semibold">Amount</th>
                      <th className="text-left p-4 font-semibold">Date</th>
                      <th className="text-left p-4 font-semibold">Status</th>
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
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6" onClick={() => setSelectedAgreement(null)}>
            <div className="bg-gray-800 rounded-2xl border border-neutral-800 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="sticky top-0 bg-gray-800 border-b border-neutral-800 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Rental Agreement Details</h2>
                <button
                  onClick={() => setSelectedAgreement(null)}
                  className="text-neutral-400 hover:text-white text-3xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Property Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl">
                  <div className="w-24 h-24 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
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
                    <div className="bg-gray-900 p-4 rounded-xl">
                      <div className="text-neutral-400 text-sm mb-1">Monthly Rent</div>
                      <div className="text-2xl font-bold text-white">{formatPrice(selectedAgreement.rentAmount)}</div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl">
                      <div className="text-neutral-400 text-sm mb-1">Payment Frequency</div>
                      <div className="text-2xl font-bold">{selectedAgreement.paymentFrequency} days</div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl">
                      <div className="text-neutral-400 text-sm mb-1">Agreement Status</div>
                      <div className="text-lg font-bold text-green-400">{selectedAgreement.status.toUpperCase()}</div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl">
                      <div className="text-neutral-400 text-sm mb-1">Total Payments Made</div>
                      <div className="text-2xl font-bold">{selectedAgreement.totalPayments}</div>
                    </div>
                  </div>
                </div>

                {/* Payment Schedule */}
                <div>
                  <h3 className="text-lg font-bold mb-3">Payment Schedule</h3>
                  <div className="bg-gray-900 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Last Payment:</span>
                      <span className="font-semibold">{new Date(selectedAgreement.lastPayment).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Next Payment Due:</span>
                      <span className="font-semibold text-white">
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
                  <div className="bg-gray-900 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-950">
                        <tr>
                          <th className="text-left p-3 text-sm font-semibold">Payment #</th>
                          <th className="text-left p-3 text-sm font-semibold">Amount</th>
                          <th className="text-left p-3 text-sm font-semibold">Date</th>
                          <th className="text-left p-3 text-sm font-semibold">Status</th>
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
                    <div className="bg-gray-900 p-4 rounded-xl">
                      <div className="text-neutral-400 text-sm mb-1">Total Paid/Collected</div>
                      <div className="text-2xl font-bold text-green-400">
                        {formatPrice(selectedAgreement.rentAmount * selectedAgreement.totalPayments)}
                      </div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl">
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
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Demo Notice */}
        <div className="mt-8 p-6 bg-purple-900/30 border border-neutral-700/30 rounded-xl text-center">
          <p className="text-neutral-300">
            💰 Demo Mode - Rental data is simulated. Real USDC rent payments will be automated once blockchain integration is complete.
          </p>
        </div>
      </main>
    </div>
  );
}
