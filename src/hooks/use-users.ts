import { useEffect, useState } from 'react'
import { User, UseUsersResponse } from '../types'

export function useUsers(): UseUsersResponse {
	const [users, setUsersData] = useState<User[]>([])
	const [error, setError] = useState<string | undefined>(undefined)
	const [isLoading, setIsLoading] = useState<boolean>(false)

	async function fetchUsers() {
		setIsLoading(true)
		try {
			const response = await fetch('https://challenge.surfe.com/users')
			if (!response.ok) {
				setError('Network response was not ok')
			}
			const users: User[] = await response.json()
			setUsersData(users)
		} catch (err: any) {
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
		fetchUsers()
	}, [])

	return {
		data: users,
		error,
		isLoading,
	}
}
