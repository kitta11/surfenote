export function setCaretPosition(el: HTMLElement, position: number) {
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
