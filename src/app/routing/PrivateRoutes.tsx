import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
// import ProfileSettings from '../pages/profile-settings/ProfileSettings'
// import GameProfilePage from '../pages/game-profile/GameProfilePage'

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* <Route path='settings' element={<ProfileSettings />} />
        <Route path='game-profile/*' element={<GameProfilePage />} /> */}
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

export {PrivateRoutes}
