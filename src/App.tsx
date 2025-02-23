import { Notes } from './components/notes.component'
import { WorkspaceKeyProvider } from './contexts/workspacekey-context'
import logo from './assets/surfe-note-logo.png'

function App() {
  return (
    <WorkspaceKeyProvider>
      <header className='flex items-center bg-white p-3 text-primaryColor'>
        <img src={logo} alt='Logo' className='m-3 w-24' />
        <div>
          <h1 className='mb-2'>
            <span className='bg-secondaryColor p-2 text-lg text-primaryColor'>
              Surfe Noté
            </span>
          </h1>
          <h3>
            Jot it down—your future self will thank you (or question everything)
          </h3>
        </div>
      </header>
      <div></div>
      <Notes />
    </WorkspaceKeyProvider>
  )
}

export default App
