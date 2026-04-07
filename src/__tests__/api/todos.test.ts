import { describe, it, expect, vi, beforeEach } from 'vitest'

// prismaをモック
vi.mock('@/lib/prisma', () => ({
  prisma: {
    todo: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

// NextResponse/NextRequestのモック
vi.mock('next/server', () => {
  class NextRequest {
    url: string
    method: string
    _body: string

    constructor(url: string, init?: RequestInit) {
      this.url = url
      this.method = (init?.method ?? 'GET').toUpperCase()
      this._body = (init?.body as string) ?? '{}'
    }

    async json() {
      return JSON.parse(this._body)
    }
  }

  class NextResponse {
    status: number
    _body: string | null

    constructor(body: string | null, init?: ResponseInit) {
      this._body = body
      this.status = init?.status ?? 200
    }

    async json() {
      return this._body ? JSON.parse(this._body) : null
    }

    static json(body: unknown, init?: ResponseInit) {
      return { status: init?.status ?? 200, json: async () => body }
    }
  }

  return { NextResponse, NextRequest }
})

import { prisma } from '@/lib/prisma'
import { GET, POST } from '@/app/api/todos/route'
import { PATCH, DELETE } from '@/app/api/todos/[id]/route'
import { NextRequest } from 'next/server'

const mockPrisma = prisma as {
  todo: {
    findMany: ReturnType<typeof vi.fn>
    findUnique: ReturnType<typeof vi.fn>
    create: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
  }
}

// テスト用のTodoデータ
const mockTodo = {
  id: 1,
  title: 'テニスの練習',
  done: false,
  priority: 'NORMAL' as const,
  createdAt: new Date('2026-04-07T00:00:00Z'),
  updatedAt: new Date('2026-04-07T00:00:00Z'),
}

// テスト用Request生成ヘルパー
function makeRequest(method: string, body?: unknown): NextRequest {
  return new NextRequest('http://localhost/api/todos', {
    method,
    body: body !== undefined ? JSON.stringify(body) : '{}',
  })
}

// params生成ヘルパー（Promiseラップ）
function makeParams(id: string) {
  return { params: Promise.resolve({ id }) }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GET /api/todos', () => {
  it('正常なTodoリストを返す（200）', async () => {
    mockPrisma.todo.findMany.mockResolvedValue([mockTodo])
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual([mockTodo])
  })

  it('空配列でも正常に200を返す', async () => {
    mockPrisma.todo.findMany.mockResolvedValue([])
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual([])
  })
})

describe('POST /api/todos', () => {
  it('正常なtitleで201を返す', async () => {
    mockPrisma.todo.create.mockResolvedValue({ ...mockTodo, title: 'スマッシュ練習' })
    const req = makeRequest('POST', { title: 'スマッシュ練習' })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.title).toBe('スマッシュ練習')
  })

  it('titleが空文字列で400を返す', async () => {
    const req = makeRequest('POST', { title: '' })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('titleが空白のみで400を返す', async () => {
    const req = makeRequest('POST', { title: '   ' })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('titleが201文字で400を返す', async () => {
    const title = 'A'.repeat(201)
    const req = makeRequest('POST', { title })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('titleが200文字で201を返す', async () => {
    const title = 'A'.repeat(200)
    mockPrisma.todo.create.mockResolvedValue({ ...mockTodo, title })
    const req = makeRequest('POST', { title })
    const res = await POST(req)
    expect(res.status).toBe(201)
  })
})

describe('PATCH /api/todos/[id]', () => {
  it('存在するIDで200を返す', async () => {
    mockPrisma.todo.findUnique.mockResolvedValue(mockTodo)
    mockPrisma.todo.update.mockResolvedValue({ ...mockTodo, done: true })
    const req = makeRequest('PATCH', { done: true })
    const res = await PATCH(req, makeParams('1'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.done).toBe(true)
  })

  it('存在しないIDで404を返す', async () => {
    mockPrisma.todo.findUnique.mockResolvedValue(null)
    const req = makeRequest('PATCH', { done: true })
    const res = await PATCH(req, makeParams('999'))
    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/todos/[id]', () => {
  it('存在するIDで204を返す', async () => {
    mockPrisma.todo.findUnique.mockResolvedValue(mockTodo)
    mockPrisma.todo.delete.mockResolvedValue(mockTodo)
    const req = makeRequest('DELETE')
    const res = await DELETE(req, makeParams('1'))
    expect(res.status).toBe(204)
  })

  it('存在しないIDで404を返す', async () => {
    mockPrisma.todo.findUnique.mockResolvedValue(null)
    const req = makeRequest('DELETE')
    const res = await DELETE(req, makeParams('999'))
    expect(res.status).toBe(404)
  })
})
