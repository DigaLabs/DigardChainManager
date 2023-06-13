/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import {FC} from 'react'
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import {PrivateRoutes} from './PrivateRoutes'
import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {Logout, AuthPage, useAuth} from '../modules/auth'
import {App} from '../App'
import {PublicRoutes} from './PublicRoutes'

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */

const AppRoutes: FC = () => {
  const {currentUser} = useAuth()
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          <Route path='*' element={<PublicRoutes />} />
          <Route index element={<Navigate to='/dashboard' />} />
          {currentUser ? (
            <>
              <Route path='account/*' element={<PrivateRoutes />} />
              <Route index element={<Navigate to='/account' />} />
            </>
          ) : (
            <>
              <Route path='auth/*' element={<AuthPage />} />
              <Route path='account/*' element={<Navigate to='/auth' />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {AppRoutes}
