import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react'

interface WorkspaceKeyContextType {
	workspaceKey: string
	setWorkspaceKey: Dispatch<SetStateAction<string>>
}
const WorkspaceKeyContext = createContext<WorkspaceKeyContextType | null>(null)

interface WorkspaceKeyProvider {
	children: ReactNode
}

const WORKSPACE_STORAGE_KEYNAME = 'workspaceKey'

export const WorkspaceKeyProvider: React.FC<WorkspaceKeyProvider> = ({ children }) => {
	const [workspaceKey, setWorkspaceKey] = useState<string>('')

	useEffect(() => {
		const workspaceKeyStoredValue: string | null =
			localStorage.getItem(WORKSPACE_STORAGE_KEYNAME)
		if (!workspaceKeyStoredValue) {
			const newWorkspaceKey = Math.random().toString(36).substring(7)
			localStorage.setItem(WORKSPACE_STORAGE_KEYNAME, newWorkspaceKey)
			setWorkspaceKey(newWorkspaceKey)
		} else {
			setWorkspaceKey(workspaceKeyStoredValue)
		}
	}, [])

	return (
		<WorkspaceKeyContext.Provider value={{ workspaceKey, setWorkspaceKey }}>
			{children}
		</WorkspaceKeyContext.Provider>
	)
}

export const useWorkspaceKeyContext = () => {
	const context = useContext(WorkspaceKeyContext)
	if (!context) {
		throw new Error('workspaceKey must be used within a WorkspaceKeyProvider')
	}
	return context
}
