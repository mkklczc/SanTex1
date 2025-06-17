import { Button, Input, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import layoutStyles from '../../components/Layout/Layout.module.less'
import { getEditMaterialRoute, getNewMaterialsRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import styles from './styles/Materials.module.less'

export const AllMaterialsPage = () => {
  const { data: materials, refetch } = trpc.materials.list.useQuery()
  const deleteMutation = trpc.materials.delete.useMutation({
    onSuccess: () => refetch(),
  })
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!materials) {
      return []
    }
    return materials.filter((m: { name: string }) => m.name.toLowerCase().includes(search.toLowerCase()))
  }, [materials, search])

  const columns: ColumnsType<(typeof filtered)[number]> = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    { title: 'Тип', dataIndex: 'type', key: 'type' },
    { title: 'Производитель', dataIndex: 'manufacturer', key: 'manufacturer' },
    { title: 'Ед.', dataIndex: 'unit', key: 'unit', width: 80 },
    { title: 'Цена', dataIndex: 'unitPrice', key: 'unitPrice', width: 100 },
    {
      title: 'Тэги',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (
        <>
          {tags.map((t: string) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Link to={getEditMaterialRoute({ materialId: record.id })}>Редактировать</Link>
          <Button danger size="small" onClick={() => deleteMutation.mutate({ id: record.id })}>
            Удалить
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Layout>
      <h1 className={layoutStyles.titletwo}>Материалы</h1>
      <div className={styles.container}>
        <div className={styles.header}>
          <Input.Search
            className={styles.search}
            placeholder="Поиск"
            allowClear
            onSearch={setSearch}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link to={getNewMaterialsRoute()}>
            <Button type="primary">Добавить материал</Button>
          </Link>
        </div>
        <div className={styles.table}>
          <Table rowKey="id" columns={columns} dataSource={filtered} />
        </div>
      </div>
    </Layout>
  )
}

export default AllMaterialsPage
