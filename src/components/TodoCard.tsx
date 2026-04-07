'use client'

import { Todo } from '@/types/todo'

interface TodoCardProps {
  todo: Todo
  onToggle: (id: number) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

const priorityConfig = {
  HIGH:   { color: '#f87171', label: 'HIGH' },
  NORMAL: { color: '#CCFF00', label: 'NRM' },
  LOW:    { color: '#4ade80', label: 'LOW' },
}

export default function TodoCard({ todo, onToggle, onDelete }: TodoCardProps) {
  const pConfig = priorityConfig[todo.priority as keyof typeof priorityConfig] ?? priorityConfig.NORMAL

  return (
    <div
      className="group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
      style={{
        background: todo.done ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
        borderColor: todo.done ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
      }}
    >
      {/* チェックボックス（テニスボール風） */}
      <button
        onClick={() => onToggle(todo.id)}
        className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110"
        style={{
          borderColor: todo.done ? '#CCFF00' : 'rgba(255,255,255,0.3)',
          background: todo.done
            ? 'radial-gradient(circle at 35% 35%, #e8ff60, #CCFF00 50%, #a8d400)'
            : 'transparent',
          boxShadow: todo.done ? '0 0 8px rgba(204,255,0,0.4)' : 'none',
        }}
      >
        {todo.done && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* プライオリティドット */}
      <span
        className="flex-shrink-0 w-2 h-2 rounded-full"
        style={{ background: pConfig.color, boxShadow: `0 0 6px ${pConfig.color}80` }}
        title={pConfig.label}
      />

      {/* タイトル */}
      <span
        className="flex-1 text-sm leading-relaxed"
        style={{
          color: todo.done ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.9)',
          textDecoration: todo.done ? 'line-through' : 'none',
        }}
      >
        {todo.title}
      </span>

      {/* ACEバッジ */}
      {todo.done && <span className="ace-badge">ACE!</span>}

      {/* 削除ボタン */}
      <button
        onClick={() => onDelete(todo.id)}
        className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-white/20 transition-all opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-400/10"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
