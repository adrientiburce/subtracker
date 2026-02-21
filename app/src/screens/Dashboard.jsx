import { useState, useRef, useEffect } from 'react'
import { useApp, toMonthly } from '../context/AppContext'
import { getCategoryById, CATEGORIES } from '../categories'

function LogoOrIcon({ sub, cat, size = 'size-12' }) {
  const [imgErr, setImgErr] = useState(false)
  if (sub.logoUrl && !imgErr) {
    return (
      <img
        src={sub.logoUrl}
        alt={sub.name}
        onError={() => setImgErr(true)}
        className={`${size} rounded-xl object-contain p-1 bg-white border border-gray-100`}
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
    return <span className="text-xs font-medium text-primary">Every {value} {unit}</span>
  }
  return (
    <span className={`text-xs font-medium ${sub.recurrenceType === 'Yearly' ? 'text-primary' : 'text-gray-500'}`}>
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
        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <span className="material-symbols-outlined text-base">more_vert</span>
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-32">
          <button
            onClick={() => { setOpen(false); onEdit() }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            Edit
          </button>
          <button
            onClick={() => { setOpen(false); onDelete() }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <span className="material-symbols-outlined text-base">delete</span>
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

function SubscriptionItem({ sub, currency, onEdit, onDelete }) {
  const cat = getCategoryById(sub.category)
  const monthly = toMonthly(sub)

  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100">
      <div className="shrink-0">
        <LogoOrIcon sub={sub} cat={cat} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold text-gray-900 truncate text-sm">{sub.name}</p>
          {sub.isLockedIn && (
            <span className="material-symbols-outlined text-amber-500 text-base shrink-0" title="Locked-in commitment">lock</span>
          )}
        </div>
        <RecurrenceLabel sub={sub} />
      </div>
      <div className="text-right shrink-0">
        <p className="font-bold text-gray-900 text-sm">{currency.symbol}{sub.cost.toFixed(2)}</p>
        <p className="text-xs text-gray-400">{currency.symbol}{monthly.toFixed(2)}/mo</p>
      </div>
      <ThreeDotsMenu onEdit={onEdit} onDelete={onDelete} />
    </div>
  )
}

function DeleteConfirm({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xs">
        <div className="size-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-red-500">delete</span>
        </div>
        <h2 className="text-base font-bold text-gray-900 text-center mb-1">Delete Subscription</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Remove <span className="font-semibold text-gray-900">{name}</span> from your list?</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 h-11 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({ onAdd, onSettings, onAnalysis, onEdit }) {
  const { subscriptions, currency, totalMonthly, totalYearly, deleteSubscription } = useApp()
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Group by category, sort within group by dateAdded descending
  const grouped = CATEGORIES
    .map(cat => ({
      cat,
      items: subscriptions
        .filter(s => s.category === cat.id)
        .sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0)),
    }))
    .filter(g => g.items.length > 0)

  return (
    <div className="flex flex-col h-full min-h-screen bg-background-light">
      {/* Header */}
      <header className="bg-white px-4 pt-5 pb-4 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">wallet</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">Dashboard</h1>
              <p className="text-xs text-gray-500">{subscriptions.length} active subscriptions</p>
            </div>
          </div>
          <button className="size-10 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-gray-600">notifications</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-28">
        {/* Cost Cards */}
        <div className="px-4 pt-5 grid grid-cols-2 gap-3">
          <div className="bg-primary rounded-2xl p-4 text-white">
            <p className="text-xs font-semibold opacity-80 mb-2">Total Monthly</p>
            <p className="text-2xl font-extrabold leading-tight">
              {currency.symbol}{totalMonthly.toFixed(2)}
              <span className="text-sm font-normal opacity-80"> /mo</span>
            </p>
            <p className="text-xs opacity-70 mt-2">{subscriptions.length} services</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 mb-2">Total Yearly</p>
            <p className="text-xl font-extrabold text-gray-900 leading-tight">
              {currency.symbol}{totalYearly.toFixed(2)}
              <span className="text-sm font-normal text-gray-500"> /yr</span>
            </p>
            <p className="text-xs text-gray-400 mt-2">Est. annual cost</p>
          </div>
        </div>

        {/* Grouped Subscriptions */}
        <div className="px-4 mt-6 flex flex-col gap-5">
          {subscriptions.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <span className="material-symbols-outlined text-5xl mb-2 block">receipt_long</span>
              <p className="font-semibold">No subscriptions yet</p>
              <p className="text-sm mt-1">Tap + to add your first one</p>
            </div>
          ) : (
            grouped.map(({ cat, items }) => (
              <div key={cat.id} className={`rounded-2xl border ${cat.border} overflow-hidden`}>
                {/* Category Header */}
                <div className={`${cat.sectionBg} px-4 py-2.5 flex items-center gap-2`}>
                  <div className={`size-6 rounded-lg flex items-center justify-center ${cat.bg}`}>
                    <span className={`material-symbols-outlined text-sm ${cat.text}`}>{cat.icon}</span>
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${cat.text}`}>{cat.label}</span>
                  <span className="ml-auto text-xs font-semibold text-gray-400">{items.length}</span>
                </div>
                {/* Items */}
                <div className="flex flex-col gap-px bg-gray-50 p-2 gap-2">
                  {items.map(sub => (
                    <SubscriptionItem
                      key={sub.id}
                      sub={sub}
                      currency={currency}
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

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 pb-6 pt-3 flex items-center justify-around">
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined icon-filled text-2xl">home</span>
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
        <button onClick={onSettings} className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-2xl">settings</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Settings</span>
        </button>
      </nav>

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
