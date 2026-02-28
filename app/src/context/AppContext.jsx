import { createContext, useContext, useState, useEffect } from 'react'

const CURRENCIES = [
  { code: 'EUR', symbol: '€', label: 'EUR - Euro (€)' },
  { code: 'USD', symbol: '$', label: 'USD - US Dollar ($)' },
  { code: 'GBP', symbol: '£', label: 'GBP - British Pound (£)' },
  { code: 'JPY', symbol: '¥', label: 'JPY - Japanese Yen (¥)' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD - Canadian Dollar (CA$)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD - Australian Dollar (A$)' },
  { code: 'CHF', symbol: 'CHF', label: 'CHF - Swiss Franc (CHF)' },
  { code: 'BRL', symbol: 'R$', label: 'BRL - Brazilian Real (R$)' },
]

export const COUNTRIES = [
  { code: 'France', label: 'France', flag: '🇫🇷' },
  { code: 'Spain', label: 'Spain', flag: '🇪🇸' },
]

// Normalize any subscription cost to a monthly equivalent
export const toMonthly = (sub) => {
  if (sub.recurrenceType === 'Yearly') return sub.cost / 12
  if (sub.recurrenceType === 'Custom' && sub.customRecurrence) {
    const { unit, value } = sub.customRecurrence
    if (unit === 'Weeks') return (sub.cost * 52) / 12 / value
    if (unit === 'Months') return sub.cost / value
  }
  return sub.cost // Monthly
}

export const toYearly = (sub) => toMonthly(sub) * 12

const DEFAULT_SUBS = [
  { id: '1', name: 'Netflix', cost: 15.99, recurrenceType: 'Monthly', isLockedIn: false, category: 'entertainment', logoUrl: 'https://www.google.com/s2/favicons?domain=netflix.com&sz=64', dateAdded: Date.now() - 3 * 86400000, country: 'France', notes: '' },
  { id: '2', name: "Gold's Gym", cost: 45.00, recurrenceType: 'Monthly', isLockedIn: true, category: 'sport', logoUrl: '', dateAdded: Date.now() - 2 * 86400000, country: 'France', notes: '' },
  { id: '3', name: 'Spotify', cost: 16.99, recurrenceType: 'Monthly', isLockedIn: false, category: 'music', logoUrl: 'https://www.google.com/s2/favicons?domain=spotify.com&sz=64', dateAdded: Date.now() - 86400000, country: 'France', notes: '' },
]

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [subscriptions, setSubscriptions] = useState(() => {
    try {
      const saved = localStorage.getItem('subtracker_subs')
      if (!saved) return DEFAULT_SUBS
      // Migrate old records that used 'recurrence' field
      return JSON.parse(saved).map(s => ({
        ...s,
        recurrenceType: s.recurrenceType || s.recurrence || 'Monthly',
        isLockedIn: s.isLockedIn ?? false,
        logoUrl: s.logoUrl || '',
        dateAdded: s.dateAdded || Date.now(),
        country: s.country || 'France',
      }))
    } catch {
      return DEFAULT_SUBS
    }
  })

  const [currency, setCurrency] = useState(() => {
    try {
      const saved = localStorage.getItem('subtracker_currency')
      return saved ? JSON.parse(saved) : CURRENCIES[0]
    } catch {
      return CURRENCIES[0]
    }
  })

  const [country, setCountry] = useState(() => {
    try {
      const saved = localStorage.getItem('subtracker_country')
      return saved ? JSON.parse(saved) : COUNTRIES[0]
    } catch {
      return COUNTRIES[0]
    }
  })

  const [userName, setUserName] = useState(() => {
    try {
      const saved = localStorage.getItem('subtracker_username')
      return saved ? JSON.parse(saved) : 'User'
    } catch {
      return 'User'
    }
  })

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('subtracker_theme')
      return saved ? JSON.parse(saved) : 'system'
    } catch {
      return 'system'
    }
  })

  const [digitGrouping, setDigitGrouping] = useState(() => {
    try {
      const saved = localStorage.getItem('subtracker_digitgrouping')
      return saved ? JSON.parse(saved) : 'space'
    } catch {
      return 'space'
    }
  })

  useEffect(() => {
    localStorage.setItem('subtracker_subs', JSON.stringify(subscriptions))
  }, [subscriptions])

  useEffect(() => {
    localStorage.setItem('subtracker_currency', JSON.stringify(currency))
  }, [currency])

  useEffect(() => {
    localStorage.setItem('subtracker_country', JSON.stringify(country))
  }, [country])

  useEffect(() => {
    localStorage.setItem('subtracker_username', JSON.stringify(userName))
  }, [userName])

  useEffect(() => {
    localStorage.setItem('subtracker_theme', JSON.stringify(theme))
  }, [theme])

  useEffect(() => {
    localStorage.setItem('subtracker_digitgrouping', JSON.stringify(digitGrouping))
  }, [digitGrouping])

  useEffect(() => {
    const root = document.documentElement
    const applyTheme = (isDark) => {
      if (isDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      applyTheme(mediaQuery.matches)
      const listener = (e) => applyTheme(e.matches)
      // Fallback for older WebViews that lack addEventListener on MediaQueryList
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener)
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(listener)
      }
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', listener)
        } else if (mediaQuery.removeListener) {
          mediaQuery.removeListener(listener)
        }
      }
    } else {
      applyTheme(theme === 'dark')
    }
  }, [theme])

  const addSubscription = (sub) => {
    const newSub = { ...sub, id: Date.now().toString(), dateAdded: Date.now() }
    setSubscriptions(prev => [...prev, newSub])
  }

  const editSubscription = (id, data) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
  }

  const deleteSubscription = (id) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id))
  }

  const [recurrenceFilter, setRecurrenceFilter] = useState(null)

  const toggleRecurrenceFilter = (type) => {
    setRecurrenceFilter(prev => prev === type ? null : type)
  }

  const totalMonthly = subscriptions.reduce((acc, s) => acc + toMonthly(s), 0)
  const totalYearly = subscriptions.reduce((acc, s) => acc + toYearly(s), 0)

  return (
    <AppContext.Provider value={{
      subscriptions,
      addSubscription,
      editSubscription,
      deleteSubscription,
      currency,
      setCurrency,
      currencies: CURRENCIES,
      country,
      setCountry,
      countries: COUNTRIES,
      userName,
      setUserName,
      theme,
      setTheme,
      digitGrouping,
      setDigitGrouping,
      totalMonthly,
      totalYearly,
      recurrenceFilter,
      toggleRecurrenceFilter,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
