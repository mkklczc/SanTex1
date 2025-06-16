import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TrpcProvider } from './lib/trpc'
import 'antd/dist/reset.css'
import './styles/global.less'
// eslint-disable-next-line import/order
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute'
import { HelloPage } from './pages/HelloPage/HelloPage'
import { LoginPage } from './pages/Login/LoginPage'

export const App = () => {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HelloPage />
              </PrivateRoute>
            }
          />
          <Route path="/hello" element={<HelloPage />} />
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  )
}
