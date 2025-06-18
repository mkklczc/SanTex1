import { Button, Card, Input } from 'antd'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import layoutStyles from '../../components/Layout/Layout.module.less'
import { getEditObjectRoute, getNewObjectRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import styles from './styles/Objects.module.less'

export const ObjectsPage = () => {
  const { data: objects, refetch } = trpc.objects.list.useQuery()
  const archiveMutation = trpc.objects.archive.useMutation({ onSuccess: () => refetch() })
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!objects) {
      return []
    }
    return objects.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()))
  }, [objects, search])

  return (
    <Layout>
      <h1 className={layoutStyles.titletwo}>Объекты</h1>
      <div className={styles.container}>
        <div className={styles.header}>
          <Input.Search
            className={styles.search}
            placeholder="Поиск"
            allowClear
            onSearch={setSearch}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link to={getNewObjectRoute()}>
            <Button type="primary">Добавить объект</Button>
          </Link>
        </div>
        <div className={styles.cardGrid}>
          {filtered.map((o) => (
            <Card
              key={o.id}
              className={styles.card}
              title={o.name}
              extra={<Link to={getEditObjectRoute({ objectId: o.id })}>Редактировать</Link>}
              actions={[
                <Button danger size="small" onClick={() => archiveMutation.mutate({ id: o.id })} key="archive">
                  Архивировать
                </Button>,
              ]}
            >
              <p>Адрес: {o.location}</p>
              <p>Прораб: {o.foreman}</p>
              <p>Статус: {o.status}</p>
              <p>Начало: {new Date(o.startDate).toLocaleDateString()}</p>
              <p>Конец: {new Date(o.endDate).toLocaleDateString()}</p>
              <div className={styles.mapWrapper}>
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(o.location)}&output=embed`}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default ObjectsPage
