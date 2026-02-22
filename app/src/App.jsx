import { useState } from 'react'
import { AppProvider } from './context/AppContext'
import Navigation from './components/Navigation'
import UpdateNotification from './components/UpdateNotification'
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
      <div className="bg-background-light dark:bg-gray-950 min-h-screen">
        <Navigation
          currentScreen={screen}
          onDashboard={() => setScreen('dashboard')}
          onAdd={handleAdd}
          onAnalysis={() => setScreen('analysis')}
          onSettings={() => setScreen('settings')}
        />
        
        <div className="flex justify-center lg:pl-64">
          <div className="relative flex flex-col w-full max-w-md lg:max-w-7xl min-h-screen bg-white dark:bg-gray-900 shadow-xl lg:shadow-none overflow-x-hidden">
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

        {/* Update notification for PWA */}
        <UpdateNotification />
      </div>
    </AppProvider>
  )
}
