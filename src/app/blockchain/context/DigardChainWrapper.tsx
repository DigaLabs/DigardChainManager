import { hooks as metaMaskHooks, metaMask } from '../wallet/interfaces/MetaMaskConnectorInterface';
import { hooks as walletConnectHooks, walletConnect } from '../wallet/interfaces/WalletConnectConnectorInterface';
import { hooks as coinBaseHooks, coinBaseWallet } from '../wallet/interfaces/CoinBaseConnectorInterface';
import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';
import React, { ReactNode } from 'react';
import { MetaMask } from "@web3-react/metamask";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { WalletConnect } from '@web3-react/walletconnect';
import DigardChainContextProvider from './DigardChainContext';
import WalletProvider from '../wallet/WalletProvider';

type Props = {
  children: ReactNode;
  digardChainId: number;
  chainConfig: any;
  watchTokenAssets: Array<string> | null;
};

const DigardChainWrapper: React.FC<Props> = ({ children, digardChainId, chainConfig, watchTokenAssets }: Props) => {

  const connectors: [MetaMask | WalletConnect | CoinbaseWallet, Web3ReactHooks][] = [
    [metaMask, metaMaskHooks],
    [walletConnect, walletConnectHooks],
    [coinBaseWallet, coinBaseHooks]
  ];
  return (
    <Web3ReactProvider connectors={connectors}>
      <DigardChainContextProvider chainConfig={chainConfig} digardChainId={digardChainId} watchTokenAssets={watchTokenAssets}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </DigardChainContextProvider>
    </Web3ReactProvider>
  );
};

export default DigardChainWrapper;
