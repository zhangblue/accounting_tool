import { useState } from 'react'
import { Layout, Menu, Button, DatePicker } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Home } from './pages/Home'
import { TransactionList } from './pages/TransactionList'
import type { Transaction } from './types'
import './App.css'

const { Header, Content, Sider } = Layout

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [currentPage, setCurrentPage] = useState('1')

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction])
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactions(transactions.map(t => t.id === transaction.id ? transaction : t))
  }

  const renderContent = () => {
    switch (currentPage) {
      case '1':
        return <Home transactions={transactions} />
      case '2':
        return <TransactionList transactions={transactions} onAdd={handleAddTransaction} onDelete={handleDeleteTransaction} onEdit={handleEditTransaction} />
      case '3':
        return <div style={{ padding: '20px' }}>我的设置</div>
      default:
        return <Home transactions={transactions} />
    }
  }

  return (
    <Layout style={{ minHeight: '100vh', margin: 0, padding: 0 }}>
      <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: '64px' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>首页</div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <DatePicker.RangePicker placeholder={['Start Date', 'End Date']} />
          <Button type="primary" icon={<PlusOutlined />}>记一笔</Button>
        </div>
      </Header>
      <Layout style={{ flex: 1 }}>
        <Sider width={150} theme="dark" style={{ background: '#6366f1' }}>
          <Menu mode="inline" selectedKeys={[currentPage]} onClick={(e) => setCurrentPage(e.key)} style={{ background: '#6366f1', borderRight: 'none' }} theme="dark">
            <Menu.Item key="1" style={{ color: '#fff' }}>首页</Menu.Item>
            <Menu.Item key="2" style={{ color: '#fff' }}>账本</Menu.Item>
            <Menu.Item key="3" style={{ color: '#fff' }}>统计分析</Menu.Item>
            <Menu.Item key="4" style={{ color: '#fff' }}>账户分析</Menu.Item>
            <Menu.Item key="5" style={{ color: '#fff' }}>我的设置</Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ overflow: 'auto' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
