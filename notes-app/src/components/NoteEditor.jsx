import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './NoteEditor.css'

const MAX_IMAGE_SIZE = 500 * 1024

export default function NoteEditor({ notes, onSave }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [images, setImages] = useState([])
  const [error, setError] = useState('')

  const editingNote = id ? notes.find(n => n.id === id) : null

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title)
      setContent(editingNote.content)
      setTags(editingNote.tags.join(', '))
      setImages(editingNote.images || [])
    }
  }, [id])

  const handleImageAdd = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > MAX_IMAGE_SIZE) {
      setError('图片大小不能超过 500KB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImages(prev => [...prev, reader.result])
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    const tagList = tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    onSave({
      id: editingNote?.id,
      title: title.trim() || '',
      content: content.trim() || '',
      tags: tagList,
      images,
    })

    navigate('/')
  }

  return (
    <div className="note-editor">
      <div className="editor-header">
        <button className="btn-back" onClick={() => navigate(-1)}>← 返回</button>
        <button className="btn-save" onClick={handleSubmit}>保存笔记</button>
      </div>

      <input
        className="editor-title"
        type="text"
        placeholder="笔记标题..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        autoFocus
      />

      <textarea
        className="editor-content"
        placeholder="写下你的想法..."
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={12}
      />

      <div className="editor-images">
        {images.map((img, i) => (
          <div key={i} className="editor-img-wrap">
            <img src={img} alt="" className="editor-img-preview" />
            <button className="editor-img-remove" onClick={() => handleRemoveImage(i)}>×</button>
          </div>
        ))}
        <button className="editor-img-add" onClick={() => fileInputRef.current.click()}>
          + 添加图片
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageAdd}
        />
      </div>

      {error && <p className="editor-error">{error}</p>}

      <div className="editor-tags-section">
        <label className="editor-label">标签</label>
        <input
          className="editor-tags-input"
          type="text"
          placeholder="用逗号分隔，如：学习, React, 笔记"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
      </div>
    </div>
  )
}
