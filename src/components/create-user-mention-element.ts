export function createUserMentionElement(email: string, username: string) {
  const mentionElement = document.createElement('a')
  mentionElement.textContent = `@${username} `
  if (email) mentionElement.href = `mailto:${email}`
  mentionElement.classList.add('text-orange')
  mentionElement.classList.add('cursor-pointer')
  mentionElement.classList.add('hover:underline')
  mentionElement.title = `email: ${email}`

  return mentionElement
}
