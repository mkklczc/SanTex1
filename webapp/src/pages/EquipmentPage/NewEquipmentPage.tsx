import { Button, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import layoutStyles from '../../components/Layout/Layout.module.less'
import { trpc } from '../../lib/trpc'
import formStyles from './styles/EquipmentForm.module.less'

type Equipment = {
  name: string
  type: string
  manufacturer: string
  unit: string
  unitPrice: number
  quantity: number
  status: string
  tags: string
}

export const NewEquipmentPage = () => {
  const navigate = useNavigate()
  const mutation = trpc.equipment.create.useMutation({
    onSuccess: () => navigate(-1),
  })

  const onFinish = (values: Equipment) => {
    mutation.mutate({
      ...values,
      unitPrice: Number(values.unitPrice),
      quantity: Number(values.quantity),
      tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()) : [],
    })
  }

  return (
    <Layout>
      <h1 className={layoutStyles.titletwo}>Добавить оборудование</h1>
      <Form layout="vertical" onFinish={onFinish} className={formStyles.formWrapper}>
        <Form.Item label="Название" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Тип" name="type" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Производитель" name="manufacturer" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Ед." name="unit" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Цена"
          name="unitPrice"
          rules={[
            { required: true, message: 'Обязательное поле' },
            {
              validator: (_, value) =>
                value > 0 ? Promise.resolve() : Promise.reject(new Error('Цена должна быть больше 0')),
            },
          ]}
        >
          <Input type="number" min={0} />
        </Form.Item>
        <Form.Item
          label="Количество"
          name="quantity"
          rules={[
            { required: true, message: 'Обязательное поле' },
            {
              validator: (_, value) =>
                value > 0 ? Promise.resolve() : Promise.reject(new Error('Количество должно быть больше 0')),
            },
          ]}
        >
          <Input type="number" min={0} />
        </Form.Item>
        <Form.Item label="Статус" name="status" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Тэги (через запятую)" name="tags">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isLoading}>
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  )
}

export default NewEquipmentPage
