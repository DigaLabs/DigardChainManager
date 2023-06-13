/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-self-assign */
import {ethers} from 'ethers'
import {useWeb3React} from '@web3-react/core'
import {TokenBalanceChange, WatchTokenBalance} from '../dto/WatchTokenBalance'
import React, {ReactNode, createContext, useEffect, useState} from 'react'
import {DigardChainInformation, DigardChainManager, DigardUtils} from '../DigardChainManager'
import {WatchBalance} from '../dto/WatchBalance'
import DefaultChainConfig from '../configs/defaultChainConfig.json';

type DigardChainContextType = {
  digardChainId: number
  chainInformation: DigardChainInformation
  chainManager: DigardChainManager
  isValidChain: boolean
  chainBalanceInformation: WatchBalance
  tokenBalances: Array<WatchTokenBalance>
  switchChain: () => void
  toEtherFormat: (inputVal: any, decimals: number, formatFixed: number) => string
  toWei: (inputVal: any, decimals: number) => BigInt
  convertToShortTx: (val: string, firstCharLength: number) => string
}

type Props = {
  children: ReactNode
  digardChainId: number
  chainConfig: any
  watchTokenAssets: Array<string> | null
}

const defaults: DigardChainContextType = {
  digardChainId: 1,
  chainInformation: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  chainManager: new DigardChainManager(DefaultChainConfig, 1, 1),
  isValidChain: false,
  chainBalanceInformation: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io'],
    icon: '',
    testnet: false,
    balance: '0',
  },
  tokenBalances: [],
  toEtherFormat: (inputVal: any, decimals: number, formatFixed: number) => {
    inputVal = inputVal
    decimals = decimals
    formatFixed = formatFixed
    return ''
  },
  toWei: (inputVal: any, decimals: number) => {
    inputVal = inputVal
    decimals = decimals
    return BigInt(0)
  },
  convertToShortTx: (val: string, firstCharLength: number) => {
    val = val
    firstCharLength = firstCharLength
    return ''
  },
  switchChain: () => {},
}
export const DigardChainContext = createContext<DigardChainContextType>(defaults)

