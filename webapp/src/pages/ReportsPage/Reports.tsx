import { Button, Form, Input, InputNumber, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import layoutStyles from '../../components/Layout/Layout.module.less'
import styles from './styles/Reports.module.less'

type Report = {
  object: string
  actNumber: string
  totalCost: number
}

export const ReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([])

  const [form] = Form.useForm<Report>()

  const onAdd = (values: Report) => {
    setReports([...reports, values])
    form.resetFields()
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  const generateActHtml = (r: Report) => {
    return `
      <div style="page-break-after: always; font-family: Arial, sans-serif; font-size: 14px;">
        <h2 style="text-align: center;">Акт № ${r.actNumber}</h2>
        <p style="text-align: center;">сдачи-приемки выполненных работ</p>
        <p style="text-align: center;">по договору №17/02/24 от "17" февраля 2024 г.</p>
        <p style="text-align: right;">г. Санкт-Петербург « 31 » май 2025 г.</p>
        <p>ООО «X», именуемое в дальнейшем «Заказчик», и ИП X, именуемое в дальнейшем «Подрядчик», составили настоящий акт о том, что Исполнитель выполнил, а Заказчик принял следующие работы:</p>
        <p>Монтаж систем разделов ОВ и ВК, на объекте: ${r.object}</p>
        <p>Всего выполнено работ на сумму: ${formatCurrency(r.totalCost)} руб.</p>
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
          <Form form={form} layout="inline" onFinish={onAdd} className={styles.form}>
            <Form.Item name="object" rules={[{ required: true, message: 'Объект' }]}>
              <Input placeholder="Объект" />
            </Form.Item>
            <Form.Item name="actNumber" rules={[{ required: true, message: 'Номер акта' }]}>
              <Input placeholder="Номер акта" />
            </Form.Item>
            <Form.Item name="totalCost" rules={[{ required: true, message: 'Стоимость' }]}>
              <InputNumber min={0} placeholder="Стоимость" />
            </Form.Item>
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
