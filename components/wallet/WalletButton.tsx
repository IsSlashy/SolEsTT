'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function WalletButton() {
  return (
    <WalletMultiButton
      className="!bg-purple-600 hover:!bg-purple-700 !transition-colors"
    />
  );
}
