import { useEffect, useState } from 'react'
import { useUsers } from './use-users'
import get from 'lodash/get'

export const useSuggestions = (searchTerm: string, field: string, maxResultNumber?: number) => {
	const { data: users, isLoading } = useUsers()

	const [suggestions, setSuggestions] = useState<string[]>([])

	useEffect(() => {
		if (!searchTerm || !users) {
			setSuggestions([])
			return
		}
		const filteredSuggestions = users
			.filter((user) => {
				const fieldValue = get(user, field)
				if (typeof fieldValue === 'string') {
					return fieldValue.toLowerCase().includes(searchTerm.toLowerCase())
				}
				return false
			})
			.map((filteredUser) => get(filteredUser, field) as string)

		setSuggestions(
			maxResultNumber ? filteredSuggestions.slice(0, maxResultNumber) : filteredSuggestions
		)
	}, [searchTerm, field, users])

	return { suggestions, isLoading }
}
