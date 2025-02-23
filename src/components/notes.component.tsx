import { useState } from 'react'
import { useNotes } from '../hooks/use-notes'
import { Note } from './note.component'
import { v4 as uuidv4 } from 'uuid'

function getNewNoteKey(): string {
  return uuidv4()
}

export function Notes() {
  const { data: notes, error, isLoading, addNote } = useNotes()

  const starterKey = getNewNoteKey()
  const [newNoteKey, setNewNoteKey] = useState<string>(starterKey)

  function handleAddNewNode(body: string) {
    addNote(body)
    const newKey = getNewNoteKey()
    setNewNoteKey(newKey)
  }

  return (
    <div>
      {!isLoading && !error && (
        <ul className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Note
            key={newNoteKey}
            body=''
            isNew={true}
            handleAddNewNode={handleAddNewNode}
          />
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
