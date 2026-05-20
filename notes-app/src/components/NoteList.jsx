import NoteCard from './NoteCard'
import EmptyState from './EmptyState'
import './NoteList.css'

export default function NoteList({ notes, searchTerm, selectedTag }) {
  let filtered = notes

  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase()
    filtered = filtered.filter(n =>
      n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    )
  }

  if (selectedTag) {
    filtered = filtered.filter(n => n.tags.includes(selectedTag))
  }

  if (notes.length === 0) {
    return <EmptyState />
  }

  if (filtered.length === 0) {
    return <EmptyState message="没有找到匹配的笔记" hint="试试换个搜索词或标签" />
  }

  return (
    <div className="note-list">
      {filtered.map(note => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  )
}
