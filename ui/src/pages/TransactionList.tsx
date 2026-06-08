import { useState } from 'react'
import { Button, Table, Modal, Form, Input, message } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import type { Transaction } from '../types'

interface TransactionListProps {
  transactions: Transaction[]
  onAdd: (transaction: Transaction) => void
  onDelete: (id: string) => void
  onEdit: (transaction: Transaction) => void
}

export function TransactionList({ transactions, onAdd, onDelete, onEdit }: TransactionListProps) {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleAddTransaction = (values: any) => {
    if (editingId) {
      onEdit({ ...values, id: editingId })
      setEditingId(null)
    } else {
      onAdd({ ...values, id: Date.now().toString() })
    }
    form.resetFields()
    setIsModalVisible(false)
    message.success('操作成功')
  }

  const columns = [
    { title: '编号', dataIndex: 'id', key: 'id' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (type: string) => type === 'income' ? '收入' : '支出' },
    { title: '金额', dataIndex: 'amount', key: 'amount' },
    { title: '日期', dataIndex: 'date', key: 'date' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Transaction) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => { setEditingId(record.id); form.setFieldsValue(record); setIsModalVisible(true) }} />
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => onDelete(record.id)} />
        </>
      )
    }
  ]

  return (
    <div style={{ padding: '20px' }}>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingId(null); form.resetFields(); setIsModalVisible(true) }}>
        新增交易
      </Button>
      <Table columns={columns} dataSource={transactions} rowKey="id" style={{ marginTop: '20px' }} />
      <Modal title={editingId ? '编辑交易' : '新增交易'} open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form form={form} onFinish={handleAddTransaction} layout="vertical">
          <Form.Item name="description" label="描述" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="amount" label="金额" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Input placeholder="请输入类型，如：收入、支出等" />
          </Form.Item>
          <Form.Item name="date" label="日期" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>保存</Button>
        </Form>
      </Modal>
    </div>
  )
}
