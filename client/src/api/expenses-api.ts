import { apiEndpoint } from '../config'
import { Expense } from '../types/Expense';
import { CreateExpenseRequest } from '../types/CreateExpenseRequest';
import Axios from 'axios'
import { UpdateExpenseRequest } from '../types/UpdateExpenseRequest';

export async function getExpenses(idToken: string): Promise<Expense[]> {
  console.log('Fetching expenses')

  const response = await Axios.get(`${apiEndpoint}/expenses`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Expenses:', response.data)
  return response.data.items
}

export async function createExpense(
  idToken: string,
  newExpense: CreateExpenseRequest
): Promise<Expense> {
  const response = await Axios.post(`${apiEndpoint}/expenses`,  JSON.stringify(newExpense), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchExpense(
  idToken: string,
  expenseId: string,
  updatedExpense: UpdateExpenseRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/expenses/${expenseId}`, JSON.stringify(updatedExpense), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteExpense(
  idToken: string,
  expenseId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/expenses/${expenseId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  expenseId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/expenses/${expenseId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
