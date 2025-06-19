import { Button, Input, Space, Table, Tag, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import { getEditMaterialRoute, getNewMaterialsRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import styles from './styles/Materials.module.less'

export const MaterialsPage = () => {
  const { data: materials, refetch } = trpc.materials.list.useQuery()
  const deleteMutation = trpc.materials.delete.useMutation({
    onSuccess: () => refetch(),
  })
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState<string[]>([])

  const tagOptions = useMemo(() => {
    if (!materials) {
      return []
    }
    const unique = Array.from(new Set(materials.flatMap((m) => m.tags)))
    return unique.map((t) => ({ label: t, value: t }))
  }, [materials])

  const filtered = useMemo(() => {
    if (!materials) {
      return []
    }
    return materials.filter((m) => {
      const matchName = m.name.toLowerCase().includes(search.toLowerCase())
      const matchTags = tagFilter.length > 0 ? tagFilter.every((t) => m.tags.includes(t)) : true
      return matchName && matchTags
    })
  }, [materials, search, tagFilter])

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
      <div className={styles.container}>
        <h1 className="pageTitle">Материалы</h1>
        <div className={styles.header}>
          <Input.Search
            className={styles.search}
            placeholder="Поиск"
            allowClear
            onSearch={setSearch}
            onChange={(e) => setSearch(e.target.value)}
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

export default MaterialsPage
