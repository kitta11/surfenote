import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { Note } from './note.component'
import { useWorkspaceKeyContext } from '../contexts/workspacekey-context'
import { noteMockData1, noteMockData2 } from '../mock-data'
import userEvent from '@testing-library/user-event'
import { useNotes } from '../hooks/use-notes'

jest.mock('../contexts/workspacekey-context', () => ({
	...jest.requireActual('../contexts/workspacekey-context'),
	useWorkspaceKeyContext: jest.fn(),
}))

jest.mock('../hooks/use-notes', () => ({
	useNotes: jest.fn(),
}))

function moveCursor(element: Node, position: number) {
	const selection = window.getSelection()
	const range = document.createRange()
	const targetNode = element.childNodes.length > 0 ? element.childNodes[0] : element

	range.setStart(targetNode, Math.min(position, targetNode.textContent?.length ?? 0))
	range.collapse(true)

	selection?.removeAllRanges()
	selection?.addRange(range)
}

describe('Note', () => {
	const mockAddNote = jest.fn()
	const mockUpdateNote = jest.fn((note) => {
		console.log('=====TEST======mockUpdateNote called with:', note)
	})

	beforeEach(() => {
		// Reset mocks before each test
		jest.clearAllMocks()
		;(useWorkspaceKeyContext as jest.Mock).mockReturnValue({
			workspaceKey: 'testkey',
			setWorkspaceKey: jest.fn(),
		})
		;(useNotes as jest.Mock).mockImplementation(() => {
			return {
				data: [],
				isLoading: false,
				error: null,
				addNote: mockAddNote,
				updateNote: mockUpdateNote,
			}
		})
	})

	afterEach(() => {
		jest.useRealTimers() // Reset timers after test
		cleanup() // Ensure DOM is cleaned up
	})

	it('should be rendered with content', () => {
		render(<Note {...noteMockData2} />)
		expect(screen.getByTestId(`note-${noteMockData2.id}`)).toBeInTheDocument()
		expect(screen.getByTestId(`note-${noteMockData2.id}-body`)).toHaveTextContent(
			noteMockData2.body
		)
	})

	it('should autosave the modified note', async () => {
		render(<Note {...noteMockData1} />)
		const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
		expect(textarea).toBeInTheDocument()
		expect(textarea).toHaveTextContent(noteMockData1.body)

		moveCursor(textarea, 0)

		await userEvent.click(textarea)
		await userEvent.keyboard('BEGIN')

		expect(textarea).toHaveTextContent('BEGIN' + noteMockData1.body)
		// todo: solve the testing of the autosave functionality
	})

	it('should be editable and should insert the added content to the position where the user clicked', async () => {
		const bodyData = '12367'
		render(<Note id={noteMockData1.id} body={bodyData} />)

		const textarea = screen.getByTestId(`note-${noteMockData1.id}-body`)
		const updatedContent = '45'
		await userEvent.click(textarea)

		moveCursor(textarea, 4)

		await userEvent.keyboard(updatedContent)

		const expectedValue = `${bodyData.slice(0, 4)}${updatedContent}${bodyData.slice(4)}`
		expect(textarea).toHaveTextContent(expectedValue)
	})

	it('should show an overlay when user hits @ character', async () => {
		render(<Note {...noteMockData1} />)

		const textarea = screen.getByTestId(`note-${noteMockData1.id}-body`)
		await userEvent.click(textarea)

		await userEvent.keyboard('@')
		await screen.findByTestId(`note-${noteMockData1.id}-mention-overlay`)

		expect(screen.getByTestId(`note-${noteMockData1.id}-mention-overlay`)).toBeInTheDocument()
	})
})
