export const CATEGORIES = [
  { id: 'entertainment', label: 'Entertainment', icon: 'movie', bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200', sectionBg: 'bg-red-50' },
  { id: 'utilities', label: 'Utilities', icon: 'bolt', bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200', sectionBg: 'bg-yellow-50' },
  { id: 'sport', label: 'Sport', icon: 'fitness_center', bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200', sectionBg: 'bg-green-50' },
  { id: 'software', label: 'Software', icon: 'terminal', bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', sectionBg: 'bg-blue-50' },
  { id: 'health', label: 'Health', icon: 'medical_services', bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200', sectionBg: 'bg-pink-50' },
  { id: 'food', label: 'Food', icon: 'restaurant', bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200', sectionBg: 'bg-orange-50' },
  { id: 'music', label: 'Music', icon: 'music_note', bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', sectionBg: 'bg-purple-50' },
  { id: 'productivity', label: 'Productivity', icon: 'folder', bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200', sectionBg: 'bg-indigo-50' },
  { id: 'transport', label: 'Transport', icon: 'directions_transit', bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200', sectionBg: 'bg-teal-50' },
  { id: 'other', label: 'Other', icon: 'category', bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', sectionBg: 'bg-gray-50' },
]

export const getCategoryById = (id) =>
  CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1]
