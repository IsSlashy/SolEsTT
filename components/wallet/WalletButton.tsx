'use client';

import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function WalletButton() {
  return (
    <WalletMultiButtonDynamic
      className="!bg-junot-gold hover:!bg-junot-gold-light !text-white !transition-all !shadow-lg hover:!shadow-xl !border !border-junot-gold-dark !font-semibold !uppercase !tracking-wide !text-sm"
    />
  );
}
