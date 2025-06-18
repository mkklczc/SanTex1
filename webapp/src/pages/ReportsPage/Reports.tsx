import { Button, Form, Input, InputNumber, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import styles from './styles/Reports.module.less'

type Report = {
  object: string
  actNumber: string
  baseCost: number
  overhead: number
  total: number
  totalWithHoldback: number
  guaranteeHoldback: number
  advanceOffset: number
  guaranteeReturn: number
  totalWithoutVat: number
  payable: number
  payableCash: number
}

type ReportFormInput = {
  object: string
  actNumber: string
  baseCost: number
}

export const ReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [form] = Form.useForm<ReportFormInput>()

  const onAdd = (values: ReportFormInput) => {
    const base = values.baseCost
    const overhead = base * 0.08
    const total = base + overhead
    const guaranteeHoldback = -total * 0.1
    const totalWithHoldback = total + guaranteeHoldback
    const advanceOffset = 0
    const guaranteeReturn = 0
    const totalWithoutVat = totalWithHoldback + guaranteeReturn - advanceOffset
    const payable = totalWithoutVat
    const payableCash = payable

    const newReport: Report = {
      object: values.object,
      actNumber: values.actNumber,
      baseCost: base,
      overhead,
      total,
      totalWithHoldback,
      guaranteeHoldback,
      advanceOffset,
      guaranteeReturn,
      totalWithoutVat,
      payable,
      payableCash,
    }

    setReports([...reports, newReport])
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
        <p>ООО «МАРИГ Строй», именуемое в дальнейшем «Заказчик», и ИП Рутковский Михаил Георгиевич, именуемое в дальнейшем «Подрядчик», составили настоящий акт о том, что Исполнитель выполнил, а Заказчик принял следующие работы:</p>
        <p>Монтаж систем разделов ОВ и ВК, на объекте: ${r.object}</p>
        <p>Всего выполнено работ на сумму: ${formatCurrency(r.total)} руб.</p>
      </div>
    `
  }

  const exportToExcel = () => {
    const header =
      'Объект,Номер акта,Базовая стоимость,Накладные расходы,Всего,Всего с удержанием,Гарантийное удержание,Зачет аванса,Возврат гарантийного удержания,Итого без НДС,К выплате,К выплате наличными\n'
    const rows = reports
      .map(
        (r) =>
          `${r.object},${r.actNumber},${r.baseCost},${r.overhead},${r.total},${r.totalWithHoldback},${r.guaranteeHoldback},${r.advanceOffset},${r.guaranteeReturn},${r.totalWithoutVat},${r.payable},${r.payableCash}`
      )
      .join('\n')
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
      title: 'Базовая стоимость',
      dataIndex: 'baseCost',
      key: 'baseCost',
      render: (v: number) => formatCurrency(v),
    },
    {
      title: 'Накладные расходы',
      dataIndex: 'overhead',
      key: 'overhead',
      render: (v: number) => formatCurrency(v),
    },
    { title: 'ВСЕГО', dataIndex: 'total', key: 'total', render: (v) => formatCurrency(v) },
    {
      title: 'Всего с удержанием',
      dataIndex: 'totalWithHoldback',
      key: 'totalWithHoldback',
      render: (v) => formatCurrency(v),
    },
    {
      title: 'Гарантийное удержание',
      dataIndex: 'guaranteeHoldback',
      key: 'guaranteeHoldback',
      render: (v) => formatCurrency(v),
    },
    {
      title: 'Зачет аванса',
      dataIndex: 'advanceOffset',
      key: 'advanceOffset',
      render: (v) => formatCurrency(v),
    },
    {
      title: 'Возврат гарантийного удержания',
      dataIndex: 'guaranteeReturn',
      key: 'guaranteeReturn',
      render: (v) => formatCurrency(v),
    },
    {
      title: 'Итого (без НДС)',
      dataIndex: 'totalWithoutVat',
      key: 'totalWithoutVat',
      render: (v) => formatCurrency(v),
    },
    { title: 'К выплате', dataIndex: 'payable', key: 'payable', render: (v) => formatCurrency(v) },
    {
      title: 'К выплате (наличными)',
      dataIndex: 'payableCash',
      key: 'payableCash',
      render: (v) => formatCurrency(v),
    },
  ]

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <Form form={form} layout="inline" onFinish={onAdd} className={styles.form}>
            <Form.Item name="object" rules={[{ required: true, message: 'Объект' }]}>
              <Input placeholder="Объект" />
            </Form.Item>
            <Form.Item name="actNumber" rules={[{ required: true, message: 'Номер акта' }]}>
              <Input placeholder="Номер акта" />
            </Form.Item>
            <Form.Item
              name="baseCost"
              rules={[{ required: true, type: 'number', message: 'Стоимость должна быть числом' }]}
            >
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
            pagination={{ pageSize: 10 }}
          />
        </div>
      </div>
    </Layout>
  )
}

export default ReportsPage
