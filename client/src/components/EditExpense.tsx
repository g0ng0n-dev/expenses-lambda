import * as React from 'react'
import { History } from 'history'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { patchExpense, createExpense, getExpense, getUploadUrl, uploadFile } from '../api/expenses-api'
import { Expense } from '../types/Expense'
import { Card, Icon, Image } from 'semantic-ui-react'
import dateFormat from 'dateformat'
const src = 'https://react.semantic-ui.com/images/wireframe/white-image.png'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,

}

interface EditExpenseProps {
  match: {
    params: {
      expenseId: string
    }
  }
  auth: Auth
  history: History
}

interface EditExpenseState {
  file: any
  expenseFromBackend: Expense
  uploadState: UploadState
}

export class EditExpense extends React.PureComponent<
  EditExpenseProps,
  EditExpenseState
  > {
  state: EditExpenseState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    expenseFromBackend:{
      expenseId: '',
      amount:'',
      merchantName: '',
      attachmentUrl: '',
      date: '',
      createdAt: '',
    },
  }

  async componentDidMount() {
    try {
      const expenseFromBackend = await getExpense(this.props.auth.getIdToken(), this.props.match.params.expenseId)
      this.setState({
        expenseFromBackend
      })
    } catch (e) {
      alert(`Failed to fetch expenses: ${e.message}`)
    }
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleMerchantNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMerchantName = event.target.value;
    this.setState(prevState => ({
      expenseFromBackend: {
        ...prevState.expenseFromBackend,
        merchantName: newMerchantName
      }
    }))
  }

  handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmountName = event.target.value;

    this.setState(prevState => ({
      expenseFromBackend: {
        ...prevState.expenseFromBackend,
        amount: newAmountName
      }
    }))
  }


  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      const date = this.calculateNewDate()
      const expenseUploaded = await patchExpense(this.props.auth.getIdToken(), this.props.match.params.expenseId, {
        merchantName: this.state.expenseFromBackend.merchantName,
        date: date,
        amount: this.state.expenseFromBackend.amount,
      })

      if (this.state.file) {
        this.setUploadState(UploadState.FetchingPresignedUrl)
        const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.expenseId)

        this.setUploadState(UploadState.UploadingFile)
        await uploadFile(uploadUrl, this.state.file)
      }

      this.props.history.push(`/expenses`)

    } catch (e) {
      alert('Could not update the expense: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)

    }
  }

  calculateNewDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>Edit Expense</h1>
        <Form onSubmit={(e) => this.handleSubmit(e)}>
          <Card>
            <h2>Ticket of the Expense</h2>
            {this.state.expenseFromBackend.attachmentUrl ? (
              <Image src={this.state.expenseFromBackend.attachmentUrl} ui={false} wrapped />
            ): <Image src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg' wrapped ui={false} />}
            <Form.Field>
              <label>Upload new Ticket</label>
              <input
                type="file"
                accept="image/*"
                placeholder="Image to upload"
                onChange={this.handleFileChange}
              />
            </Form.Field>
            <Card.Content>
              <Form.Field>
                <Card.Header><label>Merchant Name</label></Card.Header>
                <input
                  name="merchantName"
                  placeholder='Merchant Name'
                  value={this.state.expenseFromBackend.merchantName}
                  onChange={this.handleMerchantNameChange}/>
              </Form.Field>
              <Card.Description>
                <Form.Field>
                  <label>Amount</label>
                  <input
                    name="amount"
                    placeholder='Amount'
                    value={this.state.expenseFromBackend.amount}
                    onChange={this.handleAmountChange}
                  />
                </Form.Field>
              </Card.Description>
            </Card.Content>
          </Card>


          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
