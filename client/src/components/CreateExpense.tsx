import * as React from 'react'
import { Form, Input, Button, Grid, Modal, Image, Divider } from 'semantic-ui-react'
import Auth from '../auth/Auth'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface CreateExpenseProps {
  auth: Auth
  uploadState: UploadState
  handleSubmit: Function
  setUploadState: Function
  handleModalChange: Function
  modalOpen: boolean
}

interface CreateExpenseState {
  merchantName: string
  date: string
  file: any,
  amount: string
}

export class CreateExpense extends React.PureComponent<
  CreateExpenseProps,
  CreateExpenseState
  > {
  state: CreateExpenseState = {
    merchantName: '',
    date: '',
    amount: '',
    file: undefined,
  }

  handleMerchantNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ merchantName: event.target.value })
  }

  handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ amount: event.target.value })
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  render() {
    return (
      <div>
        <Grid.Row>
          <Grid.Column width={16}>
            <Modal
              onClose={() => this.props.handleModalChange(false)}
              onOpen={() => this.props.handleModalChange(true)}
              open={this.props.modalOpen}
              trigger={<Button>Create Expense</Button>}
            >
              <Modal.Header>Create Expense</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Form onSubmit={(e) => this.props.handleSubmit(e, this.state.merchantName, this.state.file, this.state.amount)}>
                    <Form.Field>
                      <label>Merchant Name</label>
                      <input placeholder='Merchant Name'
                             onChange={(e) => this.handleMerchantNameChange(e)}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>Amount</label>
                      <input placeholder='Amount'
                             onChange={(e) => this.handleAmountChange(e)}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>Upload Ticket File</label>
                      <input
                        type="file"
                        accept="image/*"
                        placeholder="Image to upload"
                        onChange={(e) => this.handleFileChange(e)}
                      />
                    </Form.Field>
                    {this.renderButton()}
                  </Form>
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => this.props.handleModalChange(false)}>Cancel</Button>
              </Modal.Actions>
            </Modal>
          </Grid.Column>
          <Grid.Column width={16}>
            <Divider />
          </Grid.Column>
        </Grid.Row>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.props.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.props.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.props.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Submit
        </Button>

      </div>
    )
  }
}
