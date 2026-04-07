export type Priority = 'HIGH' | 'NORMAL' | 'LOW'

export interface Todo {
  id: number
  title: string
  done: boolean
  priority: Priority
  createdAt: string
  updatedAt: string
}

export interface CreateTodoInput {
  title: string
  priority?: Priority
}

export interface UpdateTodoInput {
  title?: string
  done?: boolean
  priority?: Priority
}
