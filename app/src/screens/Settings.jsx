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
        className="size-4 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center hover:bg-gray-300"
        aria-label="Info"
      >?</button>
      {show && (
        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-60 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg leading-snug">
          {text}
        </span>
      )}
    </span>
  )
}

export default function Settings({ onBack, onDashboard, onAdd, onAnalysis }) {
  const { currency, setCurrency, currencies, country, setCountry, countries } = useApp()
  const [showCurrencyModal, setShowCurrencyModal] = useState(false)
  const [showCountryModal, setShowCountryModal] = useState(false)
  const [currencySearch, setCurrencySearch] = useState('')

  const filteredCurrencies = currencies.filter(c =>
    c.label.toLowerCase().includes(currencySearch.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center justify-center p-2 hover:bg-primary/5 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight">Settings</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Profile */}
        <div className="px-4 py-6 flex items-center gap-4">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
            <span className="material-symbols-outlined text-primary text-3xl">person</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Alex Johnson</h2>
            <p className="text-sm text-gray-500">Premium Member</p>
          </div>
        </div>

        {/* General Settings */}
        <div className="px-4 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">General Settings</h3>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            {/* Currency */}
            <button
              onClick={() => setShowCurrencyModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">Global Currency</p>
                  <p className="text-xs text-gray-500">{currency.label}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>

            {/* Country */}
            <button
              onClick={() => setShowCountryModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">public</span>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold text-gray-900">Country</p>
                    <Tooltip text="This helps us suggest the most relevant local providers for internet, energy, and phone plans." />
                  </div>
                  <p className="text-xs text-gray-500">{country.flag} {country.label}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
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
            <button className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">dark_mode</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">Appearance</p>
                  <p className="text-xs text-gray-500">System default</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Account & Billing */}
        <div className="hidden px-4 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">Account &amp; Billing</h3>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <button className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">Profile Details</p>
                  <p className="text-xs text-gray-500">Email, Password</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">workspace_premium</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">Subscription Plan</p>
                  <p className="text-xs text-gray-500">Pro Plan (Annual)</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="px-4 mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">Data Management</h3>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <button className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">download</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">Export Data</p>
                  <p className="text-xs text-gray-500">Download CSV/JSON</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400">download</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                  <span className="material-symbols-outlined">delete</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-red-500">Delete Account</p>
                  <p className="text-xs text-red-400">This action is permanent</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-red-400">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="text-center px-4 mb-10">
          <p className="text-xs text-gray-400">Version 1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">Made with ❤️ for better finance</p>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 pb-6 pt-3 flex items-center justify-around">
        <button onClick={onDashboard} className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-2xl">home</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
        </button>
        <button onClick={onAdd} className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-2xl">add</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Add</span>
        </button>
        <button onClick={onAnalysis} className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-2xl">bar_chart</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Analysis</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined icon-filled text-2xl">settings</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Settings</span>
        </button>
      </nav>

      {/* Currency Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-t-2xl shadow-2xl p-6">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Select Currency</h2>
              <button onClick={() => { setShowCurrencyModal(false); setCurrencySearch('') }} className="text-primary font-bold">Done</button>
            </div>
            <div className="relative mb-4">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input
                type="text"
                value={currencySearch}
                onChange={e => setCurrencySearch(e.target.value)}
                placeholder="Search currencies..."
                className="w-full bg-gray-100 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
              {filteredCurrencies.map(c => (
                <button
                  key={c.code}
                  onClick={() => { setCurrency(c); setShowCurrencyModal(false); setCurrencySearch('') }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${currency.code === c.code ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-gray-900'}`}
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
          <div className="w-full max-w-md bg-white rounded-t-2xl shadow-2xl p-6">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">Select Country</h2>
              <button onClick={() => setShowCountryModal(false)} className="text-primary font-bold">Done</button>
            </div>
            <p className="text-xs text-gray-400 mb-5">Helps us suggest relevant local providers for internet, energy, and phone plans.</p>
            <div className="space-y-2">
              {countries.map(c => (
                <button
                  key={c.code}
                  onClick={() => { setCountry(c); setShowCountryModal(false) }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${country.code === c.code ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-gray-900 border border-gray-100'}`}
                >
                  <span className="font-semibold text-base">{c.flag} {c.label}</span>
                  {country.code === c.code && <span className="material-symbols-outlined">check_circle</span>}
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
