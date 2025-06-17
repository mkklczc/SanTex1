import { Card, List, Statistic } from 'antd'
import dayjs from 'dayjs'
import Iconka from '../../assets/Iconka.svg?react'
import Layout from '../../components/Layout/Layout'
import layoutStyles from '../../components/Layout/Layout.module.less'
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
      <h1 className={layoutStyles.titletwo}>Учет ресурсов и управления производственными процессами компании</h1>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Iconka />
        </div>
        <div className={styles.date}>{currentDate}</div>
      </div>

      <div className={styles.dashboard}>
        <Card className={styles.card}>
          <Statistic title="Всего объектов" value={data.objectsCount} />
        </Card>
        <Card className={styles.card}>
          <Statistic title="Всего материалов" value={data.materialsCount} />
        </Card>
        <Card className={styles.card}>
          <Statistic title="Работы сегодня" value={data.worksTodayCount} />
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

export default HelloPage
