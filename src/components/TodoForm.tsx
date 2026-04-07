'use client'

import { useState } from 'react'
import { CreateTodoInput, Priority } from '@/types/todo'

interface TodoFormProps {
  onAdd: (input: CreateTodoInput) => Promise<void>
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('NORMAL')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim() || loading) return
    setLoading(true)
    try {
      await onAdd({ title: title.trim(), priority })
      setTitle('')
      setPriority('NORMAL')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="新しいミッションを入力..."
        className="flex-1 px-4 py-3 rounded-lg text-sm text-white placeholder-white/30 outline-none border border-white/10 focus:border-[#CCFF00]/60 transition-colors"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      />
      <select
        value={priority}
        onChange={e => setPriority(e.target.value as Priority)}
        className="px-3 py-3 rounded-lg text-sm text-white border border-white/10 outline-none cursor-pointer"
        style={{ background: '#161b2e' }}
      >
        <option value="HIGH">HIGH</option>
        <option value="NORMAL">NORMAL</option>
        <option value="LOW">LOW</option>
      </select>
      <button
        onClick={handleSubmit}
        disabled={loading || !title.trim()}
        className="px-5 py-3 rounded-lg text-sm font-bold text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95"
        style={{ background: '#CCFF00' }}
      >
        {loading ? '…' : 'ADD'}
      </button>
    </div>
  )
}
