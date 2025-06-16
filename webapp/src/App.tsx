import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TrpcProvider } from './lib/trpc'
import 'antd/dist/reset.css'
import './styles/global.less'

import { HelloPage } from './pages/HelloPage/HelloPage'
import { LoginPage } from './pages/Login/LoginPage'
// eslint-disable-next-line import/order

export const App = () => {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/hello" element={<HelloPage />} />
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  )
}