const DigardChainContextProvider: React.FC<Props> = ({
  children,
  digardChainId,
  chainConfig,
  watchTokenAssets,
}: Props) => {
  const {account, chainId, provider, connector} = useWeb3React()
  const [chainManager, setChainManager] = useState<DigardChainManager>(defaults.chainManager)
  const [wsProvider, setWsProvider] = useState<ethers.providers.WebSocketProvider>()
  const [isValidChain, setIsValidChain] = useState<boolean>(false)
  const [tokenBalanceChanged, setTokenBalanceChanged] = useState<TokenBalanceChange>()
  const [tokenBalances, setTokenBalances] = useState<Array<WatchTokenBalance>>([])
  const [balance, setBalance] = useState<string>('0')
  const [chainInformation, setChainInformation] = useState<DigardChainInformation>(
    defaults.chainInformation
  )
  const [chainBalanceInformation, setChainBalanceInformation] = useState<WatchBalance>()
  const {
    toEtherFormat,
    toWei,
    getDigardChainInformationConfig,
    getDigardChainExtendedInformationConfig,
    convertToShortTx,
  } = DigardUtils()

  const watchTokenBalance = async (tokenContractName: string) => {
    const tokenContract = await chainManager.contractWs(tokenContractName)
    if (account && tokenContract) {
      const tokenFromFilter = {
        address: tokenContract.address,
        topics: [
          ethers.utils.id('Transfer(address,address,uint256)'),
          ethers.utils.hexZeroPad(account, 32),
          null,
        ],
      }

      const tokenToFilter = {
        address: tokenContract.address,
        topics: [
          ethers.utils.id('Transfer(address,address,uint256)'),
          null,
          ethers.utils.hexZeroPad(account, 32),
        ],
      }

      await tokenContract.contractOnEventListener(tokenFromFilter, (from, to, value) => {
        setTokenBalanceChanged({
          from: from,
          to: to,
          token: tokenContractName,
          value: value.toString(),
          isSum: false,
        })
      })

      await tokenContract.contractOnEventListener(tokenToFilter, (from, to, value) => {
        setTokenBalanceChanged({
          from: from,
          to: to,
          token: tokenContractName,
          value: value.toString(),
          isSum: true,
        })
      })
    }
  }

  const getWatchingTokenBalance = async (tokenName: string) => {
    let _tokenBalance: WatchTokenBalance = {
      token: tokenName,
      balance: '0',
      balanceFormat: '0',
      decimals: 0,
    }
    if (tokenBalances.length > 0) {
      const tokenBalanceFind = tokenBalances.find((f) => f.token === tokenName)
      if (tokenBalanceFind != null) {
        _tokenBalance = tokenBalanceFind
      }
    }

    let contractInstance = await chainManager.contract(tokenName, false)
    if (contractInstance && account) {
      _tokenBalance.decimals = await contractInstance.getDecimals()
      _tokenBalance.balance = await contractInstance.getTokenBalance(account, false)
      _tokenBalance.balanceFormat = toEtherFormat(
        BigInt(_tokenBalance.balance),
        _tokenBalance.decimals,
        3
      )
      return _tokenBalance
    }
    return null
  }

  const initWatchingTokenBalances = async () => {
    if (watchTokenAssets) {
      watchTokenAssets.forEach(async (tokenName) => {
        const _tokenBalance = await getWatchingTokenBalance(tokenName)
        if (_tokenBalance) {
          setTokenBalances((prev) => [...prev, _tokenBalance])
          watchTokenBalance(tokenName)
        }
      })
    }
  }

  const initWatchingBalance = async (address)=> {
    const accountBalance = await chainManager.getBalance(provider, address)
    setBalance(accountBalance);
    if(wsProvider) {
      watchBalance(address);
    }
  }

  const watchBalance = async (address) => {
    wsProvider.on('block', async (blockNumber) => {
      try {
        const accountBalance = await chainManager.getBalance(wsProvider, address)
        setBalance(accountBalance)
      } catch (error) {
        console.error('Error:', error)
      }
    })
  }

  const switchChain = async () => {
    if (chainManager && connector) {
      await chainManager.switchChain(connector, digardChainId)
    }
  }

  useEffect(() => {
    if (balance && chainId) {
      const _digardChainExtendedInformation = getDigardChainExtendedInformationConfig(chainId)
      if (_digardChainExtendedInformation) {
        setChainBalanceInformation({..._digardChainExtendedInformation, balance: balance})
      }
    }
  }, [balance, chainId])

  useEffect(() => {
    if (tokenBalanceChanged) {
      getWatchingTokenBalance(tokenBalanceChanged.token).then((_tokenBalance) => {
        if (_tokenBalance) {
          if (tokenBalanceChanged.isSum)
            _tokenBalance.balance = (
              BigInt(_tokenBalance.balance) + BigInt(tokenBalanceChanged.value)
            ).toString()
          if (!tokenBalanceChanged.isSum)
            _tokenBalance.balance = (
              BigInt(_tokenBalance.balance) - BigInt(tokenBalanceChanged.value)
            ).toString()
          _tokenBalance.balanceFormat = toEtherFormat(
            _tokenBalance.balance,
            _tokenBalance.decimals,
            3
          )
          setTokenBalances((prev) => [...prev, _tokenBalance])
        }
      })
    }
  }, [tokenBalanceChanged])

  useEffect(() => {
    if (provider) {
      const _chainInformation = getDigardChainInformationConfig(digardChainId)
      if (_chainInformation) {
        setChainInformation(_chainInformation)
      }

      const _digardChainManager = new DigardChainManager(chainConfig, chainId, digardChainId)
      _digardChainManager.setProvider(provider)
      setChainManager(_digardChainManager)

      const _wsProvider = _digardChainManager.createWebSocketProvider()
      if (_wsProvider) {
        setWsProvider(_wsProvider)
      }
    }
  }, [provider])

  useEffect(() => {
    if (chainId) {
      const result = chainId === digardChainId
      setIsValidChain(result)
    }
  }, [chainId])

  useEffect(() => {
    if (account && chainId && chainManager) {
      initWatchingBalance(account)
      if (watchTokenAssets) {
        initWatchingTokenBalances()
      }
    }
  }, [account, chainId, chainManager])

  const values = {
    digardChainId: digardChainId,
    chainInformation: chainInformation,
    chainManager: chainManager,
    isValidChain: isValidChain,
    chainBalanceInformation: chainBalanceInformation,
    tokenBalances: tokenBalances,
    switchChain: switchChain,
    toEtherFormat: toEtherFormat,
    toWei: toWei,
    convertToShortTx: convertToShortTx,
  }

  return <DigardChainContext.Provider value={values}>{children}</DigardChainContext.Provider>
}

export default DigardChainContextProvider
