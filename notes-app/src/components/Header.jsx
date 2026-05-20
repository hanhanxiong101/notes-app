import { useNavigate } from 'react-router-dom'
import './Header.css'

export default function Header({ searchTerm, onSearchChange }) {
  const navigate = useNavigate()

  return (
    <header className="app-header">
      <h1 className="app-logo">📒 我的笔记</h1>
      <div className="header-right">
        <input
          className="header-search"
          type="text"
          placeholder="搜索笔记..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
        />
        <button className="btn-new" onClick={() => navigate('/new')}>
          + 新建
        </button>
      </div>
    </header>
  )
}
