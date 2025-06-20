import { Button, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import { trpc } from '../../lib/trpc'
import formStyles from './styles/MaterialForm.module.less'

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
      <h1 className="pageTitle">Добавить материал</h1>
      <Form layout="vertical" onFinish={onFinish} className={formStyles.formWrapper}>
        <Form.Item label="Название" name="name" rules={[{ required: true, message: 'Обязательное поле' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Тип" name="type" rules={[{ required: true, message: 'Обязательное поле' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Производитель" name="manufacturer" rules={[{ required: true, message: 'Обязательное поле' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Ед." name="unit" rules={[{ required: true, message: 'Обязательное поле' }]}>
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
