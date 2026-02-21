import { useState } from 'react'
import { AppProvider } from './context/AppContext'
import Dashboard from './screens/Dashboard'
import AddSubscription from './screens/AddSubscription'
import Analysis from './screens/Analysis'
import Settings from './screens/Settings'

export default function App() {
  const [screen, setScreen] = useState('dashboard')
  const [editSub, setEditSub] = useState(null)

  const handleEdit = (sub) => {
    setEditSub(sub)
    setScreen('add')
  }

  const handleAdd = () => {
    setEditSub(null)
    setScreen('add')
  }

  return (
    <AppProvider>
      <div className="bg-background-light min-h-screen flex justify-center">
        <div className="relative flex flex-col w-full max-w-md min-h-screen bg-white shadow-xl overflow-x-hidden">
          {screen === 'dashboard' && (
            <Dashboard
              onAdd={handleAdd}
              onEdit={handleEdit}
              onAnalysis={() => setScreen('analysis')}
              onSettings={() => setScreen('settings')}
            />
          )}
          {screen === 'add' && (
            <AddSubscription
              initialSub={editSub}
              onBack={() => setScreen('dashboard')}
              onSaved={() => setScreen('dashboard')}
            />
          )}
          {screen === 'analysis' && (
            <Analysis
              onBack={() => setScreen('dashboard')}
              onDashboard={() => setScreen('dashboard')}
              onAdd={handleAdd}
              onSettings={() => setScreen('settings')}
            />
          )}
          {screen === 'settings' && (
            <Settings
              onBack={() => setScreen('dashboard')}
              onDashboard={() => setScreen('dashboard')}
              onAdd={handleAdd}
              onAnalysis={() => setScreen('analysis')}
            />
          )}
        </div>
      </div>
    </AppProvider>
  )
}
