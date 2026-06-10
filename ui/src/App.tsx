import { useState } from 'react'
import { Layout, Menu, Button, DatePicker } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Home } from './pages/Home'
import { TransactionList } from './pages/TransactionList'
import { AddClassificationType } from './pages/AddClassificationType'
import dayjs, { Dayjs } from 'dayjs'
import './App.css'

const { Header, Content, Sider } = Layout

function App() {
  const [currentPage, setCurrentPage] = useState('1')
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('month'),
    dayjs().endOf('month')
  ])

  const renderContent = () => {
    switch (currentPage) {
      case '1':
        return <Home dateRange={dateRange} />
      case '2':
        return <TransactionList />
      case '3':
        return <div style={{ padding: '20px' }}>统计分析</div>
      case '4':
        return <div style={{ padding: '20px' }}>账户分析</div>
      case '5':
        return <div style={{ padding: '20px' }}>我的设置</div>
      case '5-1':
        return <AddClassificationType />
      default:
        return <Home dateRange={dateRange} />
    }
  }

  return (
    <Layout style={{ minHeight: '100vh', margin: 0, padding: 0 }}>
      <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: '64px' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>首页</div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <DatePicker.RangePicker
            value={dateRange}
            onChange={(dates) => dates && setDateRange(dates as [Dayjs, Dayjs])}
          />
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
            <Menu.SubMenu key="5" title="我的设置" style={{ color: '#fff' }}>
              <Menu.Item key="5-1" style={{ color: '#fff' }}>添加类型</Menu.Item>
            </Menu.SubMenu>
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
