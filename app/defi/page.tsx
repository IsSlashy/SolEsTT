'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useWallet } from '@solana/wallet-adapter-react';
import PageTransition from '@/components/animations/PageTransition';
import { useMortgage } from '@/lib/solana/hooks/useMortgage';
import { useCollateral } from '@/lib/solana/hooks/useCollateral';
import { useLoyalty } from '@/lib/solana/hooks/useLoyalty';
import { motion } from 'framer-motion';

type TabType = 'mortgage' | 'collateral' | 'staking';

export default function DeFiPage() {
  const { connected, publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState<TabType>('mortgage');

  const { applyForMortgage, getMyApplications, loading: mortgageLoading } = useMortgage();
  const { lockCollateral, getMyPositions: getCollateralPositions, calculateMaxBorrow, loading: collateralLoading } = useCollateral();
  const { stakeTokens, getLoyaltyAccount, getMyPositions: getStakingPositions, calculateRewards, claimRewards, loading: loyaltyLoading } = useLoyalty();

  const [mortgageForm, setMortgageForm] = useState({
    propertyAddress: '',
    loanAmount: '',
    termMonths: '360',
    collateralTokens: '',
  });

  const [collateralForm, setCollateralForm] = useState({
    propertyAddress: '',
    tokensToLock: '',
    borrowAmount: '',
  });

  const [stakingForm, setStakingForm] = useState({
    propertyAddress: '',
    tokensToStake: '',
  });

  const mortgages = getMyApplications();
  const collateralPositions = getCollateralPositions();
  const stakingPositions = getStakingPositions();
  const loyaltyAccount = getLoyaltyAccount();

  const handleMortgageApply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await applyForMortgage(
        mortgageForm.propertyAddress,
        Number(mortgageForm.loanAmount),
        Number(mortgageForm.termMonths),
        Number(mortgageForm.collateralTokens)
      );
      alert('Mortgage application submitted!');
      setMortgageForm({ propertyAddress: '', loanAmount: '', termMonths: '360', collateralTokens: '' });
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleLockCollateral = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await lockCollateral(
        collateralForm.propertyAddress,
        Number(collateralForm.tokensToLock),
        Number(collateralForm.borrowAmount)
      );
      alert('Collateral locked successfully!');
      setCollateralForm({ propertyAddress: '', tokensToLock: '', borrowAmount: '' });
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await stakeTokens(
        stakingForm.propertyAddress,
        Number(stakingForm.tokensToStake)
      );
      alert('Tokens staked successfully!');
      setStakingForm({ propertyAddress: '', tokensToStake: '' });
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleClaimRewards = async (positionId: string) => {
    try {
      const result = await claimRewards(positionId);
      alert(`Claimed ${result.rewards.toFixed(4)} tokens!`);
      window.location.reload();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="modern-card p-12 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-neutral-400">Connect your wallet to access DeFi features</p>
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">DeFi Hub</h1>
            <p className="text-neutral-400">Mortgages, Collateral, and Staking</p>
          </div>

          {/* Loyalty Stats */}
          <div className="modern-card p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-neutral-400 text-sm mb-1">Loyalty Tier</div>
                <div className="text-2xl font-bold capitalize">{loyaltyAccount.tier}</div>
              </div>
              <div>
                <div className="text-neutral-400 text-sm mb-1">Points</div>
                <div className="text-2xl font-bold">{loyaltyAccount.points.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-neutral-400 text-sm mb-1">Staked Tokens</div>
                <div className="text-2xl font-bold">{loyaltyAccount.stakedTokens}</div>
              </div>
              <div>
                <div className="text-neutral-400 text-sm mb-1">Total Rewards</div>
                <div className="text-2xl font-bold text-green-400">{loyaltyAccount.totalRewardsEarned.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setActiveTab('mortgage')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'mortgage'
                  ? 'bg-white text-black'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              Mortgages
            </button>
            <button
              onClick={() => setActiveTab('collateral')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'collateral'
                  ? 'bg-white text-black'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              Collateral
            </button>
            <button
              onClick={() => setActiveTab('staking')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'staking'
                  ? 'bg-white text-black'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              Staking
            </button>
          </div>

          {/* Mortgage Tab */}
          {activeTab === 'mortgage' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Application Form */}
              <div className="modern-card p-6">
                <h2 className="text-2xl font-bold mb-6">Apply for Mortgage</h2>
                <form onSubmit={handleMortgageApply} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Address</label>
                    <input
                      type="text"
                      required
                      value={mortgageForm.propertyAddress}
                      onChange={(e) => setMortgageForm({ ...mortgageForm, propertyAddress: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-neutral-800 rounded-lg"
                      placeholder="Enter property address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Loan Amount (USDC)</label>
                    <input
                      type="number"
                      required
                      value={mortgageForm.loanAmount}
                      onChange={(e) => setMortgageForm({ ...mortgageForm, loanAmount: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-neutral-800 rounded-lg"
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Term (months)</label>
                    <select
                      value={mortgageForm.termMonths}
                      onChange={(e) => setMortgageForm({ ...mortgageForm, termMonths: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-neutral-800 rounded-lg"
                    >
                      <option value="120">10 years</option>
                      <option value="180">15 years</option>
                      <option value="240">20 years</option>
                      <option value="360">30 years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Collateral Tokens</label>
                    <input
                      type="number"
                      required
                      value={mortgageForm.collateralTokens}
                      onChange={(e) => setMortgageForm({ ...mortgageForm, collateralTokens: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-neutral-800 rounded-lg"
                      placeholder="1000"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={mortgageLoading}
                    className="w-full modern-button px-6 py-3 rounded-lg font-semibold"
                  >
                    {mortgageLoading ? 'Processing...' : 'Apply'}
                  </button>
                </form>
              </div>

              {/* Active Mortgages */}
              <div className="modern-card p-6">
                <h2 className="text-2xl font-bold mb-6">Your Mortgages</h2>
                {mortgages.length === 0 ? (
                  <p className="text-neutral-400 text-center py-8">No mortgages yet</p>
                ) : (
                  <div className="space-y-4">
                    {mortgages.map((mortgage) => (
                      <div key={mortgage.id} className="bg-gray-900 p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-neutral-400">Loan Amount</span>
                          <span className="font-semibold">${mortgage.loanAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-neutral-400">Monthly Payment</span>
                          <span className="font-semibold">${mortgage.monthlyPayment.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-neutral-400">Interest Rate</span>
                          <span className="font-semibold">{(mortgage.interestRate * 100).toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-neutral-400">Status</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            mortgage.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            mortgage.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {mortgage.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Collateral Tab */}
          {activeTab === 'collateral' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Lock Collateral Form */}
              <div className="modern-card p-6">
                <h2 className="text-2xl font-bold mb-6">Lock Collateral</h2>
                <form onSubmit={handleLockCollateral} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Address</label>
                    <input
                      type="text"
                      required
                      value={collateralForm.propertyAddress}
                      onChange={(e) => setCollateralForm({ ...collateralForm, propertyAddress: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-neutral-800 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tokens to Lock</label>
                    <input
                      type="number"
                      required
                      value={collateralForm.tokensToLock}
                      onChange={(e) => {
                        setCollateralForm({ ...collateralForm, tokensToLock: e.target.value });
                        const maxBorrow = calculateMaxBorrow(Number(e.target.value));
                        if (Number(collateralForm.borrowAmount) > maxBorrow) {
                          setCollateralForm(prev => ({ ...prev, borrowAmount: maxBorrow.toString() }));
                        }
                      }}
                      className="w-full px-4 py-3 bg-gray-900 border border-neutral-800 rounded-lg"
                      placeholder="100"
                    />
                    {collateralForm.tokensToLock && (
                      <p className="text-xs text-neutral-500 mt-1">
                        Collateral value: ${(Number(collateralForm.tokensToLock) * 100).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Borrow Amount (USDC)</label>
                    <input
                      type="number"
                      required
                      value={collateralForm.borrowAmount}
                      onChange={(e) => setCollateralForm({ ...collateralForm, borrowAmount: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-neutral-800 rounded-lg"
                      placeholder="5000"
                      max={collateralForm.tokensToLock ? calculateMaxBorrow(Number(collateralForm.tokensToLock)) : undefined}
                    />
                    {collateralForm.tokensToLock && (
                      <p className="text-xs text-neutral-500 mt-1">
                        Max borrow (60% LTV): ${calculateMaxBorrow(Number(collateralForm.tokensToLock)).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={collateralLoading}
                    className="w-full modern-button px-6 py-3 rounded-lg font-semibold"
                  >
                    {collateralLoading ? 'Processing...' : 'Lock Collateral'}
                  </button>
                </form>
              </div>

              {/* Active Positions */}
              <div className="modern-card p-6">
                <h2 className="text-2xl font-bold mb-6">Your Positions</h2>
                {collateralPositions.length === 0 ? (
                  <p className="text-neutral-400 text-center py-8">No positions yet</p>
                ) : (
                  <div className="space-y-4">
                    {collateralPositions.map((position) => (
                      <div key={position.id} className="bg-gray-900 p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-neutral-400">Locked Tokens</span>
                          <span className="font-semibold">{position.tokensLocked}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-neutral-400">Borrowed</span>
                          <span className="font-semibold">${position.borrowedAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-neutral-400">Health Factor</span>
                          <span className={`font-semibold ${position.healthFactor >= 1.5 ? 'text-green-400' : position.healthFactor >= 1.2 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {position.healthFactor.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-neutral-400">Status</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            position.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {position.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Staking Tab */}
          {activeTab === 'staking' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Staking Form */}
              <div className="modern-card p-6">
                <h2 className="text-2xl font-bold mb-6">Stake Tokens</h2>
                <form onSubmit={handleStake} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Address</label>
                    <input
                      type="text"
                      required
                      value={stakingForm.propertyAddress}
                      onChange={(e) => setStakingForm({ ...stakingForm, propertyAddress: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-neutral-800 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tokens to Stake</label>
                    <input
                      type="number"
                      required
                      value={stakingForm.tokensToStake}
                      onChange={(e) => setStakingForm({ ...stakingForm, tokensToStake: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-neutral-800 rounded-lg"
                      placeholder="100"
                    />
                    <p className="text-xs text-neutral-500 mt-2">
                      APY: {Number(stakingForm.tokensToStake) >= 1000 ? '12%' : Number(stakingForm.tokensToStake) >= 100 ? '10%' : '8%'}
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={loyaltyLoading}
                    className="w-full modern-button px-6 py-3 rounded-lg font-semibold"
                  >
                    {loyaltyLoading ? 'Processing...' : 'Stake'}
                  </button>
                </form>
              </div>

              {/* Staking Positions */}
              <div className="modern-card p-6">
                <h2 className="text-2xl font-bold mb-6">Your Staking</h2>
                {stakingPositions.length === 0 ? (
                  <p className="text-neutral-400 text-center py-8">No staking positions yet</p>
                ) : (
                  <div className="space-y-4">
                    {stakingPositions.map((position) => {
                      const rewards = calculateRewards(position);
                      return (
                        <div key={position.id} className="bg-gray-900 p-4 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-neutral-400">Staked</span>
                            <span className="font-semibold">{position.tokensStaked} tokens</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-neutral-400">APY</span>
                            <span className="font-semibold text-green-400">{(position.apy * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between mb-3">
                            <span className="text-sm text-neutral-400">Rewards</span>
                            <span className="font-semibold">{rewards.toFixed(4)} tokens</span>
                          </div>
                          <button
                            onClick={() => handleClaimRewards(position.id)}
                            disabled={loyaltyLoading || rewards < 0.01}
                            className="w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors disabled:opacity-50"
                          >
                            Claim Rewards
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </PageTransition>
    </div>
  );
}
