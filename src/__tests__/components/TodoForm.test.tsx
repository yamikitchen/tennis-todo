import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoForm from '@/components/TodoForm'

describe('TodoForm', () => {
  it('input要素が存在する', () => {
    const onAdd = vi.fn().mockResolvedValue(undefined)
    render(<TodoForm onAdd={onAdd} />)

    const input = screen.getByPlaceholderText('新しいミッションを入力...')
    expect(input).toBeInTheDocument()
  })

  it('priority selectが存在する', () => {
    const onAdd = vi.fn().mockResolvedValue(undefined)
    render(<TodoForm onAdd={onAdd} />)

    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'HIGH' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'NORMAL' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'LOW' })).toBeInTheDocument()
  })

  it('ADDボタンクリックでonAddが呼ばれる', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn().mockResolvedValue(undefined)
    render(<TodoForm onAdd={onAdd} />)

    const input = screen.getByPlaceholderText('新しいミッションを入力...')
    await user.type(input, 'スマッシュ練習')

    const addButton = screen.getByRole('button', { name: 'ADD' })
    await user.click(addButton)

    expect(onAdd).toHaveBeenCalledTimes(1)
    expect(onAdd).toHaveBeenCalledWith({ title: 'スマッシュ練習', priority: 'NORMAL' })
  })

  it('EnterキーでonAddが呼ばれる', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn().mockResolvedValue(undefined)
    render(<TodoForm onAdd={onAdd} />)

    const input = screen.getByPlaceholderText('新しいミッションを入力...')
    await user.type(input, 'ボレー練習')
    await user.keyboard('{Enter}')

    expect(onAdd).toHaveBeenCalledTimes(1)
    expect(onAdd).toHaveBeenCalledWith({ title: 'ボレー練習', priority: 'NORMAL' })
  })

  it('titleが空の場合はonAddが呼ばれない', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn().mockResolvedValue(undefined)
    render(<TodoForm onAdd={onAdd} />)

    const addButton = screen.getByRole('button', { name: 'ADD' })
    await user.click(addButton)

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('titleが空白のみの場合もonAddが呼ばれない', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn().mockResolvedValue(undefined)
    render(<TodoForm onAdd={onAdd} />)

    const input = screen.getByPlaceholderText('新しいミッションを入力...')
    await user.type(input, '   ')
    await user.keyboard('{Enter}')

    expect(onAdd).not.toHaveBeenCalled()
  })
})
