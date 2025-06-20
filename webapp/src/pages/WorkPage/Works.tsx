import { Button, Input, Table, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import { getNewWorkRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import styles from './styles/Works.module.less'

export const WorksPage = () => {
  const { data: works, refetch } = trpc.works.list.useQuery()
  const deleteMutation = trpc.works.delete.useMutation({ onSuccess: () => refetch() })

  const [search, setSearch] = useState('')
  const [objectFilter, setObjectFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const objectOptions = useMemo(() => {
    if (!works) {
      return []
    }
    const unique = Array.from(
      new Set(works.map((w: { constructionObject: { name: string } }) => w.constructionObject.name))
    )
    return unique.map((name) => ({ label: name, value: name }))
  }, [works])

  const statusOptions = useMemo(() => {
    if (!works) {
      return []
    }
    const unique = Array.from(new Set(works.map((w: { status: string }) => w.status)))
    return unique.map((s) => ({ label: s, value: s }))
  }, [works])

  const filtered = useMemo(() => {
    if (!works) {
      return []
    }
    return works.filter((w) => {
      const matchSearch = w.description.toLowerCase().includes(search.toLowerCase())
      const matchObject = objectFilter ? w.constructionObject.name === objectFilter : true
      const matchStatus = statusFilter ? w.status === statusFilter : true
      return matchSearch && matchObject && matchStatus
    })
  }, [works, search, objectFilter, statusFilter])

  const columns: ColumnsType<(typeof filtered)[number]> = [
    { title: 'Описание', dataIndex: 'description', key: 'description' },
    {
      title: 'Объект',
      dataIndex: ['constructionObject', 'name'],
      key: 'object',
    },
    { title: 'Статус', dataIndex: 'status', key: 'status' },
    {
      title: 'Начало',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: 'Конец',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Button danger size="small" onClick={() => deleteMutation.mutate({ id: record.id })}>
          Удалить
        </Button>
      ),
    },
  ]

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className="pageTitle">Работы</h1>
        <div className={styles.header}>
          <Input.Search
            className={styles.search}
            placeholder="Поиск"
            allowClear
            onSearch={setSearch}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
          <Select
            allowClear
            placeholder="Объект"
            options={objectOptions}
            style={{ width: 150, marginRight: 8 }}
            onChange={(v: string | null) => setObjectFilter(v || null)}
          />
          <Select
            allowClear
            placeholder="Статус"
            options={statusOptions}
            style={{ width: 150, marginRight: 8 }}
            onChange={(v: string | null) => setStatusFilter(v || null)}
          />
          <Link to={getNewWorkRoute()}>
            <Button type="primary">Добавить работу</Button>
          </Link>
        </div>
        <div className={styles.table}>
          <Table rowKey="id" columns={columns} dataSource={filtered} />
        </div>
      </div>
    </Layout>
  )
}

export default WorksPage
