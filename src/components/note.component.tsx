import { useEffect, useMemo, useRef, useState } from 'react'
import { NoteProps } from '../types'
import debounce from 'lodash/debounce'
import { useNotes } from '../hooks/use-notes'
import { useUsers } from '../hooks/use-users'

export function Note(props: NoteProps) {
	const divRef = useRef<HTMLDivElement>(null)
	const caretPosRef = useRef<number>(0)

	const [noteBodyInnerHTML, setNoteBodyInnerHTML] = useState(props.body || '')

	const [showMentionInput, setShowMentionInput] = useState(false)
	const [mentionQuery, setMentionQuery] = useState('')
	const [cursorPosition, setCursorPosition] = useState<number | null>(null)
	const [cursorPositionX, setCursorPositionX] = useState<number | null>(null)
	const [cursorPositionY, setCursorPositionY] = useState<number | null>(null)

	const { updateNote } = useNotes()

	const { data: usersData, isLoading: usersLoading } = useUsers()

	const autoSave = () => {
		if (showMentionInput) return

		if (props.id !== undefined) {
			updateNote(props.id, noteBodyInnerHTML)
		} else {
			if (props.handleAddNewNode) {
				props.handleAddNewNode(noteBodyInnerHTML)
			}
		}
	}

	const autoSaveRef = useRef(autoSave)

	useEffect(() => {
		autoSaveRef.current = autoSave
	}, [noteBodyInnerHTML])

	const handleDebouncedAutoSave = useMemo(() => {
		const func = () => {
			autoSaveRef.current?.()
		}
		return debounce(func, 1500)
	}, [])

	useEffect(() => {
		if (divRef.current) {
			divRef.current.innerHTML = props.body || ''
		}
	}, [])

	function getCaretPosition(el: HTMLElement) {
		const selection = window.getSelection()
		if (!selection || selection.rangeCount === 0) return 0

		const range = selection.getRangeAt(0)

		const preCaretRange = range.cloneRange()
		preCaretRange.selectNodeContents(el)
		preCaretRange.setEnd(range.endContainer, range.endOffset)
		return preCaretRange.toString().length
	}

	function getCaretCoordinates(): { x: number; y: number } | null {
		const selection = window.getSelection()
		if (!selection || selection.rangeCount === 0) return null

		const range = selection.getRangeAt(0)
		if (!range) return null

		if (range.collapsed) {
			const rect =
				range.startContainer instanceof HTMLElement
					? range.startContainer.getBoundingClientRect()
					: range.getBoundingClientRect()

			return { x: rect.left, y: rect.bottom - 28 }
		}
		const rect = range.getBoundingClientRect()

		return { x: rect.left, y: rect.bottom - 28 }
	}

	function setCaretPosition(el: HTMLElement, position: number) {
		const selection = window.getSelection()
		if (!selection) return

		const range = document.createRange()
		let charIndex = 0

		function traverseNodes(node: Node): boolean {
			if (node.nodeType === Node.TEXT_NODE) {
				const nextCharIndex = charIndex + node.textContent!.length
				if (nextCharIndex >= position) {
					range.setStart(node, position - charIndex)
					range.setEnd(node, position - charIndex)
					return true
				}
				charIndex = nextCharIndex
			} else {
				for (const child of Array.from(node.childNodes)) {
					if (traverseNodes(child)) return true
				}
			}
			return false
		}

		traverseNodes(el)

		selection.removeAllRanges()
		selection.addRange(range)
	}

	function handleNoteBodyTextChange(event: React.FormEvent<HTMLDivElement>) {
		if (divRef.current) {
			const caretPos = getCaretPosition(divRef.current)
			caretPosRef.current = caretPos
		}

		const currentInnerHtml = event.currentTarget.innerHTML || ''
		setNoteBodyInnerHTML(currentInnerHtml)

		requestAnimationFrame(() => {
			if (divRef.current) {
				setCaretPosition(divRef.current, caretPosRef.current)
			}
		})

		handleDebouncedAutoSave()
	}

	function handleMentions(event: React.KeyboardEvent<HTMLDivElement>) {
		if (!divRef.current) return
		event.stopPropagation()

		if (event.key === '@') {
			const caretPos = getCaretPosition(divRef.current) // Store caret
			caretPosRef.current = caretPos
			const caretCoordinates = getCaretCoordinates()
			if (caretCoordinates) {
				setCursorPositionX(caretCoordinates.x)
				setCursorPositionY(caretCoordinates.y)
			}
			setShowMentionInput(true)
			setCursorPosition(caretPos)
			setMentionQuery('')

			divRef.current.setAttribute('contenteditable', 'false')

			event.preventDefault()
		}
	}

	function renderFilteredUserList() {
		const filteredUserList = usersData
			.filter((user) => user.username.toLowerCase().includes(mentionQuery.toLowerCase()))
			.slice(0, 5)
		if (usersLoading || !usersData) {
			return (
				<li
					className="overlayListItem"
					data-testid={`note-${props.id}-mention-list-loading`}
				>
					Loading...
				</li>
			)
		}

		if (filteredUserList.length === 0) {
			return (
				<li
					className="overlayListItem"
					data-testid={`note-${props.id}-mention-list-no-result`}
				>
					No users found
				</li>
			)
		}

		return filteredUserList.map((user) => (
			<li
				className="overlayListItem"
				key={user.username}
				onClick={() => insertMention(user.username, user.email)}
				data-testid={`note-${props.id}-mention-list-item`}
			>
				{user.username}
			</li>
		))
	}

	function setContentEditableActive() {
		if (!divRef.current) return
		setShowMentionInput(false)
		setMentionQuery('')
		divRef.current.setAttribute('contenteditable', 'true')
		divRef.current.focus()
		setCaretPosition(divRef.current, cursorPosition ?? 0)
	}

	function insertMention(username: string, mailto?: string) {
		if (!divRef.current || !cursorPosition) return

		// Create and style mention element
		const mentionElement = document.createElement('a')
		mentionElement.textContent = `@${username} `
		if (mailto) mentionElement.href = `mailto:${mailto}`
		mentionElement.classList.add('text-orange')
		mentionElement.classList.add('cursor-pointer')
		mentionElement.classList.add('hover:underline')
		mentionElement.title = `email: ${mailto}`

		// Re-enable contenteditable and set focus, reinstall cursor position
		setContentEditableActive()

		// Insert mention at the saved caret position
		insertAtCaret(mentionElement)
	}

	function insertAtCaret(element: HTMLElement) {
		const selection = window.getSelection()
		const range = selection?.getRangeAt(0)
		if (!range || !selection) return

		range.deleteContents()
		range.insertNode(element)

		range.collapse(false)

		// Create a new range to place the caret after the inserted mention element
		const newRange = document.createRange()
		newRange.setStartAfter(element)
		newRange.setEndAfter(element)

		// Remove any existing selections and add the new range
		selection.removeAllRanges()
		selection.addRange(newRange)

		// Get the contenteditable element and update its state too
		const editableElement = divRef.current

		if (!editableElement) return

		handleNoteBodyTextChange({
			currentTarget: editableElement,
		} as React.FormEvent<HTMLDivElement>)
	}

	function handleMentionInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === 'Escape') {
			setContentEditableActive()
		}
	}

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		setMentionQuery(event.target.value)
	}

	return (
		<div
			className={`border p-3 m-3 ${props.isNew ? 'bg-primaryColor' : 'bg-secondaryColor'}`}
			data-testid={`note-${props.id}`}
		>
			<span className="p-2 mb-2 bg-orange w-auto text-white">
				{props.id !== undefined ? `Noté - ${props.id}` : 'New note'}
			</span>
			<div
				ref={divRef}
				contentEditable
				draggable
				onInput={handleNoteBodyTextChange}
				suppressContentEditableWarning
				className="bg-white w-full my-3 p-3"
				onKeyDown={handleMentions}
				data-testid={`note-${props.id}-body`}
				role="textbox"
			/>
			{showMentionInput && (
				<div
					style={{
						position: 'absolute',
						top: cursorPositionY ?? 0 + window.scrollY, // Adjust for scrolling
						left: cursorPositionX ?? 0 + window.scrollX,
						background: 'white',
						border: '1px solid var(--note-orange)',
						borderRadius: '4px',
						padding: 'var(--note-spacing-1)',
					}}
					data-testid={`note-${props.id}-mention-overlay`}
				>
					<input
						type="text"
						value={mentionQuery}
						onChange={handleInputChange}
						onKeyDown={handleMentionInputKeyDown}
						autoFocus
						className="bg-orange text-white text-md p-1"
						data-testid={`note-${props.id}-mention-input`}
					/>
					<ul data-testid={`note-${props.id}-mention-list`}>
						{renderFilteredUserList()}
					</ul>
				</div>
			)}
		</div>
	)
}
