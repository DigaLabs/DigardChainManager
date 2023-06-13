import clsx from 'clsx'
import {KTIcon, KTSVG, toAbsoluteUrl} from '../../../helpers'
import {HeaderNotificationsMenu, HeaderUserMenu, Search, ThemeModeSwitcher} from '../../../partials'
import {useLayout} from '../../core'
import { useWeb3React } from '@web3-react/core'
import { DigardChainContext } from '../../../../app/blockchain/context/DigardChainContext'
import MetaMaskConnector from '../../../../app/blockchain/wallet/MetaMaskConnector'
import WalletConnector from '../../../../app/blockchain/wallet/WalletConnector'
import CoinBaseConnector from '../../../../app/blockchain/wallet/CoinBaseConnector'
import {Icon} from '@iconify/react'
import { useContext } from 'react'

const itemClass = 'ms-1 ms-lg-3'
const btnClass =
  'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px'
const userAvatarClass = 'symbol-35px symbol-md-40px'
const btnIconClass = 'fs-1'
const toolbarButtonMarginClass = 'ms-1 ms-lg-3',
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px'

const Navbar = () => {
  const {config} = useLayout()
  const {account, isActive} = useWeb3React()
  const { convertToShortTx } = useContext(DigardChainContext)
  return (
    <div className='app-navbar flex-shrink-0'>
      
      <div className={clsx('app-navbar-item', itemClass)}>
        <div className={clsx('position-relative', btnClass)} id='kt_drawer_chat_toggle'>
          <KTIcon iconName='message-text-2' className={btnIconClass} />
          <span className='bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink' />
        </div>
      </div>

      {isActive && (
          <div
            className={clsx('position-relative d-flex align-items-center', toolbarButtonMarginClass)}
            id='kt_header_user_menu_toggle'
          >
            {/* <span className='bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-35 start-0 animation-blink' /> */}
            <span className={clsx('margin-left: 10px')}>{convertToShortTx(account, 6)}</span>
            
          </div>
        )}
        {!isActive && (
          <>
            <button
              type='button'
              className='btn btn-primary d-flex col justify-center align-items-center'
              data-bs-toggle='modal'
              data-bs-target='#kt_modal_1'
            >
              <div className='d-flex align-items-center px-1'>
                <Icon fontSize='1.5rem' icon='ic:round-wallet' />
              </div>
              <div>Connect</div>
            </button>
            <div className='modal fade' tabIndex={-1} id='kt_modal_1'>
              <div className='modal-dialog'>
                <div className='modal-content'>
                  <div className='modal-header'>
                    <h5 className='modal-title'>Connect Wallet</h5>
                    <div
                      className='btn btn-icon btn-sm btn-active-light-primary ms-2'
                      data-bs-dismiss='modal'
                      aria-label='Close'
                    >
                      <KTSVG
                        path='/media/icons/duotune/arrows/arr061.svg'
                        className='svg-icon svg-icon-2x'
                      />
                    </div>
                  </div>
                  <div className='modal-body'>
                    <MetaMaskConnector />
                    <WalletConnector />
                    <CoinBaseConnector />
                  </div>
                  <div className='modal-footer'>
                    <button type='button' className='btn btn-light' data-bs-dismiss='modal'>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      

      {config.app?.header?.default?.menu?.display && (
        <div className='app-navbar-item d-lg-none ms-2 me-n3' title='Show header menu'>
          <div
            className='btn btn-icon btn-active-color-primary w-35px h-35px'
            id='kt_app_header_menu_toggle'
          >
            <KTIcon iconName='text-align-left' className={btnIconClass} />
          </div>
        </div>
      )}
    </div>
  )
}

export {Navbar}
