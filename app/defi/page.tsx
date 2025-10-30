'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Header from '@/components/Header';
import { useWallet } from '@solana/wallet-adapter-react';
import PageTransition from '@/components/animations/PageTransition';
import { useMortgage } from '@/lib/solana/hooks/useMortgage';
import { useCollateral } from '@/lib/solana/hooks/useCollateral';
import { useLoyalty } from '@/lib/solana/hooks/useLoyalty';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

type TabType = 'mortgage' | 'collateral' | 'staking';

export default function DeFiPage() {
  const { t } = useLanguage();
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
            <h2 className="text-3xl font-bold mb-4 text-junot-text-dark">{t('defi.connectWallet')}</h2>
            <p className="text-junot-text-muted">{t('defi.connectDesc')}</p>
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
            <h1 className="text-4xl font-bold mb-2 text-junot-text-dark">{t('defi.title')}</h1>
            <p className="text-junot-text-muted">{t('defi.subtitle')}</p>
          </div>

          {/* Loyalty Stats */}
          <div className="modern-card p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-junot-text-muted text-sm mb-1 uppercase tracking-wider">{t('defi.loyaltyStats.tier')}</div>
                <div className="text-2xl font-bold capitalize text-junot-text-dark">{loyaltyAccount.tier}</div>
              </div>
              <div>
                <div className="text-junot-text-muted text-sm mb-1 uppercase tracking-wider">{t('defi.loyaltyStats.points')}</div>
                <div className="text-2xl font-bold text-junot-text-dark">{loyaltyAccount.points.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-junot-text-muted text-sm mb-1 uppercase tracking-wider">{t('defi.loyaltyStats.stakedTokens')}</div>
                <div className="text-2xl font-bold text-junot-text-dark">{loyaltyAccount.stakedTokens}</div>
              </div>
              <div>
                <div className="text-junot-text-muted text-sm mb-1 uppercase tracking-wider">{t('defi.loyaltyStats.totalRewards')}</div>
                <div className="text-2xl font-bold text-junot-gold">{loyaltyAccount.totalRewardsEarned.toFixed(2)}</div>
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
                  : 'bg-neutral-900 text-junot-text-muted hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {t('defi.tabs.mortgages')}
            </button>
            <button
              onClick={() => setActiveTab('collateral')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'collateral'
                  ? 'bg-white text-black'
                  : 'bg-neutral-900 text-junot-text-muted hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {t('defi.tabs.collateral')}
            </button>
            <button
              onClick={() => setActiveTab('staking')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'staking'
                  ? 'bg-white text-black'
                  : 'bg-neutral-900 text-junot-text-muted hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {t('defi.tabs.staking')}
            </button>
          </div>

          {/* Mortgage Tab */}
          {activeTab === 'mortgage' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Application Form */}
              <div className="modern-card p-6">
                <h2 className="text-2xl font-bold mb-6">{t('defi.mortgage.applyTitle')}</h2>
                <form onSubmit={handleMortgageApply} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('defi.mortgage.propertyAddress')}</label>
                    <input
                      type="text"
                      required
                      value={mortgageForm.propertyAddress}
                      onChange={(e) => setMortgageForm({ ...mortgageForm, propertyAddress: e.target.value })}
                      className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg"
                      placeholder={t('defi.mortgage.propertyAddressPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('defi.mortgage.loanAmount')}</label>
                    <input
                      type="number"
                      required
                      value={mortgageForm.loanAmount}
                      onChange={(e) => setMortgageForm({ ...mortgageForm, loanAmount: e.target.value })}
                      className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg"
                      placeholder={t('defi.mortgage.loanAmountPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('defi.mortgage.term')}</label>
                    <select
                      value={mortgageForm.termMonths}
                      onChange={(e) => setMortgageForm({ ...mortgageForm, termMonths: e.target.value })}
                      className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg"
                    >
                      <option value="120">{t('defi.mortgage.years10')}</option>
                      <option value="180">{t('defi.mortgage.years15')}</option>
                      <option value="240">{t('defi.mortgage.years20')}</option>
                      <option value="360">{t('defi.mortgage.years30')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('defi.mortgage.collateralTokens')}</label>
                    <input
                      type="number"
                      required
                      value={mortgageForm.collateralTokens}
                      onChange={(e) => setMortgageForm({ ...mortgageForm, collateralTokens: e.target.value })}
                      className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg"
                      placeholder={t('defi.mortgage.collateralTokensPlaceholder')}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={mortgageLoading}
                    className="w-full modern-button px-6 py-3 rounded-lg font-semibold"
                  >
                    {mortgageLoading ? t('defi.mortgage.processing') : t('defi.mortgage.apply')}
                  </button>
                </form>
              </div>

              {/* Active Mortgages */}
              <div className="modern-card p-6">
                <h2 className="text-2xl font-bold mb-6">{t('defi.mortgage.yourMortgages')}</h2>
                {mortgages.length === 0 ? (
                  <p className="text-junot-text-muted text-center py-8">{t('defi.mortgage.noMortgages')}</p>
                ) : (
                  <div className="space-y-4">
                    {mortgages.map((mortgage) => (
                      <div key={mortgage.id} className="bg-white/60 backdrop-blur-sm p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-junot-text-muted">{t('defi.mortgage.loanAmount')}</span>
                          <span className="font-semibold">${mortgage.loanAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-junot-text-muted">{t('defi.mortgage.monthlyPayment')}</span>
                          <span className="font-semibold">${mortgage.monthlyPayment.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-junot-text-muted">{t('defi.mortgage.interestRate')}</span>
                          <span className="font-semibold">{(mortgage.interestRate * 100).toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-junot-text-muted">{t('defi.mortgage.status')}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            mortgage.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            mortgage.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {mortgage.status === 'active' ? t('defi.mortgage.active') : t('defi.mortgage.pending')}
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
                <h2 className="text-2xl font-bold mb-6">{t('defi.collateral.lockTitle')}</h2>
                <form onSubmit={handleLockCollateral} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('defi.collateral.propertyAddress')}</label>
                    <input
                      type="text"
                      required
                      value={collateralForm.propertyAddress}
                      onChange={(e) => setCollateralForm({ ...collateralForm, propertyAddress: e.target.value })}
                      className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('defi.collateral.tokensToLock')}</label>
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
                      className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg"
                      placeholder={t('defi.collateral.tokensToLockPlaceholder')}
                    />
                    {collateralForm.tokensToLock && (
                      <p className="text-xs text-neutral-500 mt-1">
                        {t('defi.collateral.collateralValue')}: ${(Number(collateralForm.tokensToLock) * 100).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('defi.collateral.borrowAmount')}</label>
                    <input
                      type="number"
                      required
                      value={collateralForm.borrowAmount}
                      onChange={(e) => setCollateralForm({ ...collateralForm, borrowAmount: e.target.value })}
                      className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg"
                      placeholder={t('defi.collateral.borrowAmountPlaceholder')}
                      max={collateralForm.tokensToLock ? calculateMaxBorrow(Number(collateralForm.tokensToLock)) : undefined}
                    />
                    {collateralForm.tokensToLock && (
                      <p className="text-xs text-neutral-500 mt-1">
                        {t('defi.collateral.maxBorrow')}: ${calculateMaxBorrow(Number(collateralForm.tokensToLock)).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={collateralLoading}
                    className="w-full modern-button px-6 py-3 rounded-lg font-semibold"
                  >
                    {collateralLoading ? t('defi.collateral.processing') : t('defi.collateral.lockCollateral')}
                  </button>
                </form>
              </div>

              {/* Active Positions */}
              <div className="modern-card p-6">
                <h2 className="text-2xl font-bold mb-6">{t('defi.collateral.yourPositions')}</h2>
                {collateralPositions.length === 0 ? (
                  <p className="text-junot-text-muted text-center py-8">{t('defi.collateral.noPositions')}</p>
                ) : (
                  <div className="space-y-4">
                    {collateralPositions.map((position) => (
                      <div key={position.id} className="bg-white/60 backdrop-blur-sm p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-junot-text-muted">{t('defi.collateral.lockedTokens')}</span>
                          <span className="font-semibold">{position.tokensLocked}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-junot-text-muted">{t('defi.collateral.borrowed')}</span>
                          <span className="font-semibold">${position.borrowedAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-junot-text-muted">{t('defi.collateral.healthFactor')}</span>
                          <span className={`font-semibold ${position.healthFactor >= 1.5 ? 'text-green-400' : position.healthFactor >= 1.2 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {position.healthFactor.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-junot-text-muted">{t('defi.collateral.status')}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            position.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {t('defi.collateral.active')}
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
                <h2 className="text-2xl font-bold mb-6">{t('defi.staking.stakeTitle')}</h2>
                <form onSubmit={handleStake} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('defi.staking.propertyAddress')}</label>
                    <input
                      type="text"
                      required
                      value={stakingForm.propertyAddress}
                      onChange={(e) => setStakingForm({ ...stakingForm, propertyAddress: e.target.value })}
                      className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('defi.staking.tokensToStake')}</label>
                    <input
                      type="number"
                      required
                      value={stakingForm.tokensToStake}
                      onChange={(e) => setStakingForm({ ...stakingForm, tokensToStake: e.target.value })}
                      className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg"
                      placeholder={t('defi.staking.tokensToStakePlaceholder')}
                    />
                    <p className="text-xs text-neutral-500 mt-2">
                      {t('defi.staking.apy')}: {Number(stakingForm.tokensToStake) >= 1000 ? '12%' : Number(stakingForm.tokensToStake) >= 100 ? '10%' : '8%'}
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={loyaltyLoading}
                    className="w-full modern-button px-6 py-3 rounded-lg font-semibold"
                  >
                    {loyaltyLoading ? t('defi.staking.processing') : t('defi.staking.stake')}
                  </button>
                </form>
              </div>

              {/* Staking Positions */}
              <div className="modern-card p-6">
                <h2 className="text-2xl font-bold mb-6">{t('defi.staking.yourStaking')}</h2>
                {stakingPositions.length === 0 ? (
                  <p className="text-junot-text-muted text-center py-8">{t('defi.staking.noStaking')}</p>
                ) : (
                  <div className="space-y-4">
                    {stakingPositions.map((position) => {
                      const rewards = calculateRewards(position);
                      return (
                        <div key={position.id} className="bg-white/60 backdrop-blur-sm p-4 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-junot-text-muted">{t('defi.staking.staked')}</span>
                            <span className="font-semibold">{position.tokensStaked} {t('defi.staking.tokens')}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-junot-text-muted">{t('defi.staking.apy')}</span>
                            <span className="font-semibold text-green-400">{(position.apy * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between mb-3">
                            <span className="text-sm text-junot-text-muted">{t('defi.staking.rewards')}</span>
                            <span className="font-semibold">{rewards.toFixed(4)} {t('defi.staking.tokens')}</span>
                          </div>
                          <button
                            onClick={() => handleClaimRewards(position.id)}
                            disabled={loyaltyLoading || rewards < 0.01}
                            className="w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {t('defi.staking.claimRewards')}
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
