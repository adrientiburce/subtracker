import { useApp, toMonthly, toYearly } from '../context/AppContext'
import { CATEGORIES, getCategoryById } from '../categories'

function BarRow({ label, color, amount, symbol, pct }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-900">{label}</span>
        <span className="font-bold text-gray-900">{symbol}{amount.toFixed(2)}<span className="text-xs font-normal text-gray-400"> /mo</span></span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: pct + '%' }} />
        </div>
        <span className="text-xs font-bold text-gray-500 w-10 text-right">{pct.toFixed(1)}%</span>
      </div>
    </div>
  )
}

const RECURRENCE_COLORS = {
  'Monthly': 'bg-primary',
  'Yearly': 'bg-indigo-400',
  'Custom': 'bg-purple-400',
}

export default function Analysis({ onBack, onDashboard, onAdd, onSettings }) {
  const { subscriptions, currency, totalMonthly } = useApp()

  // Category breakdown (normalized monthly)
  const catData = CATEGORIES
    .map(cat => {
      const items = subscriptions.filter(s => s.category === cat.id)
      const amount = items.reduce((acc, s) => acc + toMonthly(s), 0)
      return { cat, amount, count: items.length }
    })
    .filter(d => d.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  // Recurrence breakdown
  const recurrenceData = ['Monthly', 'Yearly', 'Custom'].map(type => {
    const items = subscriptions.filter(s => s.recurrenceType === type)
    const amount = items.reduce((acc, s) => acc + toMonthly(s), 0)
    return { type, amount, count: items.length }
  }).filter(d => d.amount > 0)

  const lockedInTotal = subscriptions
    .filter(s => s.isLockedIn)
    .reduce((acc, s) => acc + toYearly(s), 0)

  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      {/* Header */}
      <header className="bg-white px-4 pt-5 pb-4 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">bar_chart</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">Analysis</h1>
            <p className="text-xs text-gray-500">Spending breakdown</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-28 px-4 pt-5 flex flex-col gap-5">
        {subscriptions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <span className="material-symbols-outlined text-5xl mb-2 block">bar_chart</span>
            <p className="font-semibold">No data yet</p>
            <p className="text-sm mt-1">Add subscriptions to see your analysis</p>
          </div>
        ) : (
          <>
            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 mb-4">By Category</h2>
              <div className="flex flex-col gap-4">
                {catData.map(({ cat, amount }) => {
                  const pct = totalMonthly > 0 ? (amount / totalMonthly) * 100 : 0
                  const colorMap = {
                    'bg-red-100': 'bg-red-400',
                    'bg-yellow-100': 'bg-yellow-400',
                    'bg-green-100': 'bg-green-400',
                    'bg-blue-100': 'bg-blue-400',
                    'bg-pink-100': 'bg-pink-400',
                    'bg-orange-100': 'bg-orange-400',
                    'bg-purple-100': 'bg-purple-400',
                    'bg-indigo-100': 'bg-indigo-400',
                    'bg-cyan-100': 'bg-cyan-400',
                    'bg-teal-100': 'bg-teal-400',
                    'bg-amber-100': 'bg-amber-400',
                    'bg-gray-100': 'bg-gray-400',
                  }
                  const barColor = colorMap[cat.bg] || 'bg-primary'
                  return (
                    <div key={cat.id} className="flex items-start gap-3">
                      <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${cat.bg}`}>
                        <span className={`material-symbols-outlined text-sm ${cat.text}`}>{cat.icon}</span>
                      </div>
                      <div className="flex-1">
                        <BarRow label={cat.label} color={barColor} amount={amount} symbol={currency.symbol} pct={pct} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recurrence Breakdown */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 mb-4">By Billing Cycle</h2>
              <div className="flex flex-col gap-4">
                {recurrenceData.map(({ type, amount }) => {
                  const pct = totalMonthly > 0 ? (amount / totalMonthly) * 100 : 0
                  return (
                    <BarRow
                      key={type}
                      label={type}
                      color={RECURRENCE_COLORS[type] || 'bg-gray-400'}
                      amount={amount}
                      symbol={currency.symbol}
                      pct={pct}
                    />
                  )
                })}
              </div>
              <p className="text-xs text-gray-400 mt-3">* All costs normalized to monthly equivalent</p>
            </div>

            {/* Locked-In Summary */}
            {lockedInTotal > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-amber-600">lock</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Locked-in commitment</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {currency.symbol}{lockedInTotal.toFixed(2)}/yr cannot be cancelled early
                  </p>
                </div>
              </div>
            )}
          </>
        )}
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
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined icon-filled text-2xl">bar_chart</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Analysis</span>
        </button>
        <button onClick={onSettings} className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-2xl">settings</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Settings</span>
        </button>
      </nav>
    </div>
  )
}
