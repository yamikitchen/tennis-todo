import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScoreBoard from '@/components/ScoreBoard'
import { Todo } from '@/types/todo'

const makeTodo = (id: number, done: boolean): Todo => ({
  id,
  title: `タスク${id}`,
  done,
  priority: 'NORMAL',
  createdAt: '2026-04-07T00:00:00Z',
  updatedAt: '2026-04-07T00:00:00Z',
})

describe('ScoreBoard', () => {
  it('空配列のとき SET=0, GAME=0, POINT=0 を表示する', () => {
    render(<ScoreBoard todos={[]} />)

    expect(screen.getByText('SET').closest('div')).toHaveTextContent('0')
    expect(screen.getByText('GAME').closest('div')).toHaveTextContent('0')
    expect(screen.getByText('POINT').closest('div')).toHaveTextContent('0')
  })

  it('3件中1件完了のとき SET=3, GAME=1, POINT=2 を表示する', () => {
    const todos: Todo[] = [
      makeTodo(1, true),
      makeTodo(2, false),
      makeTodo(3, false),
    ]

    render(<ScoreBoard todos={todos} />)

    expect(screen.getByText('SET').closest('div')).toHaveTextContent('3')
    expect(screen.getByText('GAME').closest('div')).toHaveTextContent('1')
    expect(screen.getByText('POINT').closest('div')).toHaveTextContent('2')
  })
})
