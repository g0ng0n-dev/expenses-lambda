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
  Loader,
  Modal
} from 'semantic-ui-react'

import { createExpense, deleteExpense, getExpenses, getUploadUrl, patchExpense, uploadFile } from '../api/expenses-api'
import Auth from '../auth/Auth'
import { Expense } from '../types/Expense'
import { CreateExpense } from './CreateExpense'

interface ExpensesProps {
  auth: Auth
  history: History
}

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface ExpensesState {
  expenses: Expense[]
  loadingExpenses: boolean,
  modalOpen: boolean,
  uploadState: UploadState
}

export class Expenses extends React.PureComponent<ExpensesProps, ExpensesState> {
  state: ExpensesState = {
    expenses: [],
    loadingExpenses: true,
    modalOpen: false,
    uploadState: UploadState.NoUpload,
  }

  handleModalChange = (modalOpen: boolean) => {
    this.setState({ modalOpen: modalOpen })
  }

  onEditButtonClick = (expenseId: string) => {
    this.props.history.push(`/expenses/${expenseId}/edit`)
  }
  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  onExpenseCreate = async (event: React.ChangeEvent<HTMLButtonElement>, merchantName: string, file: any, amount: string) => {
    event.preventDefault()

    try {
      const date = this.calculateDueDate()
      const newExpense = await createExpense(this.props.auth.getIdToken(), {
        merchantName: merchantName,
        date: date,
        amount: amount,
      })

      if (file) {
        this.setUploadState(UploadState.FetchingPresignedUrl)
        const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), newExpense.expenseId)

        this.setUploadState(UploadState.UploadingFile)
        await uploadFile(uploadUrl, file)
        this.setUploadState(UploadState.NoUpload)

        alert('File was uploaded!')
      }else{
        alert('No Expense Ticket on the Creation')
      }

      this.setState({
        expenses: [...this.state.expenses, newExpense],
      })
      if(this.state.uploadState === UploadState.NoUpload){
        this.handleModalChange(false)
      }
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

        <CreateExpense
          auth={this.props.auth}
          uploadState={this.state.uploadState}
          handleSubmit={this.onExpenseCreate}
          setUploadState={this.setUploadState}
          modalOpen ={this.state.modalOpen}
          handleModalChange={this.handleModalChange}
          />

        {this.renderExpenses()}
      </div>
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
              <Grid.Column width={3} verticalAlign="middle">
                {expense.amount}
              </Grid.Column>
              <Grid.Column width={7} verticalAlign="middle">
                {expense.merchantName}
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
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
