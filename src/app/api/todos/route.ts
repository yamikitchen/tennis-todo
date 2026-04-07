import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Priority } from '@/types/todo'

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(todos)
}

export async function POST(request: NextRequest) {
  const body = await request.json() as { title?: string; priority?: Priority }
  const { title, priority = 'NORMAL' } = body

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return NextResponse.json({ error: 'タイトルが不正です' }, { status: 400 })
  }
  if ([...title].length > 200) {
    return NextResponse.json({ error: 'タイトルが長すぎます' }, { status: 400 })
  }

  const todo = await prisma.todo.create({
    data: { title: title.trim(), priority },
  })
  return NextResponse.json(todo, { status: 201 })
}
