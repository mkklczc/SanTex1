import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputNumber, Table, Select, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import layoutStyles from '../../components/Layout/Layout.module.less'
import { numberToWordsRu } from '../../lib/numberToWordsRu'
import { trpc } from '../../lib/trpc'
import styles from './styles/Reports.module.less'

type ReportMaterial = {
  id: string
  name: string
  unit: string
  unitPrice: number
  quantity: number
}

type ReportWork = {
  id: string
  description: string
  cost: number
}

type Report = {
  object: string
  actNumber: string
  materials: ReportMaterial[]
  works: ReportWork[]
  totalCost: number
}

type ReportFormValues = {
  object: string
  actNumber: string
  materials: { materialId: string; quantity: number }[]
  works: { workId: string; cost: number }[]
}

export const ReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([])

  const [form] = Form.useForm<ReportFormValues>()

  const materialsQuery = trpc.materials.list.useQuery()
  const worksQuery = trpc.works.list.useQuery()

  const materialOptions = useMemo(
    () => materialsQuery.data?.map((m) => ({ label: m.name, value: m.id })) || [],
    [materialsQuery.data]
  )

  const workOptions = useMemo(
    () => worksQuery.data?.map((w) => ({ label: w.description, value: w.id })) || [],
    [worksQuery.data]
  )

  const onAdd = (values: ReportFormValues) => {
    const selectedMaterials: ReportMaterial[] = values.materials.map((m) => {
      const material = materialsQuery.data?.find((mat) => mat.id === m.materialId)
      return {
        id: m.materialId,
        name: material?.name || '',
        unit: material?.unit || '',
        unitPrice: material?.unitPrice || 0,
        quantity: m.quantity,
      }
    })

    const selectedWorks: ReportWork[] = values.works.map((w) => {
      const work = worksQuery.data?.find((wk) => wk.id === w.workId)
      return {
        id: w.workId,
        description: work?.description || '',
        cost: w.cost,
      }
    })

    const materialsCost = selectedMaterials.reduce((sum, m) => sum + m.unitPrice * m.quantity, 0)
    const worksCost = selectedWorks.reduce((sum, w) => sum + w.cost, 0)
    const totalCost = materialsCost + worksCost

    const report: Report = {
      object: values.object,
      actNumber: values.actNumber,
      materials: selectedMaterials,
      works: selectedWorks,
      totalCost,
    }

    setReports([...reports, report])
    form.resetFields()
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  const generateActHtml = (r: Report) => {
    const materialRows = r.materials
      .map(
        (m) =>
          `<tr><td>${m.name}</td><td>${m.quantity} ${m.unit}</td><td>${formatCurrency(
            m.unitPrice
          )}</td><td>${formatCurrency(m.unitPrice * m.quantity)}</td></tr>`
      )
      .join('')

    const workRows = r.works
      .map((w) => `<tr><td>${w.description}</td><td></td><td></td><td>${formatCurrency(w.cost)}</td></tr>`)
      .join('')

    const table = `<table style="width:100%; border-collapse: collapse;" border="1"><thead><tr><th>Наименование</th><th>Кол-во</th><th>Цена</th><th>Стоимость</th></tr></thead><tbody>${materialRows}${workRows}</tbody></table>`

    return `
      <div style="page-break-after: always; font-family: Arial, sans-serif; font-size: 14px;">
        <h2 style="text-align: center;">Акт № ${r.actNumber}</h2>
        <p style="text-align: center;">сдачи-приемки выполненных работ</p>
        <p style="text-align: center;">по договору №17/02/24 от "17" февраля 2024 г.</p>
        <p style="text-align: right;">г. Санкт-Петербург « 31 » май 2025 г.</p>
        <p>ООО «X», именуемое в дальнейшем «Заказчик», и ИП X, именуемое в дальнейшем «Подрядчик», составили настоящий акт о том, что Исполнитель выполнил, а Заказчик принял следующие работы:</p>
        <p>Монтаж систем разделов ОВ и ВК, на объекте: ${r.object}</p>
         ${table}
        <p>Всего выполнено работ на сумму: ${formatCurrency(r.totalCost)} руб.</p>
        <p>${numberToWordsRu(r.totalCost)}</p>
        <p>Работа выполнена в установленные сроки и с надлежащим качеством. Стороны претензий друг к другу не имеют.</p>
        <p style="display:flex; justify-content: space-between; margin-top:40px;">
          <span>Заказчик: _____________</span>
          <span>Подрядчик: _____________</span>
        </p>
      </div>
    `
  }

  const exportToExcel = () => {
    const header = 'Объект,Номер акта,Общая стоимость\n'
    const rows = reports.map((r) => `${r.object},${r.actNumber},${r.totalCost}`).join('\n')
    const csv = header + rows
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'reports.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPdf = () => {
    const printWindow = window.open('', '', 'height=842,width=595')
    if (!printWindow) {
      return
    }
    const html = reports.map((r) => generateActHtml(r)).join('')
    printWindow.document.write(`<html><head><title>Reports</title></head><body>${html}</body></html>`)
    printWindow.document.close()
    printWindow.print()
  }

  const columns: ColumnsType<Report> = [
    { title: 'Объект', dataIndex: 'object', key: 'object' },
    { title: 'Номер акта', dataIndex: 'actNumber', key: 'actNumber' },
    {
      title: 'Общая стоимость',
      dataIndex: 'totalCost',
      key: 'totalCost',
      render: (value: number) => value.toLocaleString('ru-RU'),
    },
  ]

  return (
    <Layout>
      <h1 className={layoutStyles.titletwo}>Отчёты</h1>
      <div className={styles.container}>
        <div className={styles.header}>
          <Form form={form} layout="vertical" onFinish={onAdd} className={styles.form}>
            <Space wrap>
              <Form.Item name="object" rules={[{ required: true, message: 'Объект' }]}>
                <Input placeholder="Объект" />
              </Form.Item>
              <Form.Item name="actNumber" rules={[{ required: true, message: 'Номер акта' }]}>
                <Input placeholder="Номер акта" />
              </Form.Item>
            </Space>
            <Form.List name="materials">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item {...restField} name={[name, 'materialId']} rules={[{ required: true }]}>
                        <Select placeholder="Материал" options={materialOptions} style={{ width: 200 }} />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'quantity']} rules={[{ required: true }]}>
                        <InputNumber min={0} placeholder="Кол-во" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                      Добавить материал
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.List name="works">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item {...restField} name={[name, 'workId']} rules={[{ required: true }]}>
                        <Select placeholder="Работа" options={workOptions} style={{ width: 200 }} />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'cost']} rules={[{ required: true }]}>
                        <InputNumber min={0} placeholder="Стоимость" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                      Добавить работу
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Добавить
              </Button>
            </Form.Item>
          </Form>
          <div className={styles.actions}>
            <Button onClick={exportToExcel}>Экспорт в Excel</Button>
            <Button onClick={exportToPdf}>Экспорт в PDF</Button>
          </div>
        </div>
        <div className={styles.table}>
          <Table
            id="reports-table"
            rowKey={(r) => `${r.object}-${r.actNumber}`}
            columns={columns}
            dataSource={reports}
            pagination={false}
          />
        </div>
      </div>
    </Layout>
  )
}

export default ReportsPage
