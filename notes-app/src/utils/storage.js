export const STORAGE_KEY = 'notes-app-data'

export function getNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveNote(note) {
  const notes = getNotes()
  const now = new Date().toISOString().split('T')[0]

  if (note.id != null) {
    const index = notes.findIndex(n => n.id === note.id)
    if (index !== -1) {
      notes[index] = { ...notes[index], ...note, updatedAt: now }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
      return notes[index]
    }
  }

  const newNote = {
    ...note,
    id: note.id || String(Date.now()),
    createdAt: now,
    updatedAt: now,
    images: note.images || [],
  }
  notes.unshift(newNote)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  return newNote
}

export function deleteNote(id) {
  const notes = getNotes().filter(n => n.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export function getNote(id) {
  return getNotes().find(n => n.id === id)
}
