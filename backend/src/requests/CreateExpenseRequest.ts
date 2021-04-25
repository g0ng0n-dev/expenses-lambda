/**
 * Fields in a request to create a single Expense item.
 */
export interface CreateExpenseRequest {
  merchantName: string
  date: string
  amount: string
}
