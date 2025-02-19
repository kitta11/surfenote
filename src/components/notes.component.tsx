import { useWorkspaceKeyContext } from '../contexts/workspacekey-context'
import { useNotes } from '../hooks/use-notes'
import { NoteProps } from '../types'
import { Note } from './note.component'

const testNotes: NoteProps[] = [
	{ id: 1, body: 'ALMA' },
	{ id: 2, body: 'Test note body 2' },
	{ id: 3, body: 'Test note body 3' },
]
export function Notes() {
	// const { workspaceKey } = useWorkspaceKeyContext()
	const { data: notes, error, isLoading } = useNotes()

	return (
		<div>
			{/* NOTES: ${workspaceKey} */}
			{!isLoading && !error && (
				<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<Note key={notes.length + 1} body="" isNew />
					{notes.map((note) => (
						<Note key={note.id} {...note} />
					))}
				</ul>
			)}
			{isLoading && <p>Loading...</p>}
			{error && <p>{error}</p>}
		</div>
	)
}
