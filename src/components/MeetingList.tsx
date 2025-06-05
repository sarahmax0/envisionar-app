'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'

type Meeting = {
  id: string
  group_id: string
  theme: string
  date: string
  materials: string
  completed: boolean
}

type MeetingListProps = {
  groupId: string
}

export default function MeetingList({ groupId }: MeetingListProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMeetings()
  }, [groupId])

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('group_id', groupId)
        .order('date', { ascending: true })

      if (error) throw error
      setMeetings(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleMeetingCompletion = async (meetingId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .update({ completed })
        .eq('id', meetingId)

      if (error) throw error
      await fetchMeetings()
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) return <div>Carregando reuniões...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <div key={meeting.id} className="border rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{meeting.theme}</h4>
              <p className="text-sm text-gray-500">
                Data: {new Date(meeting.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Materiais: {meeting.materials}
              </p>
            </div>
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={meeting.completed}
                  onChange={(e) => toggleMeetingCompletion(meeting.id, e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-sm text-gray-600">Concluída</span>
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}