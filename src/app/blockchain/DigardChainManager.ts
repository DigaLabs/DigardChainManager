/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-redeclare */
import {ethers} from 'ethers'
import {Contract, ContractInterface} from '@ethersproject/contracts'
import {Web3Provider, WebSocketProvider} from '@ethersproject/providers'
import DigardChainInformationFile from './configs/chainInformationConfig.json'
import DigardChainExtendedInformationFile from './configs/chainExtInformationConfig.json'
import {Injected} from './wallet/InjectedConnectors'
import type {Connector} from '@web3-react/types'

export interface DigardChainCurrency {
  name: string
  symbol: string
  decimals: number
}
export interface DigardChainInformation {
  chainId: string
  chainName: string
  nativeCurrency: DigardChainCurrency
  rpcUrls: Array<string>
  blockExplorerUrls: Array<string>
}
export interface ChainExtendedInformation {
  icon: string
  testnet: boolean
}
export interface DigardChainExtendedInformation extends DigardChainInformation {
  icon: string
  testnet: boolean
}
export interface DigardChainConfig {
  chainId: number
  wssRPCUrl?: string
  contracts: DigardContractConfig[]
}
export interface DigardContractConfig {
  name: string
  address: string
  abi: any
}
export const DigardChainUrls: {[chainId: string]: string[]} = Object.keys(
  DigardChainInformationFile
).reduce<{[chainId: string]: string[]}>((accumulator, chainId) => {
  const validURLs: string[] = DigardChainInformationFile[chainId].rpcUrls

  if (validURLs.length) {
    accumulator[chainId] = validURLs
  }

  return accumulator
}, {})
export const DigardUtils = () => {
  const toFixed = (x: any) => {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1])
      if (e) {
        x *= Math.pow(10, e - 1)
        x = '0.' + new Array(e).join('0') + x.toString().substring(2)
      }
    } else {
      var e = parseInt(x.toString().split('+')[1])
      if (e > 20) {
        e -= 20
        x /= Math.pow(10, e)
        x += new Array(e + 1).join('0')
      }
    }
    return x
  }
  const toEtherFormat = (inputVal: any, decimals: number, formatFixed: number): string => {
    try {
      inputVal = ethers.utils.formatUnits(inputVal, decimals)
      inputVal = Number(inputVal)
      if (Number.isInteger(inputVal)) {
        return inputVal.toLocaleString()
      }
      return inputVal.toFixed(formatFixed).toLocaleString()
    } catch (ex) {
      return '0'
    }
  }

  const toWei = (inputVal: any, decimals: number = 18): BigInt => {
    let priceWei = Number(inputVal) * 10 ** decimals
    priceWei = toFixed(priceWei)
    return BigInt(priceWei)
  }
  const getDigardChainInformationConfig = (chainId: number): DigardChainInformation | null => {
    let rtn: {[chainId: number]: DigardChainInformation} = DigardChainInformationFile
    try {
      if (rtn) {
        let _DigardChainInformationConfig: DigardChainInformation = rtn[chainId]
        return _DigardChainInformationConfig
      }
    } catch (ex) {
      console.log('--findDigardChainInformationConfig: ' + ex)
    }
    return null
  }

  const getDigardChainExtendedInformationConfig = (
    chainId: number
  ): DigardChainExtendedInformation | null => {
    let rtn: {[chainId: number]: ChainExtendedInformation} = DigardChainExtendedInformationFile
    try {
      if (rtn) {
        let _DigardChainInformationConfig: DigardChainInformation =
          getDigardChainInformationConfig(chainId)
        let _DigardChainExtendedInformationConfig: ChainExtendedInformation = rtn[chainId]
        return {..._DigardChainInformationConfig, ..._DigardChainExtendedInformationConfig}
      }
    } catch (ex) {
      console.log('--findDigardChainExtendedInformationConfig: ' + ex)
    }
    return null
  }

  const convertToShortTx = (val: string, firstCharLength: number = 2): string => {
    if (!val) return ''

    const first2 = val.substring(0, firstCharLength)
    const lastCharacter = firstCharLength - 2
    const last4 = val.slice(val.length - lastCharacter, val.length)
    return `${first2}...${last4}`
  }

  return {
    getDigardChainInformationConfig,
    getDigardChainExtendedInformationConfig,
    toEtherFormat,
    toWei,
    convertToShortTx,
  }
}
export class DigardChainManager {
  public chainId: number
  public defaultChainId: number
  public chainInformation: DigardChainInformation
  public chainExtentedInformation: DigardChainExtendedInformation
  private _provider: Web3Provider | ethers.providers.WebSocketProvider
  private _formatFixed: number
  private _decimals: number
  private _chainConfig: DigardChainConfig | undefined
  private _defaultChainConfig: DigardChainConfig | undefined
  private _chainConfigs:DigardChainConfig[] | undefined

