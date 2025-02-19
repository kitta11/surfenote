import './App.css'
import { Notes } from './components/notes.component'
import { WorkspaceKeyProvider } from './contexts/workspacekey-context'

function App() {
	return (
		<WorkspaceKeyProvider>
			<h1>Welcome to Surfe Noté</h1>
			<h3>The best workspace to scribble your waves of thoughts</h3>
			<Notes />
		</WorkspaceKeyProvider>
	)
}

export default App
