'use client'

import { Todo } from '@/types/todo'

interface ScoreBoardProps {
  todos: Todo[]
}

export default function ScoreBoard({ todos }: ScoreBoardProps) {
  const total = todos.length
  const done = todos.filter(t => t.done).length
  const remaining = total - done

  return (
    <div className="w-full rounded-xl overflow-hidden border border-white/10 mb-6"
         style={{ background: 'linear-gradient(135deg, #0d1117 0%, #161b2e 100%)' }}>
      {/* ヘッダー */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-white/10">
        <span className="text-xs font-bold tracking-widest text-white/40 uppercase">Score Board</span>
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500/60" />
          <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <span className="w-2 h-2 rounded-full" style={{ background: '#CCFF00', opacity: 0.8 }} />
        </div>
      </div>
      {/* スコア */}
      <div className="grid grid-cols-3 divide-x divide-white/10">
        <ScoreCell value={total} label="SET" color="#CCFF00" />
        <ScoreCell value={done} label="GAME" color="#4ade80" />
        <ScoreCell value={remaining} label="POINT" color="#f87171" />
      </div>
    </div>
  )
}

function ScoreCell({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center py-4 px-2">
      <span className="text-4xl font-black tabular-nums" style={{ color, textShadow: `0 0 20px ${color}50` }}>
        {value}
      </span>
      <span className="text-xs font-bold tracking-widest text-white/30 mt-1 uppercase">{label}</span>
    </div>
  )
}