  private _findDigardChainConfig(chainId: number): DigardChainConfig | undefined {
    
    try {
      if (this._chainConfigs) {
        return this._chainConfigs.find((f: DigardChainConfig) => f.chainId === chainId)
      }
    } catch (ex) {
      console.log('_findDigardChainConfig: ' + ex)
    }

    return undefined
  }

  constructor(chainConfigs: DigardChainConfig[], chainId: number, defaultChainId: number, formatFixed: number = 3, decimals: number = 18) {
    const {getDigardChainInformationConfig, getDigardChainExtendedInformationConfig} = DigardUtils()
    this._chainConfigs = chainConfigs;
    this.chainId = chainId
    this.defaultChainId = defaultChainId;
    this._formatFixed = formatFixed
    this._decimals = decimals
    const defaultChainConfig = this._findDigardChainConfig(defaultChainId)
    if(defaultChainConfig) {
      this._defaultChainConfig = defaultChainConfig;
    }
    const chainConfig = this._findDigardChainConfig(chainId)
    if(chainConfig) {
      this._chainConfig = chainConfig;
    }

    const _chainInformation = getDigardChainInformationConfig(chainId)
    const _chainExtendedInformation = getDigardChainExtendedInformationConfig(chainId)
    if (_chainInformation) {
      this.chainInformation = _chainInformation
    }
    if (_chainExtendedInformation) {
      this.chainExtentedInformation = _chainExtendedInformation
    }
  }
  createWebSocketProvider(): ethers.providers.WebSocketProvider | null {
    if (this._chainConfig) {
      if (this._chainConfig.wssRPCUrl) {
        return new ethers.providers.WebSocketProvider(this._chainConfig.wssRPCUrl)
      }
    }
    console.log('--No Chain WSSRPC')
    return null
  }
  setProvider(provider: Web3Provider | ethers.providers.WebSocketProvider | undefined) {
    if (provider) {
      this._provider = provider
    }
  }
  async contract(name: string, signer: boolean = false): Promise<DigardContract | null> {
    if (this._chainConfig) {
      const contractConfig = this._chainConfig.contracts.find(
        (f: DigardContractConfig) => f.name === name
      )
      if (!contractConfig) return null
      let _signerOrProvider: ethers.Signer | ethers.providers.Provider
      if (signer) {
        _signerOrProvider = this._provider.getSigner().connectUnchecked()
      } else _signerOrProvider = this._provider

      let signerOrProvider: ethers.Signer | ethers.providers.Provider = _signerOrProvider as
        | ethers.Signer
        | ethers.providers.Provider
      const contract = new DigardContract(
        contractConfig.address,
        contractConfig.abi,
        signerOrProvider
      )
      contract.setProvider(this._provider)
      return contract
    }
    return null
  }
  async contractWs(name: string) {
    if (this._chainConfig) {
      const contractConfig = this._chainConfig.contracts.find(
        (f: DigardContractConfig) => f.name === name
      )
      if (!contractConfig) return null
      const wsProvider = this.createWebSocketProvider()
      if (wsProvider) {
        return new DigardContract(contractConfig.address, contractConfig.abi, wsProvider)
      }
    }
    return null
  }
  async balanceCompare(compareWei: BigInt): Promise<boolean> {
    const signer = this._provider.getSigner()
    const signerAddress: string = await signer.getAddress()
    let balanceBigInt = await this._provider.getBalance(signerAddress)

    return Number(balanceBigInt) >= Number(compareWei)
  }
  async getBalance(
    provider: Web3Provider | ethers.providers.WebSocketProvider = null,
    account: string = null
  ): Promise<string> {
    let __provider = null
    let __account = null
    if (provider) {
      __provider = provider
    } else __provider = this._provider
    if (account) {
      __account = account
    } else {
      const signer = this._provider.getSigner()
      __account = await signer.getAddress()
    }

    let balanceBigInt = await __provider.getBalance(__account)
    const {toEtherFormat} = DigardUtils()
    return toEtherFormat(balanceBigInt, this._decimals, this._formatFixed)
  }
  isCorrectChain(chainId: number): boolean {
    return chainId === this.defaultChainId
  }
  async addChain(chainId?: number): Promise<void> {
    let __chainId = this.defaultChainId
    if (chainId) __chainId = chainId
    const {getDigardChainInformationConfig} = DigardUtils()
    const chainInformation = getDigardChainInformationConfig(__chainId)
    if (!chainInformation) return
    try {
      await this._provider.send('wallet_addEthereumChain', [chainInformation])
    } catch (ex) {
      console.log('--addChain: ' + ex)
    }
  }
  async switchChain(connector: Connector, chainId?: number): Promise<void> {
    let __chainId = this.defaultChainId
    if (chainId) __chainId = chainId
    try {
      const isAuthorized = await Injected.isAuthorized()
      if (isAuthorized) {
        try {
          await connector.activate(__chainId)
        } catch (switchError) {
          if (switchError.code === 4902) await this.addChain()
          else console.log(`Cannot connect wallet with unknown code.`)
        }
      }
    } catch (ex) {
      console.log(`SwitchChain error.`)
    }
  }
  createScanTxLink(txCode: string): string {
    return `${this.chainInformation.blockExplorerUrls[0]}/tx/${txCode}`
  }
}

