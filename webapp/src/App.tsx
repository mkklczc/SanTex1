import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TrpcProvider } from './lib/trpc'
import 'antd/dist/reset.css'
import './styles/global.less'
// eslint-disable-next-line import/order
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute'
import EditEquipmentPage from './pages/EquipmentPage/EditEquipmentPage'
import EquipmentPage from './pages/EquipmentPage/Equipment'
import NewEquipmentPage from './pages/EquipmentPage/NewEquipmentPage'
import { HelloPage } from './pages/HelloPage/HelloPage'
import { LoginPage } from './pages/Login/LoginPage'
import EditMaterialPage from './pages/MaterialsPage/EditMaterilPage'
import MaterialsPage from './pages/MaterialsPage/Materials'
import NewMaterialPage from './pages/MaterialsPage/NewMaterilPage'

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
          <Route
            path="/resources/:sanTex"
            element={
              <PrivateRoute>
                <MaterialsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/resource/equipment"
            element={
              <PrivateRoute>
                <EquipmentPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/resource/materials/newmaterials"
            element={
              <PrivateRoute>
                <NewMaterialPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/resource/equipment/newequipment"
            element={
              <PrivateRoute>
                <NewEquipmentPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/resource/materials/:materialId/edit"
            element={
              <PrivateRoute>
                <EditMaterialPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/resource/equipment/:equipmentId/edit"
            element={
              <PrivateRoute>
                <EditEquipmentPage />
              </PrivateRoute>
            }
          />
          <Route path="/hello" element={<HelloPage />} />
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  )
}
