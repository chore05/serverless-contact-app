export interface Contact {
  contactId: string
  createdAt: string
  name: string
  phoneNumber: Number
  address: string
  dueDate: string
  favorite: boolean
  attachmentUrl?: string
}
