export function insertElementAtCaret(range: Range, element: HTMLElement) {
  range.deleteContents()
  range.insertNode(element)

  range.collapse(false)

  const newRange = document.createRange()
  newRange.setStartAfter(element)
  newRange.setEndAfter(element)
  return newRange
}
