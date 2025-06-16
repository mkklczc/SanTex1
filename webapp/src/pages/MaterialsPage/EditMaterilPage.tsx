import { Button, Form, Input } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
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

export const EditMaterialPage = () => {
  const { materialId } = useParams<{ materialId: string }>()
  const navigate = useNavigate()
  const { data } = trpc.materials.list.useQuery(undefined, { select: (d) => d.find((m) => m.id === materialId) })
  const mutation = trpc.materials.update.useMutation({
    onSuccess: () => navigate(-1),
  })

  const onFinish = (values: Material) => {
    mutation.mutate({
      id: materialId!,
      ...values,
      unitPrice: Number(values.unitPrice),
      tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()) : [],
    })
  }

  return (
    <Layout>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: data?.name,
          type: data?.type,
          manufacturer: data?.manufacturer,
          unit: data?.unit,
          unitPrice: data?.unitPrice,
          tags: data?.tags?.join(', '),
          notes: data?.notes,
        }}
        style={{ maxWidth: 400 }}
      >
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

export default EditMaterialPage
