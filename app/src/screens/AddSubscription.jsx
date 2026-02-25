import { useState, useEffect, useRef } from 'react'
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
        className="size-4 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-bold flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
        aria-label="Info"
      >?</button>
      {show && (
        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-56 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 shadow-lg leading-snug">
          {text}
        </span>
      )}
    </span>
  )
}

function CategorySelector({ value, onChange }) {
  const [showModal, setShowModal] = useState(false)
  const selectedCat = getCategoryById(value)
  
  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-14 px-4 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className={`size-8 rounded-lg flex items-center justify-center ${selectedCat.bg}`}>
            <span className={`material-symbols-outlined text-lg ${selectedCat.text}`}>{selectedCat.icon}</span>
          </div>
          <span className="font-medium">{selectedCat.label}</span>
        </div>
        <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">expand_more</span>
      </button>
      
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl p-6 pb-safe" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6" />
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Category</h2>
              <button onClick={() => setShowModal(false)} className="text-primary dark:text-blue-400 font-bold">Done</button>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { onChange(cat.id); setShowModal(false) }}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all ${
                    value === cat.id
                      ? 'bg-primary/10 dark:bg-primary/20 border-2 border-primary dark:border-blue-400'
                      : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                  }`}
                >
                  <div className={`size-12 rounded-xl flex items-center justify-center ${cat.bg}`}>
                    <span className={`material-symbols-outlined text-2xl ${cat.text}`}>{cat.icon}</span>
                  </div>
                  <span className={`text-sm font-semibold text-center ${
                    value === cat.id ? 'text-primary dark:text-blue-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    {cat.label}
                  </span>
                  {value === cat.id && (
                    <span className="material-symbols-outlined text-primary dark:text-blue-400 text-lg">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
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
  
  // Autocomplete state
  const [autocompleteQuery, setAutocompleteQuery] = useState('')
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [autocompleteResults, setAutocompleteResults] = useState([])
  const [selectedAutocompleteIndex, setSelectedAutocompleteIndex] = useState(-1)
  const autocompleteRef = useRef(null)

  // Filter suggestions by country + category, limit to 12
  const suggestions = commonSubs
    .filter(s => s.country === country.code && s.category === category)
    .slice(0, 12)

  // Autocomplete search across all categories
  const getAutocompleteResults = (query) => {
    if (!query || query.length < 2) return []
    
    const lowerQuery = query.toLowerCase()
    return commonSubs
      .filter(s => 
        s.country === country.code && 
        s.name.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 8)
  }

  // Update autocomplete results when query changes
  useEffect(() => {
    if (autocompleteQuery.length >= 2 && showAutocomplete) {
      const results = getAutocompleteResults(autocompleteQuery)
      setAutocompleteResults(results)
    } else {
      setAutocompleteResults([])
    }
  }, [autocompleteQuery, showAutocomplete, country.code])

  // Click-outside detection for autocomplete
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowAutocomplete(false)
        setSelectedAutocompleteIndex(-1)
      }
    }
    
    if (showAutocomplete) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showAutocomplete])

  // Auto-check locked-in when Yearly is selected
  useEffect(() => {
    if (recurrenceType === 'Yearly') {
      setIsLockedIn(true)
    }
  }, [recurrenceType])

  const handleSuggestion = (s) => {
    setName(s.name)
    setCategory(s.category)
    setLogoUrl(s.logoUrl)
  }

  const handleAutocompleteSelect = (subscription) => {
    setName(subscription.name)
    setCategory(subscription.category)
    setLogoUrl(subscription.logoUrl)
    setAutocompleteQuery(subscription.name)
    setShowAutocomplete(false)
    setSelectedAutocompleteIndex(-1)
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
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center bg-white dark:bg-gray-900 px-4 pt-safe pb-4 sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={onBack}
          className="text-primary dark:text-blue-400 flex size-10 shrink-0 items-center justify-center hover:bg-primary/5 dark:hover:bg-primary/10 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10 text-gray-900 dark:text-white">
          {isEdit ? 'Edit Subscription' : 'Add New Subscription'}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 lg:pb-24">
        {/* Quick-select suggestions (only when adding) */}
        {!isEdit && suggestions.length > 0 && (
          <div className="px-4 pt-4 pb-2">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Top in {country.label} {country.flag} • {getCategoryById(category).label}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {suggestions.map((s, i) => {
                const cat = getCategoryById(s.category)
                return (
                  <button
                    key={i}
                    onClick={() => handleSuggestion(s)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                      name === s.name ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-primary/30'
                    }`}
                  >
                    <SuggestionLogo s={s} cat={cat} />
                    <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 text-center leading-tight line-clamp-2">{s.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Name with Autocomplete */}
        <div className="flex flex-col gap-1 px-4 py-4">
          <label className="text-sm font-semibold text-gray-900 dark:text-white ml-1">Subscription Name</label>
          <div className="relative">
            {logoUrl && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <img 
                  src={logoUrl} 
                  alt={name}
                  className="w-8 h-8 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setAutocompleteQuery(e.target.value)
                setShowAutocomplete(true)
                setSelectedAutocompleteIndex(-1)
              }}
              onFocus={() => {
                if (autocompleteQuery.length >= 2) {
                  setShowAutocomplete(true)
                }
              }}
              onKeyDown={(e) => {
                if (!showAutocomplete || autocompleteResults.length === 0) return
                
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setSelectedAutocompleteIndex(prev => 
                    prev < autocompleteResults.length - 1 ? prev + 1 : prev
                  )
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setSelectedAutocompleteIndex(prev => prev > 0 ? prev - 1 : -1)
                } else if (e.key === 'Enter' && selectedAutocompleteIndex >= 0) {
                  e.preventDefault()
                  handleAutocompleteSelect(autocompleteResults[selectedAutocompleteIndex])
                } else if (e.key === 'Escape') {
                  setShowAutocomplete(false)
                  setSelectedAutocompleteIndex(-1)
                }
              }}
              placeholder="e.g. Netflix, Spotify, Gym"
              className={`w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-14 ${logoUrl ? 'pl-14' : 'pl-4'} pr-4 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
            />
            
            {/* Autocomplete Dropdown */}
            {showAutocomplete && autocompleteResults.length > 0 && (
              <div 
                ref={autocompleteRef}
                className="absolute z-40 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto"
              >
                {autocompleteResults.map((sub, index) => {
                  const cat = getCategoryById(sub.category)
                  const isSelected = index === selectedAutocompleteIndex
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAutocompleteSelect(sub)}
                      className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        isSelected ? 'bg-gray-50 dark:bg-gray-700' : ''
                      } ${index === 0 ? 'rounded-t-lg' : ''} ${
                        index === autocompleteResults.length - 1 ? 'rounded-b-lg' : ''
                      }`}
                    >
                      {sub.logoUrl ? (
                        <img 
                          src={sub.logoUrl} 
                          alt={sub.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <span className="material-symbols-outlined text-gray-400 text-xl">
                            image
                          </span>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {sub.name}
                        </div>
                      </div>
                      
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${cat.bg} ${cat.text}`}>
                        <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1 px-4 py-3">
          <label className="text-sm font-semibold text-gray-900 dark:text-white ml-1">Category</label>
          <CategorySelector value={category} onChange={setCategory} />
        </div>

        {/* Cost */}
        <div className="flex flex-col gap-1 px-4 py-3">
          <label className="text-sm font-semibold text-gray-900 dark:text-white ml-1">Cost</label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-gray-400 dark:text-gray-500 font-semibold select-none">{currency.symbol}</span>
            <input
              type="number"
              value={cost}
              onChange={e => setCost(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-14 pl-8 pr-4 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Billing Cycle */}
        <div className="flex flex-col gap-3 px-4 py-4">
          <label className="text-sm font-semibold text-gray-900 dark:text-white ml-1">Billing Cycle</label>
          <div className="flex h-12 w-full items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {['Monthly', 'Yearly'].map(opt => (
              <button
                key={opt}
                onClick={() => { setRecurrenceType(opt); setShowCustom(false) }}
                className={`flex-1 h-full rounded-lg text-sm font-bold transition-all ${
                  recurrenceType === opt && !showCustom
                    ? 'bg-white dark:bg-gray-700 text-primary dark:text-blue-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {/* Show More */}
          <button
            onClick={() => { setShowCustom(v => !v); if (!showCustom) setRecurrenceType('Custom') }}
            className="flex items-center gap-1 text-xs font-semibold text-primary dark:text-blue-400 self-start"
          >
            <span className="material-symbols-outlined text-sm">{showCustom ? 'expand_less' : 'expand_more'}</span>
            {showCustom ? 'Hide custom' : 'Show more options'}
          </button>
          {showCustom && (
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Every</span>
              <input
                type="number"
                min="1"
                value={customValue}
                onChange={e => setCustomValue(e.target.value)}
                className="w-16 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-10 px-2 text-sm text-center text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 gap-0.5">
                {['Weeks', 'Months'].map(u => (
                  <button
                    key={u}
                    onClick={() => setCustomUnit(u)}
                    className={`px-3 h-8 rounded-md text-xs font-bold transition-all ${customUnit === u ? 'bg-white dark:bg-gray-600 text-primary dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Locked-In */}
        <div className="flex items-center justify-between px-4 py-4 border-t border-gray-50 dark:border-gray-800 mt-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500 dark:text-amber-400">lock</span>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Locked-in commitment</p>
                <Tooltip text="Enable this if you cannot cancel this subscription before 1 year (e.g. annual contracts, phone plans)." />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Cannot cancel for 1 year</p>
            </div>
          </div>
          <button
            onClick={() => setIsLockedIn(v => !v)}
            className={`relative flex h-7 w-12 items-center rounded-full p-0.5 transition-colors duration-200 ${isLockedIn ? 'bg-amber-400 dark:bg-amber-500 justify-end' : 'bg-gray-200 dark:bg-gray-700 justify-start'}`}
          >
            <div className="h-6 w-6 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1 px-4 py-4 pb-8">
          <label className="text-sm font-semibold text-gray-900 dark:text-white ml-1">Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any specific details?"
            rows={3}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          />
        </div>

        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm font-medium px-5 pb-4">{error}</p>
        )}
      </div>

      {/* Sticky Save Button */}
      <div className="absolute bottom-20 lg:bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-30">
        <button
          onClick={handleSave}
          className="w-full h-14 rounded-xl bg-primary dark:bg-blue-600 text-white text-base font-bold hover:bg-blue-700 dark:hover:bg-blue-700 active:scale-[.98] transition-all shadow-lg shadow-primary/20"
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
        className="size-10 rounded-xl object-contain bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-1"
      />
    )
  }
  return (
    <div className={`size-10 rounded-xl flex items-center justify-center ${cat.bg}`}>
      <span className={`material-symbols-outlined text-base ${cat.text}`}>{cat.icon}</span>
    </div>
  )
}
