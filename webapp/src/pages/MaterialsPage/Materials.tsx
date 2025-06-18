import { Button, Input, Space, Table, Tag, Select, Modal, notification } from 'antd'
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
  const [tagFilter, setTagFilter] = useState<string | null>(null)

  const tagOptions = useMemo(() => {
    if (!materials) {
      return []
    }
    const unique = Array.from(new Set(materials.flatMap((m) => m.tags ?? [])))
    return unique.map((t) => ({ label: t, value: t }))
  }, [materials])

  const filtered = useMemo(() => {
    if (!materials) {
      return []
    }
    return materials.filter((m: { name: string; tags?: string[] }) => {
      const matchName = m.name.toLowerCase().includes(search.toLowerCase())
      const matchTag = tagFilter ? m.tags?.includes(tagFilter) : true
      return matchName && matchTag
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
          <Button
            danger
            size="small"
            onClick={() =>
              Modal.confirm({
                title: `Удалить материал "${record.name}"?`,
                content: `Вы уверены, что хотите удалить материал "${record.name}"? Это действие нельзя будет отменить.`,
                okText: 'Да',
                cancelText: 'Нет',
                onOk: () => {
                  deleteMutation.mutate({ id: record.id })
                  notification.success({
                    message: `Материал "${record.name}" удалён.`,
                    description: 'Материал успешно удалён из списка.',
                  })
                },
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
    <Layout withBackground>
      <h1 className={`${layoutStyles.titletwo} ${layoutStyles.overlayTitle}`.trim()}>Материалы</h1>
      <div className={styles.container}>
        <div className={styles.header}>
          <Input.Search
            className={styles.search}
            placeholder="Поиск"
            allowClear
            enterButton
            onSearch={setSearch}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            allowClear
            placeholder="Тег"
            options={tagOptions}
            style={{ width: 150, marginRight: 8 }}
            onChange={(v) => setTagFilter(v || null)}
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
