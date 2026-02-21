import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { CATEGORIES, getCategoryById } from '../categories'
import commonSubs from '../data/commonSubscriptions.json'

function Tooltip({ text }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex items-center">
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
        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-56 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg leading-snug">
          {text}
        </span>
      )}
    </span>
  )
}

export default function AddSubscription({ onBack, onSaved, initialSub }) {
  const { addSubscription, editSubscription, currency, country } = useApp()
  const isEdit = !!initialSub

  const [name, setName] = useState(initialSub?.name || '')
  const [cost, setCost] = useState(initialSub?.cost?.toString() || '')
  const [recurrenceType, setRecurrenceType] = useState(initialSub?.recurrenceType || 'Monthly')
  const [customUnit, setCustomUnit] = useState(initialSub?.customRecurrence?.unit || 'Months')
  const [customValue, setCustomValue] = useState(initialSub?.customRecurrence?.value?.toString() || '2')
  const [showCustom, setShowCustom] = useState(initialSub?.recurrenceType === 'Custom')
  const [category, setCategory] = useState(initialSub?.category || 'entertainment')
  const [isLockedIn, setIsLockedIn] = useState(initialSub?.isLockedIn || false)
  const [logoUrl, setLogoUrl] = useState(initialSub?.logoUrl || '')
  const [notes, setNotes] = useState(initialSub?.notes || '')
  const [error, setError] = useState('')

  const suggestions = commonSubs.filter(s => s.country === country.code)

  const handleSuggestion = (s) => {
    setName(s.name)
    setCategory(s.category)
    setLogoUrl(s.logoUrl)
  }

  const handleSave = () => {
    if (!name.trim()) return setError('Please enter a subscription name.')
    const parsedCost = parseFloat(cost)
    if (isNaN(parsedCost) || parsedCost <= 0) return setError('Please enter a valid cost.')
    if (recurrenceType === 'Custom') {
      const v = parseInt(customValue, 10)
      if (isNaN(v) || v < 1) return setError('Please enter a valid custom interval.')
    }
    setError('')
    const data = {
      name: name.trim(),
      cost: parsedCost,
      recurrenceType,
      customRecurrence: recurrenceType === 'Custom' ? { unit: customUnit, value: parseInt(customValue, 10) } : null,
      category,
      isLockedIn,
      logoUrl,
      notes,
      country: initialSub?.country || country.code,
    }
    if (isEdit) {
      editSubscription(initialSub.id, data)
    } else {
      addSubscription(data)
    }
    onSaved()
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center bg-white px-4 py-4 sticky top-0 z-10 border-b border-gray-100">
        <button
          onClick={onBack}
          className="text-primary flex size-10 shrink-0 items-center justify-center hover:bg-primary/5 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10 text-gray-900">
          {isEdit ? 'Edit Subscription' : 'Add New Subscription'}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-28">
        {/* Quick-select suggestions (only when adding) */}
        {!isEdit && suggestions.length > 0 && (
          <div className="px-4 pt-4 pb-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Top in {country.label} {country.flag}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {suggestions.map((s, i) => {
                const cat = getCategoryById(s.category)
                return (
                  <button
                    key={i}
                    onClick={() => handleSuggestion(s)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                      name === s.name ? 'border-primary bg-primary/5' : 'border-gray-100 bg-gray-50 hover:border-primary/30'
                    }`}
                  >
                    <SuggestionLogo s={s} cat={cat} />
                    <span className="text-[10px] font-semibold text-gray-600 text-center leading-tight line-clamp-2">{s.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Name */}
        <div className="flex flex-col gap-1 px-4 py-4">
          <label className="text-sm font-semibold text-gray-900 ml-1">Subscription Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Netflix, Spotify, Gym"
            className="w-full rounded-xl border border-gray-200 bg-white h-14 px-4 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Cost */}
        <div className="flex flex-col gap-1 px-4 py-3">
          <label className="text-sm font-semibold text-gray-900 ml-1">Cost</label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-gray-400 font-semibold select-none">{currency.symbol}</span>
            <input
              type="number"
              value={cost}
              onChange={e => setCost(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full rounded-xl border border-gray-200 bg-white h-14 pl-8 pr-4 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Billing Cycle */}
        <div className="flex flex-col gap-3 px-4 py-4">
          <label className="text-sm font-semibold text-gray-900 ml-1">Billing Cycle</label>
          <div className="flex h-12 w-full items-center bg-gray-100 rounded-xl p-1">
            {['Monthly', 'Yearly'].map(opt => (
              <button
                key={opt}
                onClick={() => { setRecurrenceType(opt); setShowCustom(false) }}
                className={`flex-1 h-full rounded-lg text-sm font-bold transition-all ${
                  recurrenceType === opt && !showCustom
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {/* Show More */}
          <button
            onClick={() => { setShowCustom(v => !v); if (!showCustom) setRecurrenceType('Custom') }}
            className="flex items-center gap-1 text-xs font-semibold text-primary self-start"
          >
            <span className="material-symbols-outlined text-sm">{showCustom ? 'expand_less' : 'expand_more'}</span>
            {showCustom ? 'Hide custom' : 'Show more options'}
          </button>
          {showCustom && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-200">
              <span className="text-sm font-semibold text-gray-700">Every</span>
              <input
                type="number"
                min="1"
                value={customValue}
                onChange={e => setCustomValue(e.target.value)}
                className="w-16 rounded-lg border border-gray-200 bg-white h-10 px-2 text-sm text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
                {['Weeks', 'Months'].map(u => (
                  <button
                    key={u}
                    onClick={() => setCustomUnit(u)}
                    className={`px-3 h-8 rounded-md text-xs font-bold transition-all ${customUnit === u ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1 px-4 py-3">
          <label className="text-sm font-semibold text-gray-900 ml-1">Category</label>
          <div className="relative">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white h-14 px-4 pr-10 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
          </div>
        </div>

        {/* Locked-In */}
        <div className="flex items-center justify-between px-4 py-4 border-t border-gray-50 mt-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500">lock</span>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-gray-900">Locked-in commitment</p>
                <Tooltip text="Enable this if you cannot cancel this subscription before 1 year (e.g. annual contracts, phone plans)." />
              </div>
              <p className="text-xs text-gray-500">Cannot cancel for 1 year</p>
            </div>
          </div>
          <button
            onClick={() => setIsLockedIn(v => !v)}
            className={`relative flex h-7 w-12 items-center rounded-full p-0.5 transition-colors duration-200 ${isLockedIn ? 'bg-amber-400 justify-end' : 'bg-gray-200 justify-start'}`}
          >
            <div className="h-6 w-6 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1 px-4 py-4">
          <label className="text-sm font-semibold text-gray-900 ml-1">Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any specific details?"
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium px-5 -mt-2">{error}</p>
        )}
      </div>

      {/* Sticky Save Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100">
        <button
          onClick={handleSave}
          className="w-full h-14 rounded-xl bg-primary text-white text-base font-bold hover:bg-blue-700 active:scale-[.98] transition-all shadow-lg shadow-primary/20"
        >
          {isEdit ? 'Save Changes' : 'Save Subscription'}
        </button>
      </div>
    </div>
  )
}

function SuggestionLogo({ s, cat }) {
  const [err, setErr] = useState(false)
  if (s.logoUrl && !err) {
    return (
      <img
        src={s.logoUrl}
        alt={s.name}
        onError={() => setErr(true)}
        className="size-10 rounded-xl object-contain bg-white border border-gray-100 p-1"
      />
    )
  }
  return (
    <div className={`size-10 rounded-xl flex items-center justify-center ${cat.bg}`}>
      <span className={`material-symbols-outlined text-base ${cat.text}`}>{cat.icon}</span>
    </div>
  )
}
