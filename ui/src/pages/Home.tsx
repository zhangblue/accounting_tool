import { Card, Row, Col, Statistic } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import type { Transaction } from '../types'

interface HomeProps {
  transactions: Transaction[]
}

const COLORS = ['#ff7a45', '#ffc069', '#95de64', '#13c2c2', '#1890ff', '#722ed1']

export function Home({ transactions }: HomeProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenseByType = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.description)
      if (existing) {
        existing.value += t.amount
      } else {
        acc.push({ name: t.description, value: t.amount })
      }
      return acc
    }, [] as Array<{ name: string; value: number }>)

  const mockData = expenseByType.length > 0 ? expenseByType : [
    { name: '食物', value: 500 },
    { name: '交通', value: 300 },
    { name: '娱乐', value: 200 },
    { name: '其他', value: 150 }
  ]

  const monthlyData = [
    { month: '1月', expense: 1200 },
    { month: '2月', expense: 1500 },
    { month: '3月', expense: 1100 },
    { month: '4月', expense: 1800 },
    { month: '5月', expense: 1400 },
    { month: '6月', expense: 1600 }
  ]

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="全部收入"
              value={totalIncome}
              prefix={<ArrowUpOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
              suffix="元"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="全部支出"
              value={totalExpense}
              prefix={<ArrowDownOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
              suffix="元"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col xs={24} lg={12}>
          <Card title="支出类型占比">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={mockData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {mockData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="每月支出情况">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="expense" stroke="#ff4d4f" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
