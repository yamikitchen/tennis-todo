import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Priority } from '@/types/todo'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params
  const taskId = parseInt(id, 10)
  if (isNaN(taskId)) {
    return NextResponse.json({ error: 'IDが不正です' }, { status: 400 })
  }

  const body = await request.json() as { title?: string; done?: boolean; priority?: Priority }

  const existing = await prisma.todo.findUnique({ where: { id: taskId } })
  if (!existing) {
    return NextResponse.json({ error: 'タスクが見つかりません' }, { status: 404 })
  }

  const todo = await prisma.todo.update({
    where: { id: taskId },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.done !== undefined && { done: body.done }),
      ...(body.priority !== undefined && { priority: body.priority }),
    },
  })
  return NextResponse.json(todo)
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const taskId = parseInt(id, 10)
  if (isNaN(taskId)) {
    return NextResponse.json({ error: 'IDが不正です' }, { status: 400 })
  }

  const existing = await prisma.todo.findUnique({ where: { id: taskId } })
  if (!existing) {
    return NextResponse.json({ error: 'タスクが見つかりません' }, { status: 404 })
  }

  await prisma.todo.delete({ where: { id: taskId } })
  return new NextResponse(null, { status: 204 })
}
