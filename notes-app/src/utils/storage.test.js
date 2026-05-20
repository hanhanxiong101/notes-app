import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getNotes, saveNote, deleteNote, getNote, STORAGE_KEY } from './storage.js'

beforeEach(() => {
  localStorage.clear()
})

describe('getNotes', () => {
  it('returns empty array when no notes stored', () => {
    expect(getNotes()).toEqual([])
  })

  it('returns stored notes', () => {
    const notes = [{ id: '1', title: 'Test' }]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    expect(getNotes()).toEqual(notes)
  })
})

describe('saveNote', () => {
  it('adds new note with generated fields', () => {
    const note = { title: 'Hello', content: 'World', tags: ['test'], images: [] }

    const saved = saveNote(note)

    expect(saved.id).toBeDefined()
    expect(saved.title).toBe('Hello')
    expect(saved.content).toBe('World')
    expect(saved.tags).toEqual(['test'])
    expect(saved.images).toEqual([])
    expect(saved.createdAt).toBeDefined()
    expect(saved.updatedAt).toBeDefined()

    const stored = getNotes()
    expect(stored).toHaveLength(1)
    expect(stored[0]).toEqual(saved)
  })

  it('updates existing note by id', () => {
    const existing = saveNote({ title: 'Original', content: '', tags: [], images: [] })
    const updated = saveNote({ id: existing.id, title: 'Updated', content: 'New', tags: ['x'], images: [] })

    expect(updated.id).toBe(existing.id)
    expect(updated.title).toBe('Updated')
    expect(getNotes()).toHaveLength(1)
  })
})

describe('deleteNote', () => {
  it('removes note by id', () => {
    const note = saveNote({ title: 'Delete me', content: '', tags: [], images: [] })
    deleteNote(note.id)
    expect(getNotes()).toHaveLength(0)
  })

  it('does nothing for non-existent id', () => {
    saveNote({ title: 'Keep', content: '', tags: [], images: [] })
    deleteNote('nonexistent')
    expect(getNotes()).toHaveLength(1)
  })
})

describe('getNote', () => {
  it('returns note by id', () => {
    const note = saveNote({ title: 'Find me', content: '', tags: [], images: [] })
    expect(getNote(note.id)).toEqual(note)
  })

  it('returns undefined for non-existent id', () => {
    expect(getNote('nonexistent')).toBeUndefined()
  })
})
