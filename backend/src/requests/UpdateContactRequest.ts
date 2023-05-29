/**
 * Fields in a request to update a single CONTACT item.
 */
export interface UpdateContactRequest {
  name: string
  phoneNumber: Number
  address: string
  dueDate: string
  favorite: boolean
}