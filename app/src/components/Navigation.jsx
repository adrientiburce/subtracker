export default function Navigation({ currentScreen, onDashboard, onAdd, onAnalysis, onSettings }) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: 'home', onClick: onDashboard },
    { id: 'add', label: 'Add', icon: 'add', onClick: onAdd },
    { id: 'analysis', label: 'Analysis', icon: 'bar_chart', onClick: onAnalysis },
    { id: 'settings', label: 'Settings', icon: 'settings', onClick: onSettings },
  ]

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 pb-6 pt-3 flex items-center justify-around z-50">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === item.id
                ? 'text-primary dark:text-blue-400'
                : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-blue-400'
            }`}
          >
            <span className={`material-symbols-outlined text-2xl ${currentScreen === item.id ? 'icon-filled' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-col p-6">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="size-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary dark:text-blue-400">wallet</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">SubTracker</h1>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-2 flex-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                currentScreen === item.id
                  ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-2xl ${currentScreen === item.id ? 'icon-filled' : ''}`}>
                {item.icon}
              </span>
              <span className="text-base font-semibold">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500">Version 1.0.0</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Made with ❤️ for better finance</p>
        </div>
      </nav>
    </>
  )
}
