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
    const printWindow = window.open('', '', 'height=600,width=800')
    if (!printWindow) {
      return
    }
    const tableHtml = document.getElementById('reports-table')?.outerHTML || ''
    printWindow.document.write(`<html><head><title>Reports</title></head><body>${tableHtml}</body></html>`)
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
