import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Form,
  TextArea,
  Loader
} from 'semantic-ui-react'

import { createContact, deleteContact, getContacts, patchContact } from '../api/contacts-api'
import Auth from '../auth/Auth'
import { Contact } from '../types/Contact'

interface ContactsProps {
  auth: Auth
  history: History
}

interface ContactsState {
  contacts: Contact[]
  newContactName: string
  phone: Number
  address: string
  loadingContacts: boolean
}

export class Contacts extends React.PureComponent<ContactsProps, ContactsState> {
  state: ContactsState = {
    contacts: [],
    newContactName: '',
    phone:0,
    address: '',
    loadingContacts: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newContactName: event.target.value })
  }
  handleSummaryChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ address: event.target.value })
  }

  handleBroken = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.visibility = "hidden";
  }

  onEditButtonClick = (contactId: string) => {
    this.props.history.push(`/contacts/${contactId}/edit`)
  }

  onContactCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newContact = await createContact(this.props.auth.getIdToken(), {
        name: this.state.newContactName,
        phoneNumber: this.state.phone,
        address: this.state.address,
        dueDate
      })
      this.setState({
        contacts: [...this.state.contacts, newContact],
        newContactName: '',
        phone:0,
        address: ''
      })
    } catch {
      alert('Contact creation failed')
    }
  }

  onContactDelete = async (contactId: string) => {
    try {
      await deleteContact(this.props.auth.getIdToken(), contactId)
      this.setState({
        contacts: this.state.contacts.filter(contact => contact.contactId !== contactId)
      })
    } catch {
      alert('Contact deletion failed')
    }
  }

  onContactCheck = async (pos: number) => {
    try {
      const contact = this.state.contacts[pos]
      await patchContact(this.props.auth.getIdToken(), contact.contactId, {
        name: contact.name,
        phoneNumber: contact.phoneNumber,
        address: contact.address,
        dueDate: contact.dueDate,
        favorite: !contact.favorite
      })
      this.setState({
        contacts: update(this.state.contacts, {
          [pos]: { favorite: { $set: !contact.favorite } }
        })
      })
    } catch {
      alert('Contact deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const contacts = await getContacts(this.props.auth.getIdToken())
      this.setState({
        contacts,
        loadingContacts: false
      })
    } catch (e) {
      alert(`Failed to fetch contacts: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">CONTACTS FORM</Header>

        {this.renderCreateContactInput()}

        {this.renderContacts()}
      </div>
    )
  }

  renderCreateContactInput() {
    return (
      <Grid.Row>
        <Header as='h3'>Create New Contact:</Header>
        <Grid.Column width={16}>
          <Form onSubmit={ this.onContactCreate}>
              <Input
                label='Contact Title'
                fluid
                placeholder="Set the contact title"
                onChange={this.handleNameChange}
              />
              <TextArea
                label='Summary'
                fluid
                placeholder="Add summary of contact"
                onChange={this.handleSummaryChange}
              />
              <Button 
                type='submit'
                >New Contact</Button>
          </Form>
          
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderContacts() {
    if (this.state.loadingContacts) {
      return this.renderLoading()
    }

    return this.renderContactsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Contacts
        </Loader>
      </Grid.Row>
    )
  }

  renderContactsList() {
    return (
      <Grid padded>
        <Header as='h3'>Contact List</Header>
        {this.state.contacts.map((contact, pos) => {
          return (
            <Grid.Row key={contact.contactId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onContactCheck(pos)}
                  checked={contact.favorite}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                <p>{contact.name}</p>
                <p>{contact.phoneNumber}</p>
                <p>{contact.address}</p>
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {contact.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(contact.contactId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onContactDelete(contact.contactId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {contact.attachmentUrl && (
                <Image src={contact.attachmentUrl} size="small" wrapped onError={this.handleBroken} />
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
    date.setDate(date.getDate() + 4)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
