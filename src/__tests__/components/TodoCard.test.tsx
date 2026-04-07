import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoCard from '@/components/TodoCard'
import { Todo } from '@/types/todo'

const baseTodo: Todo = {
  id: 1,
  title: 'サーブ練習',
  done: false,
  priority: 'NORMAL',
  createdAt: '2026-04-07T00:00:00Z',
  updatedAt: '2026-04-07T00:00:00Z',
}

describe('TodoCard', () => {
  it('未完了タスクが正しくレンダリングされる（ACEバッジなし）', () => {
    const onToggle = vi.fn().mockResolvedValue(undefined)
    const onDelete = vi.fn().mockResolvedValue(undefined)

    render(<TodoCard todo={baseTodo} onToggle={onToggle} onDelete={onDelete} />)

    expect(screen.getByText('サーブ練習')).toBeInTheDocument()
    expect(screen.queryByText('ACE!')).not.toBeInTheDocument()
  })

  it('完了タスクにACEバッジが表示される', () => {
    const doneTodo: Todo = { ...baseTodo, done: true }
    const onToggle = vi.fn().mockResolvedValue(undefined)
    const onDelete = vi.fn().mockResolvedValue(undefined)

    const { container } = render(<TodoCard todo={doneTodo} onToggle={onToggle} onDelete={onDelete} />)

    const aceBadge = container.querySelector('.ace-badge')
    expect(aceBadge).toBeInTheDocument()
    expect(aceBadge).toHaveTextContent('ACE!')
  })

  it('チェックボタンをクリックするとonToggleが呼ばれる', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn().mockResolvedValue(undefined)
    const onDelete = vi.fn().mockResolvedValue(undefined)

    const { container } = render(
      <TodoCard todo={baseTodo} onToggle={onToggle} onDelete={onDelete} />
    )

    const buttons = container.querySelectorAll('button')
    await user.click(buttons[0])

    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledWith(baseTodo.id)
  })

  it('削除ボタンをクリックするとonDeleteが呼ばれる', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn().mockResolvedValue(undefined)
    const onDelete = vi.fn().mockResolvedValue(undefined)

    const { container } = render(
      <TodoCard todo={baseTodo} onToggle={onToggle} onDelete={onDelete} />
    )

    const buttons = container.querySelectorAll('button')
    await user.click(buttons[1])

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith(baseTodo.id)
  })
})
