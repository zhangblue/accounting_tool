export interface Transaction {
  id: string | number
  description: string
  amount: number | string
  type: string
  date: string
  classification_name?: string | null
  is_income?: boolean
}

export interface TransactionApiResponse {
  data: Array<{
    id: number
    amount: string
    trading_time: string
    description: string | null
    classification_name: string | null
    is_income: boolean
  }>
  total: number
  page: number
  page_size: number
}

export interface StatisticsSummaryResponse {
  totalIncome: string
  totalExpense: string
  period: string
}

export interface ExpenseByTypeResponse {
  data: Array<{ name: string; value: string }>
}
