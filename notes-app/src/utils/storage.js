const STORAGE_KEY = 'notes-app-data'

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

  if (note.id) {
    const index = notes.findIndex(n => n.id === note.id)
    if (index !== -1) {
      notes[index] = { ...notes[index], ...note, updatedAt: now }
    }
  } else {
    note = {
      ...note,
      id: String(Date.now()),
      createdAt: now,
      updatedAt: now,
      images: note.images || [],
    }
    notes.unshift(note)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  return note
}

export function deleteNote(id) {
  const notes = getNotes().filter(n => n.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export function getNote(id) {
  return getNotes().find(n => n.id === id)
}
