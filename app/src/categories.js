export const CATEGORIES = [
  { id: 'utilities', label: 'Utilities', icon: 'bolt', bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200', sectionBg: 'bg-yellow-50' },
  { id: 'sport', label: 'Sport & Fitness', icon: 'fitness_center', bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200', sectionBg: 'bg-green-50' },
  { id: 'software', label: 'Software & Tools', icon: 'terminal', bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', sectionBg: 'bg-blue-50' },
  { id: 'health', label: 'Health', icon: 'medical_services', bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200', sectionBg: 'bg-pink-50' },
  { id: 'entertainment', label: 'Entertainment', icon: 'movie', bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200', sectionBg: 'bg-red-50' },
  { id: 'transport', label: 'Transport', icon: 'directions_car', bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-200', sectionBg: 'bg-cyan-50' },
  { id: 'banks', label: 'Banks', icon: 'account_balance', bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200', sectionBg: 'bg-indigo-50' },
  { id: 'other', label: 'Other', icon: 'category', bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', sectionBg: 'bg-gray-50' },
]

export const getCategoryById = (id) =>
  CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1]
