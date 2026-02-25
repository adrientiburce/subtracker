import { useState } from 'react'
import { useApp } from '../context/AppContext'

function Tooltip({ text }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex items-center ml-1">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="size-4 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-bold flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
        aria-label="Info"
      >?</button>
      {show && (
        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-60 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 shadow-lg leading-snug">
          {text}
        </span>
      )}
    </span>
  )
}

export default function Settings({ onBack, onDashboard, onAdd, onAnalysis }) {
  const { currency, setCurrency, currencies, country, setCountry, countries, userName, setUserName, theme, setTheme, digitGrouping, setDigitGrouping } = useApp()
  const [showCurrencyModal, setShowCurrencyModal] = useState(false)
  const [showCountryModal, setShowCountryModal] = useState(false)
  const [showAppearanceModal, setShowAppearanceModal] = useState(false)
  const [showNumberFormatModal, setShowNumberFormatModal] = useState(false)
  const [currencySearch, setCurrencySearch] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState('')
  const [nameError, setNameError] = useState('')

  const filteredCurrencies = currencies.filter(c =>
    c.label.toLowerCase().includes(currencySearch.toLowerCase())
  )

  const themeOptions = [
    { id: 'light', label: 'Light', icon: 'light_mode' },
    { id: 'dark', label: 'Dark', icon: 'dark_mode' },
    { id: 'system', label: 'System default', icon: 'brightness_auto' },
  ]

  const numberFormatOptions = [
    { id: 'space', label: 'Space separator', example: '1 234.56' },
    { id: 'comma', label: 'Comma separator', example: '1,234.56' },
  ]

  const currentThemeLabel = themeOptions.find(t => t.id === theme)?.label || 'System default'
  const currentNumberFormatLabel = numberFormatOptions.find(n => n.id === digitGrouping)?.example || '1 234.56'

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 pt-safe pb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center justify-center p-2 hover:bg-primary/5 dark:hover:bg-primary/10 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight dark:text-white">Settings</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 overflow-y-auto pb-24 lg:pb-6">
        {/* Profile */}
        <div className="px-4 py-6 flex items-center gap-4">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
            <span className="material-symbols-outlined text-primary text-3xl">person</span>
          </div>
          <div className="flex-1">
            {isEditingName ? (
              <div>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => {
                    setTempName(e.target.value)
                    setNameError('')
                  }}
                  maxLength={30}
                  className="w-full text-lg font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-primary rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
                {nameError && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{nameError}</p>}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      const trimmed = tempName.trim()
                      if (!trimmed) {
                        setNameError('Name cannot be empty')
                        return
                      }
                      setUserName(trimmed)
                      setIsEditingName(false)
                    }}
                    className="px-3 py-1 bg-primary dark:bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingName(false)
                      setNameError('')
                    }}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setTempName(userName)
                  setIsEditingName(true)
                }}
                className="text-left hover:text-primary dark:hover:text-blue-400 transition-colors"
              >
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{userName}</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Click to edit
                </p>
              </button>
            )}
          </div>
        </div>

        {/* General Settings */}
        <div className="px-4 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 px-1">General Settings</h3>
          <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            {/* Currency */}
            <button
              onClick={() => setShowCurrencyModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors border-b border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-blue-400">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Global Currency</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{currency.label}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">chevron_right</span>
            </button>

            {/* Country */}
            <button
              onClick={() => setShowCountryModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors border-b border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-blue-400">
                  <span className="material-symbols-outlined">public</span>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Country</p>
                    <Tooltip text="This helps us suggest the most relevant local providers for internet, energy, and phone plans." />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{country.flag} {country.label}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">chevron_right</span>
            </button>

            {/* Notifications */}
            <div className="hidden w-full flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">notifications_active</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Notifications</p>
                  <p className="text-xs text-gray-500">Renewal reminders &amp; alerts</p>
                </div>
              </div>
              <ToggleSwitch />
            </div>

            {/* Appearance */}
            <button
              onClick={() => setShowAppearanceModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors border-b border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-blue-400">
                  <span className="material-symbols-outlined">dark_mode</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Appearance</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{currentThemeLabel}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">chevron_right</span>
            </button>

            {/* Number Format */}
            <button
              onClick={() => setShowNumberFormatModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-blue-400">
                  <span className="material-symbols-outlined">pin</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Number Format</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{currentNumberFormatLabel}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Account & Billing */}
        <div className="hidden px-4 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 px-1">Account &amp; Billing</h3>
          <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            <button className="w-full flex items-center justify-between p-4 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-blue-400">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Profile Details</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email, Password</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">chevron_right</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-blue-400">
                  <span className="material-symbols-outlined">workspace_premium</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Subscription Plan</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pro Plan (Annual)</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="px-4 mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 px-1">Data Management</h3>
          <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            <button className="w-full flex items-center justify-between p-4 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-blue-400">
                  <span className="material-symbols-outlined">download</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Export Data</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Download CSV/JSON</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">download</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-red-50 dark:bg-red-950 flex items-center justify-center text-red-500 dark:text-red-400">
                  <span className="material-symbols-outlined">delete</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-red-500 dark:text-red-400">Delete Account</p>
                  <p className="text-xs text-red-400 dark:text-red-500">This action is permanent</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-red-400 dark:text-red-500">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="text-center px-4 mb-10">
          <p className="text-xs text-gray-400 dark:text-gray-500">Version 1.0.0</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Made with ❤️ for better finance</p>
        </div>
      </main>

      {/* Currency Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl p-6 pb-safe">
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6" />
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Currency</h2>
              <button onClick={() => { setShowCurrencyModal(false); setCurrencySearch('') }} className="text-primary dark:text-blue-400 font-bold">Done</button>
            </div>
            <div className="relative mb-4">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">search</span>
              <input
                type="text"
                value={currencySearch}
                onChange={e => setCurrencySearch(e.target.value)}
                placeholder="Search currencies..."
                className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
              {filteredCurrencies.map(c => (
                <button
                  key={c.code}
                  onClick={() => { setCurrency(c); setShowCurrencyModal(false); setCurrencySearch('') }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${currency.code === c.code ? 'bg-primary/10 text-primary dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white'}`}
                >
                  <span className="font-medium">{c.label}</span>
                  {currency.code === c.code && <span className="material-symbols-outlined">check_circle</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Country Modal */}
      {showCountryModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl p-6 pb-safe">
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6" />
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Country</h2>
              <button onClick={() => setShowCountryModal(false)} className="text-primary dark:text-blue-400 font-bold">Done</button>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Helps us suggest relevant local providers for internet, energy, and phone plans.</p>
            <div className="space-y-2">
              {countries.map(c => (
                <button
                  key={c.code}
                  onClick={() => { setCountry(c); setShowCountryModal(false) }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${country.code === c.code ? 'bg-primary/10 text-primary dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800'}`}
                >
                  <span className="font-semibold text-base">{c.flag} {c.label}</span>
                  {country.code === c.code && <span className="material-symbols-outlined">check_circle</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Appearance Modal */}
      {showAppearanceModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl p-6 pb-safe">
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6" />
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Appearance</h2>
              <button onClick={() => setShowAppearanceModal(false)} className="text-primary dark:text-blue-400 font-bold">Done</button>
            </div>
            <div className="space-y-2">
              {themeOptions.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setTheme(t.id); setShowAppearanceModal(false) }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${theme === t.id ? 'bg-primary/10 text-primary dark:text-blue-400 border-2 border-primary dark:border-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-gray-800'}`}
                >
                  <div className={`size-10 rounded-lg flex items-center justify-center ${theme === t.id ? 'bg-primary/20 dark:bg-primary/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <span className="material-symbols-outlined">{t.icon}</span>
                  </div>
                  <span className="font-semibold text-base flex-1 text-left">{t.label}</span>
                  {theme === t.id && <span className="material-symbols-outlined">check_circle</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Number Format Modal */}
      {showNumberFormatModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl p-6 pb-safe">
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6" />
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Number Format</h2>
              <button onClick={() => setShowNumberFormatModal(false)} className="text-primary dark:text-blue-400 font-bold">Done</button>
            </div>
            <div className="space-y-2">
              {numberFormatOptions.map(n => (
                <button
                  key={n.id}
                  onClick={() => { setDigitGrouping(n.id); setShowNumberFormatModal(false) }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${digitGrouping === n.id ? 'bg-primary/10 text-primary dark:text-blue-400 border-2 border-primary dark:border-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-gray-800'}`}
                >
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-base">{n.label}</p>
                    <p className="text-sm opacity-70 mt-1">{n.example}</p>
                  </div>
                  {digitGrouping === n.id && <span className="material-symbols-outlined">check_circle</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ToggleSwitch() {
  const [on, setOn] = useState(true)
  return (
    <button
      onClick={() => setOn(v => !v)}
      className={`relative flex h-7 w-12 items-center rounded-full p-0.5 transition-colors duration-200 ${on ? 'bg-primary justify-end' : 'bg-gray-200 justify-start'}`}
    >
      <div className="h-6 w-6 rounded-full bg-white shadow-sm" />
    </button>
  )
}
