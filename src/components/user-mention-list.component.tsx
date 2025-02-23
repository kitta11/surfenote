import React, { ChangeEvent, useState } from 'react'
import { useUsers } from '../hooks/use-users'
import { User } from '../types'

interface UserMentionListProps {
  id: number | undefined
  onSelect: (user: User) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

export function UserMentionList(props: UserMentionListProps) {
  const { data: usersData, isLoading: usersLoading } = useUsers()

  const [mentionQuery, setMentionQuery] = useState('')

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    setMentionQuery(value)
  }

  function handleSelect(user: User) {
    props.onSelect(user)
    setMentionQuery('')
  }

  function renderFilteredUserList() {
    const filteredUserList = usersData
      .filter((user) =>
        user.username.toLowerCase().includes(mentionQuery.toLowerCase()),
      )
      .slice(0, 5)
    if (usersLoading || !usersData) {
      return (
        <li
          className='overlayListItem'
          data-testid={`note-${props.id}-mention-list-loading`}
        >
          Loading...
        </li>
      )
    }

    if (filteredUserList.length === 0) {
      return (
        <li
          className='overlayListItem'
          data-testid={`note-${props.id}-mention-list-no-result`}
        >
          No users found
        </li>
      )
    }

    return filteredUserList.map((user) => (
      <li
        className='overlayListItem'
        key={user.username}
        onClick={() => handleSelect(user)}
        data-testid={`note-${props.id}-mention-list-item`}
      >
        {user.username}
      </li>
    ))
  }

  return (
    <div>
      <input
        type='text'
        value={mentionQuery}
        onChange={handleInputChange}
        className='w-full bg-orange p-1 text-md text-white'
        data-testid={`note-${props.id}-mention-input`}
        autoFocus
        onKeyDown={props.onKeyDown}
      />
      <ul data-testid={`note-${props.id}-mention-list`}>
        {renderFilteredUserList()}
      </ul>
    </div>
  )
}
