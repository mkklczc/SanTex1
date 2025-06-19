import { Button, DatePicker, Form, Input } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import { trpc } from '../../lib/trpc'
import formStyles from './styles/ObjectForm.module.less'

type ConstructionObject = {
  name: string
  location: string
  foreman: string
  status: string
  startDate: Date
  endDate: Date
}

export const EditObjectPage = () => {
  const { objectId } = useParams<{ objectId: string }>()
  const navigate = useNavigate()
  const { data } = trpc.objects.list.useQuery(undefined, { select: (d) => d.find((o) => o.id === objectId) })
  const mutation = trpc.objects.update.useMutation({ onSuccess: () => navigate(-1) })

  const onFinish = (values: ConstructionObject) => {
    mutation.mutate({
      id: objectId!,
      name: values.name,
      location: values.location,
      foreman: values.foreman,
      status: values.status,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
    })
  }

  return (
    <Layout>
      <h1 className="pageTitle">Редактировать объект</h1>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: data?.name,
          location: data?.location,
          foreman: data?.foreman,
          status: data?.status,
          startDate: data ? new Date(data.startDate) : undefined,
          endDate: data ? new Date(data.endDate) : undefined,
        }}
        className={formStyles.formWrapper}
      >
        <Form.Item label="Название" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Адрес" name="location" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Прораб" name="foreman" rules={[{ required: true }]}>
          <Input />
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
          <Button type="primary" htmlType="submit" loading={mutation.isLoading}>
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  )
}

export default EditObjectPage
