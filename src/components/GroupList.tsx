import MeetingList from './MeetingList'
import CreateMeeting from './CreateMeeting'
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'

type Group = {
  id: string
  name: string
  created_at: string
}

export default function GroupList() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('leader_id', user.id)

      if (error) throw error

      setGroups(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Carregando grupos...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Seus Grupos</h3>
        {groups.length === 0 ? (
          <p className="text-gray-500">Você ainda não tem grupos criados.</p>
        ) : (
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.id}>
                <div 
                  className={`border rounded-lg p-4 hover:bg-gray-50 cursor-pointer ${selectedGroupId === group.id ? 'border-blue-500' : ''}`}
                  onClick={() => setSelectedGroupId(group.id)}
                >
                  <h4 className="font-medium">{group.name}</h4>
                  <p className="text-sm text-gray-500">
                    Criado em: {new Date(group.created_at).toLocaleDateString()}
                  </p>
                </div>
                {selectedGroupId === group.id && (
                  <div className="mt-4 space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium mb-4">Reuniões</h5>
                      <MeetingList groupId={group.id} />
                    </div>
                    <CreateMeeting 
                      groupId={group.id} 
                      onMeetingCreated={() => fetchGroups()}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}