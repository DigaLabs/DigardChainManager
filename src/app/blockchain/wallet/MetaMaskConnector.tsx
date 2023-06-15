import React, {useEffect} from 'react'
import {metaMask} from './interfaces/MetaMaskConnectorInterface'
//import { toastHelper } from "helper/toastHelper";
import detectEthereumProvider from '@metamask/detect-provider'
import style from './style.module.scss'
import {useNavigate} from 'react-router-dom'
import {toastErrorNotify} from '../../helper/toastHelper'
import { toAbsoluteUrl } from '../helpers/helper'
export default function MetaMaskConnector() {
  const navigate = useNavigate()

  const connect = async () => {
    const provider = await detectEthereumProvider()
    if (provider) {
      metaMask
        .activate()
        .then(() => {
          const modalElement = document.getElementById('kt_modal_1')
          if (modalElement) {
            modalElement.addEventListener('hidden.bs.modal', handleModalHidden)
            modalElement.classList.remove('show')
            modalElement.setAttribute('aria-hidden', 'true')
            document.body.classList.remove('modal-open')
          }
         
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      //Bildirim için bir notification library gerekiyor. Aşağıdaki satır örnek.
      // toastHelper.error('Please install MetaMask!');
      toastErrorNotify('Please Install MetaMask')
    }
  }

  const handleModalHidden = () => {
    const modalBackdrop = document.querySelector('.modal-backdrop')
    if (modalBackdrop) {
      modalBackdrop.parentNode?.removeChild(modalBackdrop)
    }
  }

  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to metamask')
    })
  }, [])

  return (
    <div onClick={connect} className={style.menu_link} data-bs-dismiss='modal' aria-label='Close'>
      <img src={toAbsoluteUrl('/media/images/wallet/metamask.svg')} alt='Logo' width={50} height={50} />
      &nbsp;<span className='cs-wallet_text'>Metamask</span>
    </div>
  )
}
