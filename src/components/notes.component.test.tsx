import { cleanup, render, screen } from '@testing-library/react'
import { useWorkspaceKeyContext } from '../contexts/workspacekey-context'
import { useNotes } from '../hooks/use-notes'
import { Notes } from './notes.component'
import { noteMockData1, noteMockData2 } from '../mock-data'

jest.mock('../contexts/workspacekey-context', () => ({
  ...jest.requireActual('../contexts/workspacekey-context'),
  useWorkspaceKeyContext: jest.fn(),
}))

jest.mock('../hooks/use-notes', () => ({
  useNotes: jest.fn(),
}))

describe('Notes list page', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
    ;(useWorkspaceKeyContext as jest.Mock).mockReturnValue({
      workspaceKey: 'testkey',
      setWorkspaceKey: jest.fn(),
    })
  })

  afterEach(() => {
    cleanup() // Ensure DOM is cleaned up
  })

  it('should be rendered loading text if notes data is loading', () => {
    ;(useNotes as jest.Mock).mockImplementation(() => {
      return {
        data: undefined,
        isLoading: true,
        error: null,
      }
    })
    render(<Notes />)
    const loadingDiv = screen.getByTestId('notes-list-loading')
    expect(loadingDiv).toBeInTheDocument()
    expect(loadingDiv).toHaveTextContent('Loading...')
  })

  it('should be rendered with error component if there is an error', () => {
    ;(useNotes as jest.Mock).mockImplementation(() => {
      return {
        data: undefined,
        isLoading: false,
        error: 'There is some error',
      }
    })
    render(<Notes />)
    const errorDiv = screen.getByTestId('notes-list-error')
    expect(errorDiv).toBeInTheDocument()
    expect(errorDiv).toHaveTextContent('There is some error')
  })

  it('should be rendered with only new note if notes array are empty', () => {
    ;(useNotes as jest.Mock).mockImplementation(() => {
      return {
        data: [],
        isLoading: false,
        error: null,
      }
    })
    render(<Notes />)
    const newNoteDiv = screen.getByTestId('note-new')
    expect(newNoteDiv).toBeInTheDocument()
    expect(newNoteDiv).toHaveTextContent('New note')
  })

  it('should render new note and the existing ones if notes array are not empty', () => {
    ;(useNotes as jest.Mock).mockImplementation(() => {
      return {
        data: [noteMockData1, noteMockData2],
        isLoading: false,
        error: null,
      }
    })
    render(<Notes />)
    const newNoteDiv = screen.getByTestId('note-new')
    expect(newNoteDiv).toBeInTheDocument()
    expect(newNoteDiv).toHaveTextContent('New note')
    const noteDiv1 = screen.getByTestId(`note-${noteMockData1.id}-body`)
    expect(noteDiv1).toBeInTheDocument()
    expect(noteDiv1).toHaveTextContent(noteMockData1.body)
  })
})
