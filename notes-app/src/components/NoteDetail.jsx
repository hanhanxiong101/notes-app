import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import EmptyState from './EmptyState'
import './NoteDetail.css'

export default function NoteDetail({ notes, onDelete }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)

  const note = notes.find(n => n.id === id)

  if (!note) {
    return <EmptyState message="笔记不存在" hint="它可能已被删除" />
  }

  const handleDelete = () => {
    onDelete(id)
    navigate('/')
  }

  return (
    <div className="note-detail">
      <div className="note-detail-header">
        <button className="btn-back" onClick={() => navigate('/')}>← 返回</button>
        <div className="note-detail-actions">
          <span className="note-detail-date">创建于 {note.createdAt} | 修改于 {note.updatedAt}</span>
          <button className="btn-edit" onClick={() => navigate(`/edit/${note.id}`)}>编辑</button>
          <button className="btn-delete" onClick={() => setShowConfirm(true)}>删除</button>
        </div>
      </div>

      <article>
        <h1 className="note-detail-title">{note.title || '（无标题）'}</h1>

        {note.tags.length > 0 && (
          <div className="note-detail-tags">
            {note.tags.map(tag => <span key={tag} className="note-detail-tag">{tag}</span>)}
          </div>
        )}

        <div className="note-detail-content">
          {note.content || '（空内容）'}
        </div>

        {note.images && note.images.length > 0 && (
          <div className="note-detail-images">
            {note.images.map((img, i) => (
              <img key={i} src={img} alt={`图片 ${i + 1}`} className="note-detail-img" />
            ))}
          </div>
        )}
      </article>

      {showConfirm && (
        <div className="confirm-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>删除后无法恢复，确定要删除这条笔记吗？</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowConfirm(false)}>取消</button>
              <button className="btn-confirm-delete" onClick={handleDelete}>确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