export class DigardContract extends Contract {
  private _decimals: number = 0
  private _symbol: string = ''
  private _digardProvider: Web3Provider | WebSocketProvider = null
  private _address: string = ''
  private _interface: ContractInterface
  private _signerOrProvider?: ethers.Signer | ethers.providers.Provider

  constructor(
    addressOrName: string,
    contractInterface: ContractInterface,
    signerOrProvider?: ethers.Signer | ethers.providers.Provider
  ) {
    super(addressOrName, contractInterface, signerOrProvider)
    this._address = addressOrName
    this._interface = contractInterface
    this._signerOrProvider = signerOrProvider
  }
  setProvider(provider: Web3Provider | WebSocketProvider) {
    this._digardProvider = provider
  }
  async getDecimals(): Promise<number> {
    if (this._decimals === 0) {
      return await this.decimals()
    }
    return await this._decimals
  }
  async getSymbol(): Promise<string> {
    if (!this._symbol) {
      return await this.symbol()
    }
    return await this._symbol
  }

  async getTokenBalance(balanceAddress: string | null, isFormat: boolean = true): Promise<string> {
    if (balanceAddress === undefined) {
      balanceAddress = null
    }
    if (!this._digardProvider) {
      console.log('--getTokenBalance: Not find provider')
      return ''
    }

    const {toEtherFormat} = DigardUtils()
    const decimals = await this.getDecimals()
    if (!balanceAddress) {
      const signer = this._digardProvider.getSigner()
      balanceAddress = await signer.getAddress()
    }
    const tokenBalance = await this.balanceOf(balanceAddress)
    if (tokenBalance) {
      if (isFormat) return toEtherFormat(tokenBalance, decimals, 3)
      return tokenBalance.toString()
    }
    return ''
  }
  async addToken(tokenImage: string): Promise<void> {
    if (!this._digardProvider) {
      console.log('--addToken: Not find provider')
      return
    }
    const tokenAddress = this.address
    const tokenSymbol = await this.getSymbol()
    try {
      await this._digardProvider.send('wallet_watchAsset', [
        {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: 18,
            image: tokenImage,
          },
        },
      ])
    } catch (ex) {
      console.log('--addToken: ' + ex)
    }
  }

  async contractOnEventListener(
    eventName: string | ethers.EventFilter,
    callBack: (...args: Array<any>) => void
  ): Promise<any> {
    this.on(eventName, callBack)
  }

  async contractLastHistoryEvent(eventName: string, args?: Array<any>): Promise<any | null> {
    let eventFilter = this.filters[eventName](args)
    if (eventFilter) {
      const logs = await this.queryFilter(
        eventFilter,
        this._digardProvider.blockNumber - 10000,
        'latest'
      )
      if (logs.length > 0) {
        const lastIndex = logs.length - 1
        return logs[lastIndex].args
      }
    }
  }
}
