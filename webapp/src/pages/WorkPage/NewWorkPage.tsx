import { Button, Form, Input, DatePicker, Select } from 'antd'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import { trpc } from '../../lib/trpc'

type Work = {
  description: string
  startDate: Date
  endDate: Date
  status: string
  constructionObjectId: string
}

export const NewWorkPage = () => {
  const navigate = useNavigate()
  const objectsQuery = trpc.objects.list.useQuery()
  const createMutation = trpc.works.create.useMutation({
    onSuccess: () => navigate(-1),
  })

  const onFinish = (values: Work) => {
    createMutation.mutate({
      description: values.description,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      status: values.status,
      constructionObjectId: values.constructionObjectId,
      userId: localStorage.getItem('user_id') || '',
    })
  }

  return (
    <Layout>
      <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 480 }}>
        <Form.Item label="Описание" name="description" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Объект" name="constructionObjectId" rules={[{ required: true }]}>
          <Select options={objectsQuery.data?.map((o) => ({ label: o.name, value: o.id }))} />
        </Form.Item>
        <Form.Item label="Статус" name="status" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Дата начала" name="startDate" rules={[{ required: true }]}>
          <DatePicker format="DD.MM.YYYY" />
        </Form.Item>
        <Form.Item label="Дата окончания" name="endDate" rules={[{ required: true }]}>
          <DatePicker format="DD.MM.YYYY" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={createMutation.isLoading}>
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  )
}

export default NewWorkPage
