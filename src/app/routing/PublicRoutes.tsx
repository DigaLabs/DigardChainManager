import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'


const PublicRoutes = () => {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route path='eldarune' element={<BuilderPageWrapper />} />

        {/* Lazy Modules */}
        {/* <Route path='my-wallet/*' element={<ProfilePage />} /> */}

        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

export {PublicRoutes}
