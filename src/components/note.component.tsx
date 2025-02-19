import { useEffect, useMemo, useRef, useState } from 'react'
import { NoteProps } from '../types'
import debounce from 'lodash/debounce'
import { useNotes } from '../hooks/use-notes'

export function Note(props: NoteProps & { isNew?: boolean }) {
	const divRef = useRef<HTMLDivElement>(null)
	const caretPosRef = useRef<number>(0)

	const [noteBodyText, setNoteBodyText] = useState(props.body || '')
	const { updateNote, addNote } = useNotes()

	const autoSave = () => {
		if (props.id !== undefined) {
			updateNote(props.id, noteBodyText)
		} else {
			addNote(noteBodyText)
		}
	}

	const autoSaveRef = useRef(autoSave)

	useEffect(() => {
		autoSaveRef.current = autoSave
	}, [noteBodyText])

	const handleDebouncedAutoSave = useMemo(() => {
		const func = () => {
			autoSaveRef.current?.()
		}
		return debounce(func, 1000)
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

		const currentText = event.currentTarget.textContent || ''
		setNoteBodyText(currentText)

		requestAnimationFrame(() => {
			if (divRef.current) {
				setCaretPosition(divRef.current, caretPosRef.current)
			}
		})

		handleDebouncedAutoSave()
	}

	return (
		<div className={`border p-3 m-3 ${props.isNew ? 'bg-primaryColor' : 'bg-secondaryColor'}`}>
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
			>
				{noteBodyText}
			</div>
		</div>
	)
}
