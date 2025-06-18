import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Layout as AntLayout, Tooltip, Button } from 'antd'
import React, { ReactNode, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  getAllAppRoute,
  getAllMaterialsRoute,
  getEquipmentRoute,
  getWorksRoute,
  getObjectsRoute,
  getReportsRoute,
} from '../../lib/routes'

import styles from './Layout.module.less'

const { Sider, Content } = AntLayout

type ILayout = {
  children: ReactNode
}

export const Layout: React.FC<ILayout> = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const handleCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed)
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992) // Adjust this width according to your design needs
    }

    // Initialize the state on component mount
    handleResize()

    // Add event listener on window resize
    window.addEventListener('resize', handleResize)

    // Clean up the event listener when component unmounts
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <AntLayout className={styles.layout}>
      <Sider
        className={styles.layout__header}
        collapsible
        collapsed={collapsed}
        onCollapse={handleCollapse}
        breakpoint="lg"
        collapsedWidth="0"
        trigger={null}
      >
        <div className={styles.layout__nav}>
          <Link
            to={getAllAppRoute()}
            className={`${styles.layout__navItem} ${location.pathname === getAllAppRoute() ? styles.layout__navItem_active : ''}`}
          >
            Главная страница
          </Link>
          <Link
            to={getAllMaterialsRoute({ sanTex: 'materials' })}
            className={`${styles.layout__navItem} ${location.pathname === getAllMaterialsRoute({ sanTex: 'materials' }) ? styles.layout__navItem_active : ''}`}
          >
            Материалы
          </Link>
          <Link
            to={getEquipmentRoute()}
            className={`${styles.layout__navItem} ${location.pathname === getEquipmentRoute() ? styles.layout__navItem_active : ''}`}
          >
            Оборудование
          </Link>
          <Link
            to={getWorksRoute()}
            className={`${styles.layout__navItem} ${location.pathname === getWorksRoute() ? styles.layout__navItem_active : ''}`}
          >
            Работы
          </Link>
          <Link
            to={getObjectsRoute()}
            className={`${styles.layout__navItem} ${location.pathname === getObjectsRoute() ? styles.layout__navItem_active : ''}`}
          >
            Объекты
          </Link>
          <Link
            to={getReportsRoute()}
            className={`${styles.layout__navItem} ${location.pathname === getReportsRoute() ? styles.layout__navItem_active : ''}`}
          >
            Отчёты
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className={styles.layout__user} onClick={handleLogout}>
            <Tooltip title="Выйти">
              <LogoutOutlined />
            </Tooltip>
          </div>
        </div>
      </Sider>

      {/* Only show the toggle button on smaller screens */}
      {isMobile && (
        <div className={styles.layout__toggleButton}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              fontSize: '20px', // Smaller icon size
              marginLeft: '-13px',
              color: 'white', // White color for the icon
              background: 'transparent', // Transparent background to make it less intrusive
              border: 'none', // Remove the button border
            }}
          />
        </div>
      )}

      <Content className={styles.layout__content}>{children}</Content>
    </AntLayout>
  )
}

export default Layout
