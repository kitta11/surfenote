import { useWorkspaceKeyContext } from '../contexts/workspacekey-context'

export function Notes() {
	const { workspaceKey } = useWorkspaceKeyContext()

	return <div>NOTES: ${workspaceKey}</div>
}
