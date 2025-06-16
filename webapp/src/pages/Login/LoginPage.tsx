import { Form, Input, Button, Checkbox } from 'antd'
import { useNavigate } from 'react-router-dom'
import Iconka from '../../assets/Iconka.svg?react'
import { trpc } from '../../lib/trpc'
import styles from './LoginPage.module.less'

export const LoginPage = () => {
  const [form] = Form.useForm()
  const loginMutation = trpc.auth.login.useMutation()
  const navigate = useNavigate()

  const handleSubmit = async (values: { login: string; password: string; remember?: boolean }) => {
    try {
      const response = await loginMutation.mutateAsync(values)

      const storage = values.remember ? localStorage : sessionStorage

      storage.setItem('token', response.token)
      storage.setItem('role', response.user.role)
      storage.setItem('full_name', response.user.full_name)
      storage.setItem('user_id', response.user.id)

      navigate('/') // или /my-tickets — куда по роли решим позже
    } catch (error) {
      console.error(error)
      form.setFields([
        {
          name: 'login',
          errors: ['Неверный логин или пароль'],
        },
      ])
    }
  }

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.leftPane} />
      <div className={styles.rightPane}>
        <div className={styles.loginBox}>
          <div className={styles.logoContainer}>
            <Iconka />
            <h3>Учет ресурсов и управления производственными процессами</h3>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className={styles.form}
            initialValues={{ remember: true }}
          >
            <Form.Item label="Имя пользователя" name="login" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Пароль" name="password" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input.Password style={{ height: 50 }} />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Запомнить меня</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Войти
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
