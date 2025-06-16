import { Button, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import { trpc } from '../../lib/trpc'

type Material = {
  name: string
  type: string
  manufacturer: string
  unit: string
  unitPrice: number
  tags: string
  notes: string
}

export const NewMaterialPage = () => {
  const navigate = useNavigate()
  const mutation = trpc.materials.create.useMutation({
    onSuccess: () => navigate(-1),
  })

  const onFinish = (values: Material) => {
    mutation.mutate({
      ...values,
      unitPrice: Number(values.unitPrice),
      tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()) : [],
    })
  }

  return (
    <Layout>
      <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 400 }}>
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
        <Form.Item label="Цена" name="unitPrice" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Тэги (через запятую)" name="tags">
          <Input />
        </Form.Item>
        <Form.Item label="Заметки" name="notes">
          <Input.TextArea rows={4} />
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

export default NewMaterialPage
