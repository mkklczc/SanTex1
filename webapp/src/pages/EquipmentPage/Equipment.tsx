import { Button, Input, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import { getEditEquipmentRoute, getNewEquipmentRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const AllEquipmentPage = () => {
  const { data: equipment, refetch } = trpc.equipment.list.useQuery()
  const deleteMutation = trpc.equipment.delete.useMutation({
    onSuccess: () => refetch(),
  })
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!equipment) {
      return []
    }
    return equipment.filter((e: { name: string }) => e.name.toLowerCase().includes(search.toLowerCase()))
  }, [equipment, search])

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
      <Space style={{ marginBottom: 16 }}>
        <Input.Search placeholder="Поиск" allowClear onSearch={setSearch} onChange={(e) => setSearch(e.target.value)} />
        <Link to={getNewEquipmentRoute()}>
          <Button type="primary">Добавить оборудование</Button>
        </Link>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={filtered} />
    </Layout>
  )
}

export default AllEquipmentPage
