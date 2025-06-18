import { Button, Input, Space, Table, Tag, Select, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import layoutStyles from '../../components/Layout/Layout.module.less'
import { getEditEquipmentRoute, getNewEquipmentRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import styles from './styles/Equipment.module.less'

export const AllEquipmentPage = () => {
  const { data: equipment, refetch } = trpc.equipment.list.useQuery()
  const deleteMutation = trpc.equipment.delete.useMutation({
    onSuccess: () => refetch(),
  })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [tagFilter, setTagFilter] = useState<string | null>(null)

  const statusOptions = useMemo(() => {
    if (!equipment) {
      return []
    }
    const unique = Array.from(new Set(equipment.map((e) => e.status)))
    return unique.map((s) => ({ label: s, value: s }))
  }, [equipment])

  const tagOptions = useMemo(() => {
    if (!equipment) {
      return []
    }
    const unique = Array.from(new Set(equipment.flatMap((e) => e.tags ?? [])))
    return unique.map((t) => ({ label: t, value: t }))
  }, [equipment])

  const filtered = useMemo(() => {
    if (!equipment) {
      return []
    }
    return equipment.filter((e: { name: string; status: string; tags?: string[] }) => {
      const matchName = e.name.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter ? e.status === statusFilter : true
      const matchTag = tagFilter ? e.tags?.includes(tagFilter) : true
      return matchName && matchStatus && matchTag
    })
  }, [equipment, search, statusFilter, tagFilter])

  const columns: ColumnsType<(typeof filtered)[number]> = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    { title: 'Тип', dataIndex: 'type', key: 'type' },
    { title: 'Производитель', dataIndex: 'manufacturer', key: 'manufacturer' },
    { title: 'Ед.', dataIndex: 'unit', key: 'unit', width: 80 },
    { title: 'Цена', dataIndex: 'unitPrice', key: 'unitPrice', width: 100 },
    { title: 'Количество', dataIndex: 'quantity', key: 'quantity', width: 100 },
    { title: 'Статус', dataIndex: 'status', key: 'status', width: 100 },
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
          <Link to={getEditEquipmentRoute({ equipmentId: record.id })}>Редактировать</Link>
          <Button
            danger
            size="small"
            onClick={() =>
              Modal.confirm({
                title: `Удалить оборудование ${record.name}?`,
                okText: 'Да',
                cancelText: 'Нет',
                onOk: () => deleteMutation.mutate({ id: record.id }),
              })
            }
          >
            Удалить
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Layout>
      <h1 className={layoutStyles.titletwo}>Оборудование</h1>
      <div className={styles.container}>
        <div className={styles.header}>
          <Input.Search
            className={styles.search}
            placeholder="Поиск"
            allowClear
            onSearch={setSearch}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            allowClear
            placeholder="Статус"
            options={statusOptions}
            style={{ width: 150, marginRight: 8 }}
            onChange={(v) => setStatusFilter(v || null)}
          />
          <Select
            allowClear
            placeholder="Тег"
            options={tagOptions}
            style={{ width: 150, marginRight: 8 }}
            onChange={(v) => setTagFilter(v || null)}
          />
          <Link to={getNewEquipmentRoute()}>
            <Button type="primary">Добавить оборудование</Button>
          </Link>
        </div>
        <div className={styles.table}>
          <Table rowKey="id" columns={columns} dataSource={filtered} />
        </div>
      </div>
    </Layout>
  )
}

export default AllEquipmentPage
