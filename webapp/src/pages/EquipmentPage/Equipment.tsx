import { Button, Input, Space, Table, Tag, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
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
  const [tagFilter, setTagFilter] = useState<string[]>([])

  const statusOptions = useMemo(() => {
    if (!equipment) {
      return []
    }
    const unique = Array.from(new Set(equipment.map((e: { status: string }) => e.status)))
    return unique.map((s) => ({ label: s, value: s }))
  }, [equipment])

  const tagOptions = useMemo(() => {
    if (!equipment) {
      return []
    }
    const unique = Array.from(new Set(equipment.flatMap((e: { tags: string[] }) => e.tags)))
    return unique.map((t) => ({ label: t, value: t }))
  }, [equipment])

  const filtered = useMemo(() => {
    if (!equipment) {
      return []
    }
    return equipment.filter((e: { name: string; status: string; tags: string[] }) => {
      const matchName = e.name.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter ? e.status === statusFilter : true
      const matchTags = tagFilter.length > 0 ? tagFilter.every((t) => e.tags.includes(t)) : true
      return matchName && matchStatus && matchTags
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
          <Button danger size="small" onClick={() => deleteMutation.mutate({ id: record.id })}>
            Удалить
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className="pageTitle">Оборудование</h1>
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
            onChange={(v: string | null) => setStatusFilter(v || null)}
          />
          <Select
            mode="multiple"
            allowClear
            placeholder="Тэги"
            options={tagOptions}
            style={{ minWidth: 200, marginRight: 8 }}
            value={tagFilter}
            onChange={(v) => setTagFilter(v)}
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
