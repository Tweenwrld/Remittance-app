import { useWallets } from '@mysten/dapp-kit';
import { Button } from 'antd';
import { useState } from 'react';

export function WalletConnect() {
  const wallets = useWallets();
  const [connectedWallet, setConnectedWallet] = useState<any>(null);

  const connect = () => {
    if (wallets.length > 0) {
      setConnectedWallet(wallets[0]);
    }
  };

  const disconnect = () => {
    setConnectedWallet(null);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      {connectedWallet ? (
        <>
          <p>Connected: {connectedWallet.accounts[0]?.address?.slice(0, 6)}...{connectedWallet.accounts[0]?.address?.slice(-4)}</p>
          <Button onClick={disconnect}>Disconnect Wallet</Button>
        </>
      ) : (
        <Button type="primary" onClick={connect}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
}