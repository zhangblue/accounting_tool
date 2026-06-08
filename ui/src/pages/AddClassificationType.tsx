import { Form, Input, Button, Radio, message } from 'antd'
import { useState } from 'react'

export function AddClassificationType() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3000/api/classifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: values.name, types: values.types === 'income' })
      })
      const data = await response.json()
      if (response.ok) {
        message.success('分类添加成功')
        form.resetFields()
      } else {
        message.error(data.message || '添加失败')
      }
    } catch (error) {
      console.error('Error:', error)
      message.error('请求失败，请确保后端服务已启动')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', padding: '20px', backgroundColor: '#E6F7FF' }}>
      <div style={{ maxWidth: '500px', width: '100%', marginTop: '40px' }}>
        <h2>添加分类</h2>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="name" label="分类名称" rules={[{ required: true, message: '请输入分类名称' }]}>
          <Input placeholder="例如：食物、交通等" />
        </Form.Item>
        <Form.Item name="types" label="分类类型" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="expense">支出</Radio>
            <Radio value="income">收入</Radio>
          </Radio.Group>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          添加分类
        </Button>
      </Form>
      </div>
    </div>
  )
}
