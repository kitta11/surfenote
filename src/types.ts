export interface NoteProps {
  id?: number
  body: string
  isNew?: boolean
  handleAddNewNode?: (body: string) => void
}

export interface UseNotesResponse {
  data: NoteProps[]
  error: string | undefined
  isLoading: boolean
  updateNote: (id: number, body: string) => void
  addNote: (body: string) => void
}

export interface User {
  birthdate: number
  email: string
  first_name: string
  gender: string
  last_name: string
  location: {
    city: string
    postcode: number
    state: string
    street: string
  }
  phone_number: string
  title: string
  username: string
}

export interface UseUsersResponse {
  data: User[]
  error: string | undefined
  isLoading: boolean
}
