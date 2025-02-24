export function handleEmptyContentEditable(
  editableElement: HTMLElement,
  range: Range,
) {
  if (
    editableElement.innerHTML.trim() === '<br>' ||
    editableElement.innerHTML.trim() === ''
  ) {
    editableElement.innerHTML = ''
    const placeholder = document.createTextNode(' ')
    editableElement.appendChild(placeholder)
    range.setStart(placeholder, 0)
    range.setEnd(placeholder, 0)
  }
}
