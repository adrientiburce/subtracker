import { useState, useRef, useEffect } from 'react'
import { useApp, toMonthly } from '../context/AppContext'
import { getCategoryById, CATEGORIES } from '../categories'
import { formatNumber } from '../formatNumber'

function LogoOrIcon({ sub, cat, size = 'size-12' }) {
  const [imgErr, setImgErr] = useState(false)
  if (sub.logoUrl && !imgErr) {
    return (
      <img
        src={sub.logoUrl}
        alt={sub.name}
        onError={() => setImgErr(true)}
        className={`${size} rounded-xl object-contain p-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700`}
      />
    )
  }
  return (
    <div className={`${size} rounded-xl flex items-center justify-center shrink-0 ${cat.bg}`}>
      <span className={`material-symbols-outlined ${cat.text}`}>{cat.icon}</span>
    </div>
  )
}

function RecurrenceLabel({ sub }) {
  if (sub.recurrenceType === 'Custom' && sub.customRecurrence) {
    const { unit, value } = sub.customRecurrence
    return <span className="text-xs font-medium text-primary dark:text-blue-400">Every {value} {unit}</span>
  }
  return (
    <span className={`text-xs font-medium ${sub.recurrenceType === 'Yearly' ? 'text-primary dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
      {sub.recurrenceType}
    </span>
  )
}

function ThreeDotsMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <span className="material-symbols-outlined text-base">more_vert</span>
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 w-32">
          <button
            onClick={() => { setOpen(false); onEdit() }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            Edit
          </button>
          <button
            onClick={() => { setOpen(false); onDelete() }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <span className="material-symbols-outlined text-base">delete</span>
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

function SubscriptionItem({ sub, currency, digitGrouping, onEdit, onDelete }) {
  const cat = getCategoryById(sub.category)
  const monthly = toMonthly(sub)

  return (
    <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl p-3.5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="shrink-0">
        <LogoOrIcon sub={sub} cat={cat} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">{sub.name}</p>
          {sub.isLockedIn && (
            <span className="material-symbols-outlined text-amber-500 dark:text-amber-400 text-base shrink-0" title="Locked-in commitment">lock</span>
          )}
        </div>
        <RecurrenceLabel sub={sub} />
      </div>
      <div className="text-right shrink-0">
        <p className="font-bold text-gray-900 dark:text-white text-sm">{currency.symbol}{formatNumber(sub.cost, digitGrouping)}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}{formatNumber(monthly, digitGrouping)}/month</p>
      </div>
      <ThreeDotsMenu onEdit={onEdit} onDelete={onDelete} />
    </div>
  )
}

function DeleteConfirm({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-xs">
        <div className="size-12 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-red-500 dark:text-red-400">delete</span>
        </div>
        <h2 className="text-base font-bold text-gray-900 dark:text-white text-center mb-1">Delete Subscription</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">Remove <span className="font-semibold text-gray-900 dark:text-white">{name}</span> from your list?</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 h-11 rounded-xl bg-red-500 dark:bg-red-600 text-sm font-semibold text-white hover:bg-red-600 dark:hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({ onAdd, onSettings, onAnalysis, onEdit }) {
  const { subscriptions, currency, totalMonthly, totalYearly, deleteSubscription, digitGrouping, recurrenceFilter, toggleRecurrenceFilter } = useApp()
  const [deleteTarget, setDeleteTarget] = useState(null)

  const isMonthlyActive = recurrenceFilter === 'Monthly'
  const isYearlyActive = recurrenceFilter === 'Yearly'

  // Apply recurrence filter for the list
  const filteredSubs = recurrenceFilter
    ? subscriptions.filter(s => {
        if (recurrenceFilter === 'Monthly') return s.recurrenceType === 'Monthly' || s.recurrenceType === 'Custom'
        return s.recurrenceType === 'Yearly'
      })
    : subscriptions

  // Group by category, sort within group by dateAdded descending
  const grouped = CATEGORIES
    .map(cat => ({
      cat,
      items: filteredSubs
        .filter(s => s.category === cat.id)
        .sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0)),
    }))
    .filter(g => g.items.length > 0)

  return (
    <div className="flex flex-col h-full min-h-screen bg-background-light dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 px-4 pt-safe pb-4 sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary dark:text-blue-400">wallet</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight">Dashboard</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {recurrenceFilter
                  ? filteredSubs.length + ' ' + recurrenceFilter.toLowerCase() + ' subscriptions'
                  : subscriptions.length + ' active subscriptions'}
              </p>
            </div>
          </div>
          <button className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">notifications</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-28 lg:pb-6">
        {/* Cost Cards */}
        <div className="px-4 pt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => toggleRecurrenceFilter('Monthly')}
            className={'rounded-2xl p-4 text-left transition-all duration-200 '
              + (isMonthlyActive
                ? 'bg-primary dark:bg-blue-600 text-white ring-2 ring-primary/50 dark:ring-blue-400/50 shadow-lg shadow-primary/20'
                : 'bg-primary/10 dark:bg-blue-500/15 ring-1 ring-primary/20 dark:ring-blue-400/20')}
          >
            <p className={'text-xs font-semibold mb-2 ' + (isMonthlyActive ? 'opacity-80' : 'text-primary dark:text-blue-400')}>Total Monthly</p>
            <p className={'text-2xl font-extrabold leading-tight ' + (isMonthlyActive ? '' : 'text-primary dark:text-blue-300')}>
              {currency.symbol}{formatNumber(totalMonthly, digitGrouping)}
              <span className={'text-sm font-normal ' + (isMonthlyActive ? 'opacity-80' : 'text-primary/60 dark:text-blue-400/60')}> /month</span>
            </p>
            <p className={'text-xs mt-2 ' + (isMonthlyActive ? 'opacity-70' : 'text-primary/50 dark:text-blue-400/50')}>{subscriptions.length} services</p>
          </button>
          <button
            onClick={() => toggleRecurrenceFilter('Yearly')}
            className={'rounded-2xl p-4 text-left transition-all duration-200 '
              + (isYearlyActive
                ? 'bg-emerald-600 dark:bg-emerald-600 text-white ring-2 ring-emerald-500/50 dark:ring-emerald-400/50 shadow-lg shadow-emerald-500/20'
                : 'bg-emerald-500/10 dark:bg-emerald-500/15 ring-1 ring-emerald-500/20 dark:ring-emerald-400/20')}
          >
            <p className={'text-xs font-semibold mb-2 ' + (isYearlyActive ? 'opacity-80' : 'text-emerald-600 dark:text-emerald-400')}>Total Yearly</p>
            <p className={'text-2xl font-extrabold leading-tight ' + (isYearlyActive ? '' : 'text-emerald-600 dark:text-emerald-300')}>
              {currency.symbol}{formatNumber(totalYearly, digitGrouping)}
              <span className={'text-sm font-normal ' + (isYearlyActive ? 'opacity-80' : 'text-emerald-600/60 dark:text-emerald-400/60')}> /year</span>
            </p>
            <p className={'text-xs mt-2 ' + (isYearlyActive ? 'opacity-70' : 'text-emerald-600/50 dark:text-emerald-400/50')}>Est. annual cost</p>
          </button>
        </div>

        {/* Grouped Subscriptions */}
        <div className="px-4 mt-6 flex flex-col gap-8">
          {filteredSubs.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">
              <span className="material-symbols-outlined text-5xl mb-2 block">receipt_long</span>
              {recurrenceFilter ? (
                <>
                  <p className="font-semibold">No {recurrenceFilter.toLowerCase()} subscriptions</p>
                  <p className="text-sm mt-1">Tap the card again to clear the filter</p>
                </>
              ) : (
                <>
                  <p className="font-semibold">No subscriptions yet</p>
                  <p className="text-sm mt-1">Tap + to add your first one</p>
                </>
              )}
            </div>
          ) : (
            grouped.map(({ cat, items }) => (
              <div key={cat.id} className="space-y-2">
                {/* Simple Category Header */}
                <div className="flex items-center gap-2 px-1">
                  <div className={`size-6 rounded-lg flex items-center justify-center ${cat.bg}`}>
                    <span className={`material-symbols-outlined text-sm ${cat.text}`}>{cat.icon}</span>
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${cat.text}`}>{cat.label}</span>
                  <span className="ml-auto text-xs font-semibold text-gray-400 dark:text-gray-500">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
                </div>
                
                {/* Items without container wrapper */}
                <div className="space-y-2">
                  {items.map(sub => (
                    <SubscriptionItem
                      key={sub.id}
                      sub={sub}
                      currency={currency}
                      digitGrouping={digitGrouping}
                      onEdit={() => onEdit(sub)}
                      onDelete={() => setDeleteTarget(sub)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          onConfirm={() => { deleteSubscription(deleteTarget.id); setDeleteTarget(null) }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
