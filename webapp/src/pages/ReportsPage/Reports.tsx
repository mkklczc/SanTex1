import { Button, Form, Input, InputNumber, Select, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { trpc } from '../../lib/trpc'
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
  materials: MaterialItem[]
  works: WorkItem[]
}

type ReportFormInput = {
  object: string
  actNumber: string
}

type MaterialItem = {
  key: string
  name: string
  quantity: number
  price: number
  cost: number
}

type WorkItem = {
  key: string
  name: string
  cost: number
}

export const ReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [materials, setMaterials] = useState<MaterialItem[]>([])
  const [works, setWorks] = useState<WorkItem[]>([])
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null)
  const [materialQty, setMaterialQty] = useState<number>(0)
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null)
  const [workCost, setWorkCost] = useState<number>(0)
  const [form] = Form.useForm<ReportFormInput>()

  const materialsQuery = trpc.materials.list.useQuery()
  const worksQuery = trpc.works.list.useQuery()

  const onAdd = (values: ReportFormInput) => {
    const materialsSum = materials.reduce((sum, m) => sum + m.cost, 0)
    const worksSum = works.reduce((sum, w) => sum + w.cost, 0)
    const base = materialsSum + worksSum
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
      materials,
      works,
    }

    setReports([...reports, newReport])
    form.resetFields()
    setMaterials([])
    setWorks([])
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  const decl = (n: number, titles: [string, string, string]) => {
    if (n % 100 > 10 && n % 100 < 20) {
      return titles[2]
    }
    if (n % 10 === 1) {
      return titles[0]
    }
    if (n % 10 >= 2 && n % 10 <= 4) {
      return titles[1]
    }
    return titles[2]
  }

  const toWords = (amount: number) => {
    const units = [
      ['ноль'],
      ['один', 'одна'],
      ['два', 'две'],
      ['три'],
      ['четыре'],
      ['пять'],
      ['шесть'],
      ['семь'],
      ['восемь'],
      ['девять'],
    ]
    const teens = [
      'десять',
      'одиннадцать',
      'двенадцать',
      'тринадцать',
      'четырнадцать',
      'пятнадцать',
      'шестнадцать',
      'семнадцать',
      'восемнадцать',
      'девятнадцать',
    ]
    const tens = [
      '',
      'десять',
      'двадцать',
      'тридцать',
      'сорок',
      'пятьдесят',
      'шестьдесят',
      'семьдесят',
      'восемьдесят',
      'девяносто',
    ]
    const hundreds = [
      '',
      'сто',
      'двести',
      'триста',
      'четыреста',
      'пятьсот',
      'шестьсот',
      'семьсот',
      'восемьсот',
      'девятьсот',
    ]
    const thousands: [string, string, string][] = [
      ['рубль', 'рубля', 'рублей'],
      ['тысяча', 'тысячи', 'тысяч'],
      ['миллион', 'миллиона', 'миллионов'],
    ]

    const words: string[] = []
    let n = Math.floor(amount)
    let i = 0
    while (n > 0 || i === 0) {
      const num = n % 1000
      if (num !== 0) {
        const h = Math.floor(num / 100)
        const t = Math.floor((num % 100) / 10)
        const u = num % 10
        const parts: string[] = []
        if (hundreds[h]) {
          parts.push(hundreds[h])
        }
        if (t > 1) {
          parts.push(tens[t])
          if (u > 0) {
            parts.push(i === 1 && u <= 2 ? units[u][1] : units[u][0])
          }
        } else if (t === 1) {
          parts.push(teens[u])
        } else if (u > 0) {
          parts.push(i === 1 && u <= 2 ? units[u][1] : units[u][0])
        }
        parts.push(decl(num, thousands[i]))
        words.unshift(parts.join(' '))
      }
      n = Math.floor(n / 1000)
      i += 1
    }

    const frac = Math.round((amount % 1) * 100)
    const result =
      words.join(' ').trim() + ` ${frac.toString().padStart(2, '0')} ` + decl(frac, ['копейка', 'копейки', 'копеек'])
    return result.charAt(0).toUpperCase() + result.slice(1)
  }

  const generateActHtml = (r: Report) => {
    const materialsRows = r.materials
      .map(
        (m, idx) =>
          `<tr><td>${idx + 1}</td><td>${m.name}</td><td></td><td>шт.</td><td>${m.quantity}</td><td>${formatCurrency(m.price)}</td><td>${formatCurrency(m.cost)}</td></tr>`
      )
      .join('')
    const worksRows = r.works
      .map(
        (w, idx) =>
          `<tr><td>${idx + 1}</td><td>${w.name}</td><td></td><td></td><td></td><td></td><td>${formatCurrency(w.cost)}</td></tr>`
      )
      .join('')
    return `
      <div style="page-break-after: always; font-family: Arial, sans-serif; font-size: 14px;">
        <h2 style="text-align: center;">Акт № ${r.actNumber}</h2>
        <p style="text-align: center;">сдачи-приемки выполненных работ</p>
        <p style="text-align: center;">по договору №17/02/24 от "17" февраля 2024 г.</p>
        <p style="text-align: right;">г. Санкт-Петербург « 31 » май 2025 г.</p>
        <p>ООО «МАРИГ Строй», именуемое в дальнейшем «Заказчик», и ИП Рутковский Михаил Георгиевич, именуемое в дальнейшем «Подрядчик», составили настоящий акт о том, что Исполнитель выполнил, а Заказчик принял следующие работы:</p>
        <p>Монтаж систем разделов ОВ и ВК, на объекте: ${r.object}</p>
        <table border="1" cellspacing="0" cellpadding="4" style="border-collapse: collapse; width: 100%; margin-top: 8px;">
          <tr>
            <th>№ п/п</th><th>Наименование</th><th>Тип</th><th>Ед. изм.</th><th>Кол-во</th><th>Цена</th><th>Сумма</th>
          </tr>
          ${materialsRows}
          ${worksRows}
          <tr><td colspan="6" style="text-align:right;">Итого:</td><td>${formatCurrency(r.baseCost)}</td></tr>
          <tr><td colspan="6" style="text-align:right;">Накладные расходы:</td><td>${formatCurrency(r.overhead)}</td></tr>
          <tr><td colspan="6" style="text-align:right;">ВСЕГО:</td><td>${formatCurrency(r.total)}</td></tr>
          <tr><td colspan="6" style="text-align:right;">Всего (с 10% удержаний):</td><td>${formatCurrency(r.totalWithHoldback)}</td></tr>
          <tr><td colspan="6" style="text-align:right;">Гарантийное удержание:</td><td>${formatCurrency(r.guaranteeHoldback)}</td></tr>
          <tr><td colspan="6" style="text-align:right;">Зачет аванса:</td><td>${formatCurrency(r.advanceOffset)}</td></tr>
          <tr><td colspan="6" style="text-align:right;">Возврат гарантийного удержания:</td><td>${formatCurrency(r.guaranteeReturn)}</td></tr>
          <tr><td colspan="6" style="text-align:right;">Итого (без НДС):</td><td>${formatCurrency(r.totalWithoutVat)}</td></tr>
          <tr><td colspan="6" style="text-align:right;">ВСЕГО к выплате:</td><td>${formatCurrency(r.payable)}</td></tr>
        </table>
        <p style="margin-top:8px;">Всего выполнено работ на сумму: ${formatCurrency(r.totalWithoutVat)} руб.</p>
        <p>${toWords(r.totalWithoutVat)}</p>
        <p>Работа выполнена в установленные сроки и с надлежащим качеством. Стороны претензий друг к другу не имеют.</p>
        <p style="margin-top:40px;">Заказчик: _____________ Подрядчик: _____________</p>
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
        <div className={styles.section}>
          <h3>Материалы</h3>
          <Space style={{ marginBottom: 8 }}>
            <Select
              placeholder="Название"
              style={{ minWidth: 200 }}
              options={materialsQuery.data?.map((m) => ({ label: m.name, value: m.id }))}
              value={selectedMaterialId || undefined}
              onChange={(v) => setSelectedMaterialId(v)}
            />
            <InputNumber placeholder="Кол-во" min={0} value={materialQty} onChange={(v) => setMaterialQty(Number(v))} />
            <InputNumber
              placeholder="Цена"
              disabled
              value={materialsQuery.data?.find((m) => m.id === selectedMaterialId)?.unitPrice}
            />
            <Button
              onClick={() => {
                const mat = materialsQuery.data?.find((m) => m.id === selectedMaterialId)
                if (!mat || materialQty <= 0) {
                  return
                }
                const price = mat.unitPrice
                const cost = materialQty * price
                setMaterials([
                  ...materials,
                  { key: `${Date.now()}`, name: mat.name, quantity: materialQty, price, cost },
                ])
                setSelectedMaterialId(null)
                setMaterialQty(0)
              }}
            >
              Добавить
            </Button>
          </Space>
          <Table
            size="small"
            rowKey="key"
            dataSource={materials}
            pagination={false}
            columns={[
              { title: 'Название', dataIndex: 'name' },
              { title: 'Кол-во', dataIndex: 'quantity' },
              { title: 'Цена', dataIndex: 'price', render: formatCurrency },
              { title: 'Стоимость', dataIndex: 'cost', render: formatCurrency },
            ]}
          />
        </div>
        <div className={styles.section}>
          <h3>Работы</h3>
          <Space style={{ marginBottom: 8 }}>
            <Select
              placeholder="Название"
              style={{ minWidth: 200 }}
              options={worksQuery.data?.map((w) => ({ label: w.description, value: w.id }))}
              value={selectedWorkId || undefined}
              onChange={(v) => setSelectedWorkId(v)}
            />
            <InputNumber placeholder="Стоимость" min={0} value={workCost} onChange={(v) => setWorkCost(Number(v))} />
            <Button
              onClick={() => {
                const work = worksQuery.data?.find((w) => w.id === selectedWorkId)
                if (!work || workCost <= 0) {
                  return
                }
                setWorks([...works, { key: `${Date.now()}`, name: work.description, cost: workCost }])
                setSelectedWorkId(null)
                setWorkCost(0)
              }}
            >
              Добавить
            </Button>
          </Space>
          <Table
            size="small"
            rowKey="key"
            dataSource={works}
            pagination={false}
            columns={[
              { title: 'Название', dataIndex: 'name' },
              { title: 'Стоимость', dataIndex: 'cost', render: formatCurrency },
            ]}
          />
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
