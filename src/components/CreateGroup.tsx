'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase'

export default function CreateGroup() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      // Criar o grupo
      const { error: groupError } = await supabase
        .from('groups')
        .insert([{ name, leader_id: user.id }])

      if (groupError) throw groupError

      // Limpar o formulário
      setName('')
      alert('Grupo criado com sucesso!')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Criar Novo Grupo</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome do Grupo
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Criando...' : 'Criar Grupo'}
        </button>
      </form>
    </div>
  )
}