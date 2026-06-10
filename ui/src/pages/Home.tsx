import { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Spin } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import type { StatisticsSummaryResponse, ExpenseByTypeResponse } from '../types'
import { Dayjs } from 'dayjs'

const COLORS = ['#ff7a45', '#ffc069', '#95de64', '#13c2c2', '#1890ff', '#722ed1']

interface HomeProps {
  dateRange: [Dayjs, Dayjs]
}

export function Home({ dateRange }: HomeProps) {
  const [loading, setLoading] = useState(false)
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [expenseByType, setExpenseByType] = useState<Array<{ name: string; value: number }>>([
    { name: '食物', value: 500 },
    { name: '交通', value: 300 },
    { name: '娱乐', value: 200 },
    { name: '其他', value: 150 }
  ])

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true)
      try {
        const [summaryRes, expenseRes] = await Promise.all([
          fetch('http://localhost:3000/api/statistics/summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              start_date: dateRange[0].format('YYYY-MM-DD'),
              end_date: dateRange[1].format('YYYY-MM-DD')
            })
          }),
          fetch('http://localhost:3000/api/statistics/expense-by-type', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              start_date: dateRange[0].format('YYYY-MM-DD'),
              end_date: dateRange[1].format('YYYY-MM-DD')
            })
          })
        ])
        const summaryData: StatisticsSummaryResponse = await summaryRes.json()
        const expenseData: ExpenseByTypeResponse = await expenseRes.json()

        setTotalIncome(parseFloat(summaryData.totalIncome))
        setTotalExpense(parseFloat(summaryData.totalExpense))

        if (expenseData.data && expenseData.data.length > 0) {
          setExpenseByType(expenseData.data.map(item => ({
            name: item.name,
            value: parseFloat(item.value)
          })))
        }
      } catch (error) {
        console.error('获取统计数据失败:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStatistics()
  }, [dateRange])


  const monthlyData = [
    { month: '1月', expense: 1200 },
    { month: '2月', expense: 1500 },
    { month: '3月', expense: 1100 },
    { month: '4月', expense: 1800 },
    { month: '5月', expense: 1400 },
    { month: '6月', expense: 1600 }
  ]

  return (
    <Spin spinning={loading}>
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
                precision={2}
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
                precision={2}
              />
            </Card>
          </Col>
        </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col xs={24} lg={12}>
          <Card title="支出类型占比">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={expenseByType} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {expenseByType.map((_, index) => (
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
    </Spin>
  )
}
