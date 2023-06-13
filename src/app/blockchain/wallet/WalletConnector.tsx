import React, {useEffect} from 'react'
import {URI_AVAILABLE} from '@web3-react/walletconnect'
import {walletConnect} from './interfaces/WalletConnectConnectorInterface'
import style from './style.module.scss'

export default function WalletConnectConnector() {
  const connect = () => {
    walletConnect
      .activate()
      .then(() => {})
      .catch((ex) => {
        console.log(ex)
      })
  }

  useEffect(() => {
    walletConnect.events.on(URI_AVAILABLE, (uri: string) => {
      console.log(`uri: ${uri}`)
    })

    walletConnect.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to walletconnect')
    })
  }, [])

  return (
    <div onClick={connect} className={style.menu_link}>
      <img src='/media/images/wallet/walletconnect.svg' alt='Logo' width={50} height={50} />
      &nbsp;<span className='cs-wallet_text'>WalletConnect</span>
    </div>
  )
}
