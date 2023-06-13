/* eslint-disable react-hooks/exhaustive-deps */
import {useContext, useEffect, useState} from 'react'
import {Injected} from './InjectedConnectors'
import {useWeb3React} from '@web3-react/core'
import {DigardChainContext} from '../context/DigardChainContext'

export const WalletProvider = ({children}) => {
  const {digardChainId} = useContext(DigardChainContext)
  const {connector} = useWeb3React()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Injected.isAuthorized()
      .then((isAuthorized) => {
        setLoaded(true)
        if (isAuthorized) {
          connector.activate(digardChainId)
        }
      })
      .catch(() => {
        setLoaded(true)
      })
  }, [connector])

  if (loaded) {
    return children
  }
  return <>Loading</>
}

export default WalletProvider
