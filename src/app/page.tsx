'use client'

import { useEffect, useState } from 'react'
import { Todo, CreateTodoInput } from '@/types/todo'
import ScoreBoard from '@/components/ScoreBoard'
import TodoForm from '@/components/TodoForm'
import TodoCard from '@/components/TodoCard'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTodos = async () => {
    try {
      const res = await fetch('/api/todos')
      const data = await res.json() as Todo[]
      setTodos(data)
    } catch (err) {
      console.error('fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTodos() }, [])

  const handleAdd = async (input: CreateTodoInput) => {
    try {
      await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      await fetchTodos()
    } catch (err) {
      console.error('add error:', err)
    }
  }

  const handleToggle = async (id: number) => {
    try {
      const todo = todos.find(t => t.id === id)
      if (!todo) return
      await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !todo.done }),
      })
      await fetchTodos()
    } catch (err) {
      console.error('toggle error:', err)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/todos/${id}`, { method: 'DELETE' })
      await fetchTodos()
    } catch (err) {
      console.error('delete error:', err)
    }
  }

  return (
    <div className="court-bg">
      <div className="relative z-10 max-w-xl mx-auto px-4 py-12">
        {/* タイトル */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-black tracking-widest uppercase mb-1"
            style={{ color: '#CCFF00', textShadow: '0 0 30px rgba(204,255,0,0.4)' }}
          >
            TENNIS TODO
          </h1>
          <p className="text-xs tracking-widest text-white/20 uppercase">全国選抜チームのタスク管理</p>
        </div>

        {/* スコアボード */}
        <ScoreBoard todos={todos} />

        {/* 追加フォーム */}
        <TodoForm onAdd={handleAdd} />

        {/* タスクリスト */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="tennis-spinner" />
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-16 text-white/20 text-sm tracking-widest uppercase">
            No Mission Yet
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {todos.map(todo => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
