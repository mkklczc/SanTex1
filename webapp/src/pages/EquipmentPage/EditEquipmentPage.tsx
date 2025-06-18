import { Button, Form, Input } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
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

export const EditEquipmentPage = () => {
  const { equipmentId } = useParams<{ equipmentId: string }>()
  const navigate = useNavigate()
  const { data } = trpc.equipment.list.useQuery(undefined, {
    select: (d) => d.find((e) => e.id === equipmentId),
  })
  const mutation = trpc.equipment.update.useMutation({
    onSuccess: () => navigate(-1),
  })

  const onFinish = (values: Equipment) => {
    mutation.mutate({
      id: equipmentId!,
      ...values,
      unitPrice: Number(values.unitPrice),
      quantity: Number(values.quantity),
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
          quantity: data?.quantity,
          status: data?.status,
          tags: data?.tags?.join(', '),
        }}
        className={formStyles.formWrapper}
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
        <Form.Item label="Количество" name="quantity" rules={[{ required: true }]}>
          <Input type="number" />
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

export default EditEquipmentPage
