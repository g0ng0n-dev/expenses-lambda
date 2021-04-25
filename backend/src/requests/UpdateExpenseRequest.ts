/**
 * Fields in a request to update a single Expense item.
 */
export interface UpdateExpenseRequest {
  merchantName: string
  date: string
  amount: string
}
