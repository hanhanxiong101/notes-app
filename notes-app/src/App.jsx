import { useState, useCallback, useMemo } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { getNotes, saveNote, deleteNote } from './utils/storage'
import Header from './components/Header'
import TagFilter from './components/TagFilter'
import NoteList from './components/NoteList'
import NoteDetail from './components/NoteDetail'
import NoteEditor from './components/NoteEditor'
import './App.css'

export default function App() {
  const [notes, setNotes] = useState(getNotes)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  const allTags = useMemo(() => {
    const tagSet = new Set()
    notes.forEach(n => n.tags.forEach(t => tagSet.add(t)))
    return [...tagSet].sort()
  }, [notes])

  const handleSave = useCallback((note) => {
    saveNote(note)
    setNotes(getNotes())
  }, [])

  const handleDelete = useCallback((id) => {
    deleteNote(id)
    setNotes(getNotes())
  }, [])

  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term)
    setSelectedTag('')
  }, [])

  const handleSelectTag = useCallback((tag) => {
    setSelectedTag(tag)
    setSearchTerm('')
  }, [])

  return (
    <BrowserRouter>
      <div className="app">
        <Header searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        <Routes>
          <Route path="/" element={
            <>
              <TagFilter tags={allTags} selectedTag={selectedTag} onSelectTag={handleSelectTag} />
              <NoteList notes={notes} searchTerm={searchTerm} selectedTag={selectedTag} />
            </>
          } />
          <Route path="/note/:id" element={
            <NoteDetail notes={notes} onDelete={handleDelete} />
          } />
          <Route path="/edit/:id" element={
            <NoteEditor notes={notes} onSave={handleSave} />
          } />
          <Route path="/new" element={
            <NoteEditor notes={notes} onSave={handleSave} />
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
