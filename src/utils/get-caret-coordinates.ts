export function getCaretCoordinates(): { x: number; y: number } | null {
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
