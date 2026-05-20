import { Link } from 'react-router-dom'
import './NoteCard.css'

export default function NoteCard({ note }) {
  const preview = note.content
    ? note.content.slice(0, 80) + (note.content.length > 80 ? '...' : '')
    : '（空内容）'

  const hasImages = note.images && note.images.length > 0

  return (
    <Link to={`/note/${note.id}`} className="note-card">
      <div className="note-card-meta">
        <span className="note-card-date">{note.createdAt}</span>
      </div>
      <h3 className="note-card-title">{note.title || '（无标题）'}</h3>
      <p className="note-card-preview">{preview}</p>
      {hasImages && (
        <div className="note-card-images">
          {note.images.slice(0, 3).map((img, i) => (
            <img key={i} src={img} alt="" className="note-card-thumb" />
          ))}
          {note.images.length > 3 && <span className="note-card-img-more">+{note.images.length - 3}</span>}
        </div>
      )}
      {note.tags.length > 0 && (
        <div className="note-card-tags">
          {note.tags.map(tag => (
            <span key={tag} className="note-card-tag">{tag}</span>
          ))}
        </div>
      )}
    </Link>
  )
}
