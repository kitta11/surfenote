import './App.css'
import { Notes } from './components/notes.component'
import { WorkspaceKeyProvider } from './contexts/workspacekey-context'
import logo from './assets/surfe-note-logo.png'

function App() {
	return (
		<WorkspaceKeyProvider>
			<header className="flex items-center bg-white text-primaryColor p-3">
				<img src={logo} alt="Logo" className="w-24 m-3" />
				<div>
					<h1 className="mb-2">
						<span className="text-lg text-primaryColor bg-secondaryColor p-2">
							Surfe Noté
						</span>
					</h1>
					<h3>Jot it down—your future self will thank you (or question everything)</h3>
				</div>
			</header>
			<div></div>
			<Notes />
		</WorkspaceKeyProvider>
	)
}

export default App
