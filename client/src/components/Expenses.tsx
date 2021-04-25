import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createExpense, deleteExpense, getExpenses, patchExpense } from '../api/expenses-api'
import Auth from '../auth/Auth'
import { Expense } from '../types/Expense'

interface ExpensesProps {
  auth: Auth
  history: History
}

interface ExpensesState {
  expenses: Expense[]
  newExpenseName: string,
  date: string,
  amount: string,
  loadingExpenses: boolean
}

export class Expenses extends React.PureComponent<ExpensesProps, ExpensesState> {
  state: ExpensesState = {
    expenses: [],
    newExpenseName: '',
    date: '',
    amount: '',
    loadingExpenses: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newExpenseName: event.target.value })
  }

  onEditButtonClick = (expenseId: string) => {
    this.props.history.push(`/expenses/${expenseId}/edit`)
  }

  onExpenseCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const date = this.calculateDueDate()
      const newExpense = await createExpense(this.props.auth.getIdToken(), {
        merchantName: this.state.newExpenseName,
        date: date,
        amount: this.state.amount,
      })
      this.setState({
        expenses: [...this.state.expenses, newExpense],
        newExpenseName: ''
      })
    } catch {
      alert('Expense creation failed')
    }
  }

  onExpenseDelete = async (expenseId: string) => {
    try {
      await deleteExpense(this.props.auth.getIdToken(), expenseId)
      this.setState({
        expenses: this.state.expenses.filter(expense => expense.expenseId != expenseId)
      })
    } catch {
      alert('Expense deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const expenses = await getExpenses(this.props.auth.getIdToken())
      this.setState({
        expenses,
        loadingExpenses: false
      })
    } catch (e) {
      alert(`Failed to fetch expenses: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Expenses</Header>

        {this.renderCreateExpensesInput()}

        {this.renderExpenses()}
      </div>
    )
  }

  renderCreateExpensesInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Expense',
              onClick: this.onExpenseCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderExpenses() {
    if (this.state.loadingExpenses) {
      return this.renderLoading()
    }

    return this.renderExpensesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Expenses
        </Loader>
      </Grid.Row>
    )
  }

  renderExpensesList() {
    return (
      <Grid padded>
        {this.state.expenses.map((expense, pos) => {
          return (
            <Grid.Row key={expense.expenseId}>
              <Grid.Column width={1} verticalAlign="middle">
                {expense.amount}
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {expense.merchantName}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {expense.date}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(expense.expenseId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onExpenseDelete(expense.expenseId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {expense.attachmentUrl && (
                <Image src={expense.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
