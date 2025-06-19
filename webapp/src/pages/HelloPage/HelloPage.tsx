import { HomeOutlined, AppstoreOutlined, ToolOutlined } from '@ant-design/icons'
import { Card, List, Statistic } from 'antd'
import dayjs from 'dayjs'
import Iconka from '../../assets/Iconka.svg?react'
import Layout from '../../components/Layout/Layout'
import { trpc } from '../../lib/trpc'
import styles from './HelloPage.module.less'

export const HelloPage = () => {
  const { data, isLoading, isError } = trpc.dashboard.summary.useQuery()

  const currentDate = dayjs().format('DD.MM.YYYY')

  if (isLoading) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    )
  }

  if (isError || !data) {
    return (
      <Layout>
        <p>Ошибка загрузки</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className={styles.titleWrapper}>
        <div className={styles.bigLogo}>
          <Iconka style={{ height: '150px', width: '150px' }} />
        </div>
      </div>
      <h1 className="pageTitle">Учет ресурсов и управления производственными процессами</h1>
      <div className={styles.header}>
        {/* <div className={styles.logo}>
          <Iconka />
        </div> */}
        <div className={styles.date}>{currentDate}</div>
      </div>

      <div className={styles.dashboard}>
        <Card className={styles.card}>
          <Statistic
            title={
              <span>
                <HomeOutlined /> Всего объектов
              </span>
            }
            value={data.objectsCount}
            valueStyle={{ color: '#fc8231' }}
          />
        </Card>
        <Card className={styles.card}>
          <Statistic
            title={
              <span>
                <AppstoreOutlined /> Всего материалов
              </span>
            }
            value={data.materialsCount}
            valueStyle={{ color: '#fc8231' }}
          />
        </Card>
        <Card className={styles.card}>
          <Statistic
            title={
              <span>
                <ToolOutlined /> Работы сегодня
              </span>
            }
            value={data.worksTodayCount}
            valueStyle={{ color: '#fc8231' }}
          />
        </Card>
      </div>

      {data.upcomingWorks.length > 0 && (
        <div className={styles.notifications}>
          <h2>Уведомления о сроках</h2>
          <List
            dataSource={data.upcomingWorks}
            renderItem={(item) => (
              <List.Item>
                {item.description} (объект: {item.constructionObject.name}) – до{' '}
                {dayjs(item.endDate).format('DD.MM.YYYY')}
              </List.Item>
            )}
          />
        </div>
      )}
    </Layout>
  )
}
