import { useApp, toMonthly, toYearly } from '../context/AppContext'
import { CATEGORIES, getCategoryById } from '../categories'
import { formatNumber } from '../formatNumber'

function BarRow({ label, color, amount, symbol, pct, digitGrouping, count }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 dark:text-white">{label}</span>
          {count !== undefined && (
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
              {count} {count === 1 ? 'sub' : 'subs'}
            </span>
          )}
        </div>
        <span className="font-bold text-gray-900 dark:text-white">{symbol}{formatNumber(amount, digitGrouping)}<span className="text-xs font-normal text-gray-400 dark:text-gray-500"> /month</span></span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: pct + '%' }} />
        </div>
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-10 text-right">{pct.toFixed(1)}%</span>
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
  const { subscriptions, currency, totalMonthly, digitGrouping } = useApp()

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
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 px-4 pt-safe pb-4 sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary dark:text-blue-400">bar_chart</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight">Analysis</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Spending breakdown</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-28 lg:pb-6 px-4 pt-5 flex flex-col gap-5">
        {subscriptions.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <span className="material-symbols-outlined text-5xl mb-2 block">bar_chart</span>
            <p className="font-semibold">No data yet</p>
            <p className="text-sm mt-1">Add subscriptions to see your analysis</p>
          </div>
        ) : (
          <>
            {/* Category Breakdown */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">By Category</h2>
              <div className="flex flex-col gap-4">
                {catData.map(({ cat, amount, count }) => {
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
                        <BarRow label={cat.label} color={barColor} amount={amount} symbol={currency.symbol} pct={pct} digitGrouping={digitGrouping} count={count} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recurrence Breakdown */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">By Billing Cycle</h2>
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
                      digitGrouping={digitGrouping}
                    />
                  )
                })}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">* All costs normalized to monthly equivalent</p>
            </div>

            {/* Locked-In Summary */}
            {lockedInTotal > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">lock</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Locked-in commitment</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {currency.symbol}{formatNumber(lockedInTotal, digitGrouping)}/year cannot be cancelled early
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
