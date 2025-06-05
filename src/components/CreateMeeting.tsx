'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase'

type CreateMeetingProps = {
  groupId: string
  onMeetingCreated: () => void
}

export default function CreateMeeting({ groupId, onMeetingCreated }: CreateMeetingProps) {
  const [theme, setTheme] = useState('')
  const [date, setDate] = useState('')
  const [materials, setMaterials] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('meetings')
        .insert([
          {
            group_id: groupId,
            theme,
            date,
            materials,
            completed: false
          }
        ])

      if (error) throw error

      setTheme('')
      setDate('')
      setMaterials('')
      onMeetingCreated()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Criar Nova Reunião</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tema
          </label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Materiais
          </label>
          <textarea
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Criando...' : 'Criar Reunião'}
        </button>
      </form>
    </div>
  )
}