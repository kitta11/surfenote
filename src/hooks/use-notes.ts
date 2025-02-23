import { useEffect, useState } from 'react'
import { NoteProps, UseNotesResponse } from '../types'
import { useWorkspaceKeyContext } from '../contexts/workspacekey-context'

export function useNotes(): UseNotesResponse {
  const [notes, setNotes] = useState<NoteProps[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const { workspaceKey } = useWorkspaceKeyContext()
  const API_URL = `https://challenge.surfe.com/${workspaceKey}/notes`

  async function getNotes() {
    setIsLoading(true)
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Network response was not ok')
      const data: NoteProps[] = await response.json()
      setNotes(data)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function addNote(body: string) {
    setIsLoading(true)
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body }),
      })

      if (response.ok) {
        await getNotes()
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function updateNote(id: number, body: string) {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body }),
      })
      if (response.ok) {
        const updatedNote = await response.json()
        setNotes((prevnotes) =>
          prevnotes.map((note) => (note.id === id ? updatedNote : note)),
        )
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (workspaceKey) {
      getNotes()
    }
  }, [workspaceKey])

  return {
    data: notes,
    error,
    isLoading,
    addNote,
    updateNote,
  }
}
