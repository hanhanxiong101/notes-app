# 笔记应用 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个基于 React + Vite 的个人笔记应用，支持新建/编辑/删除笔记、搜索、标签筛选、图片上传，数据存于 localStorage。

**Architecture:** 单页应用，使用 React Router 管理三个页面（列表、详情、编辑）。全局状态（笔记数据、搜索词、选中标签）由 App 组件管理并通过 props 下传。localStorage 操作封装在独立工具模块中。

**Tech Stack:** React 19 + Vite, react-router-dom v6, 纯 CSS（温暖纸张风）, localStorage, vitest + @testing-library/react

**File Structure:**
```
notes-app/
├── src/
│   ├── main.jsx                          # 入口
│   ├── App.jsx                           # 路由 + 全局状态
│   ├── App.css                           # 布局样式
│   ├── index.css                         # CSS 变量 + 全局样式
│   ├── utils/
│   │   ├── storage.js                    # localStorage 封装
│   │   └── storage.test.js              # storage 单元测试
│   └── components/
│       ├── Header.jsx + Header.css       # 搜索框 + 新建按钮
│       ├── TagFilter.jsx + TagFilter.css # 标签筛选栏
│       ├── NoteCard.jsx + NoteCard.css   # 笔记卡片
│       ├── NoteList.jsx + NoteList.css   # 列表页
│       ├── NoteDetail.jsx + NoteDetail.css # 详情页
│       ├── NoteEditor.jsx + NoteEditor.css # 编辑页
│       └── EmptyState.jsx + EmptyState.css # 空状态
```

---

### Task 1: 初始化项目

**Files:**
- Create: `notes-app/` (整个项目目录)

- [ ] **Step 1: 用 Vite 创建 React 项目**

```bash
cd "C:/Users/CD/Desktop/AI work"
npm create vite@latest notes-app -- --template react
```

- [ ] **Step 2: 安装依赖**

```bash
cd "C:/Users/CD/Desktop/AI work/notes-app"
npm install
npm install react-router-dom
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 3: 配置 vitest**

修改 `vite.config.js`：

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.js',
  },
})
```

- [ ] **Step 4: 创建测试配置文件**

创建 `src/test-setup.js`：

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 5: 添加 test 脚本到 package.json**

在 `package.json` 的 `"scripts"` 中添加：

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6: 清理 Vite 默认文件**

删除 `src/App.css`（会被重写）和 `src/assets/` 目录。

- [ ] **Step 7: 创建目录结构**

```bash
mkdir -p src/utils src/components
```

- [ ] **Step 8: 启动开发服务器确认项目可用**

```bash
npm run dev
```
确认能在浏览器看到 Vite 默认页面，然后关闭。

- [ ] **Step 9: 提交**

```bash
git add -A && git commit -m "feat: scaffold Vite + React project with test setup"
```

---

### Task 2: CSS 变量与全局样式

**Files:**
- Create: `src/index.css`

- [ ] **Step 1: 写入全局 CSS**

`src/index.css`：

```css
:root {
  --bg-warm: #f5f0e8;
  --bg-card: #fffef9;
  --bg-header: #ede3d2;
  --text-primary: #4a3728;
  --text-secondary: #8b7355;
  --text-muted: #b8a58e;
  --accent: #8b7355;
  --accent-light: #c9a87c;
  --border: #d4c5b2;
  --shadow: 0 2px 8px rgba(139, 115, 85, 0.12);
  --radius: 8px;
  --font-serif: 'Georgia', 'Noto Serif SC', serif;
  --font-sans: 'Segoe UI', 'PingFang SC', sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  background-color: var(--bg-warm);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100vh;
}

h1, h2, h3 {
  font-family: var(--font-serif);
  color: var(--text-primary);
}

button {
  cursor: pointer;
  font-family: var(--font-sans);
}

input, textarea {
  font-family: var(--font-sans);
  outline: none;
}

a { text-decoration: none; color: inherit; }
```

- [ ] **Step 2: 在 main.jsx 中引入**

修改 `src/main.jsx`，在最顶部导入：

```jsx
import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 3: 提交**

```bash
git add -A && git commit -m "feat: add global CSS variables and warm paper theme"
```

---

### Task 3: localStorage 工具模块

**Files:**
- Create: `src/utils/storage.js`
- Create: `src/utils/storage.test.js`

- [ ] **Step 1: 写失败的测试**

`src/utils/storage.test.js`：

```js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getNotes, saveNote, deleteNote, getNote } from './storage.js'

const STORAGE_KEY = 'notes-app-data'

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
```

- [ ] **Step 2: 运行测试确认失败**

```bash
cd "C:/Users/CD/Desktop/AI work/notes-app" && npm test
```
预期：全部 FAIL（模块还不存在）

- [ ] **Step 3: 实现 storage.js**

`src/utils/storage.js`：

```js
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
```

- [ ] **Step 4: 运行测试确认通过**

```bash
npm test
```
预期：全部 PASS

- [ ] **Step 5: 提交**

```bash
git add -A && git commit -m "feat: add storage utility with CRUD operations"
```

---

### Task 4: EmptyState 组件

**Files:**
- Create: `src/components/EmptyState.jsx`
- Create: `src/components/EmptyState.css`

- [ ] **Step 1: 写组件**

`src/components/EmptyState.jsx`：

```jsx
import './EmptyState.css'

export default function EmptyState({ message, hint }) {
  return (
    <div className="empty-state" data-testid="empty-state">
      <div className="empty-state-icon">📝</div>
      <h3>{message || '还没有笔记'}</h3>
      <p>{hint || '点击上方按钮创建第一条笔记吧'}</p>
    </div>
  )
}
```

`src/components/EmptyState.css`：

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-state-icon { font-size: 48px; margin-bottom: 16px; }

.empty-state h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: var(--text-secondary);
}

.empty-state p {
  color: var(--text-muted);
  font-size: 14px;
}
```

- [ ] **Step 2: 提交**

```bash
git add -A && git commit -m "feat: add EmptyState component"
```

---

### Task 5: NoteCard 组件

**Files:**
- Create: `src/components/NoteCard.jsx`
- Create: `src/components/NoteCard.css`

- [ ] **Step 1: 写组件**

`src/components/NoteCard.jsx`：

```jsx
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
```

`src/components/NoteCard.css`：

```css
.note-card {
  display: block;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 4px solid var(--accent-light);
  border-radius: var(--radius);
  padding: 16px 20px;
  box-shadow: var(--shadow);
  transition: transform 0.15s, box-shadow 0.15s;
}

.note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(139, 115, 85, 0.2);
}

.note-card-meta {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.note-card-date {
  font-size: 12px;
  color: var(--text-muted);
}

.note-card-title {
  font-size: 18px;
  margin-bottom: 6px;
}

.note-card-preview {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 8px;
}

.note-card-images {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.note-card-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid var(--border);
}

.note-card-img-more {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 4px;
  background: var(--bg-header);
  font-size: 12px;
  color: var(--text-secondary);
}

.note-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.note-card-tag {
  font-size: 11px;
  background: var(--bg-header);
  color: var(--text-secondary);
  padding: 2px 8px;
  border-radius: 10px;
}
```

- [ ] **Step 2: 提交**

```bash
git add -A && git commit -m "feat: add NoteCard component"
```

---

### Task 6: Header 组件

**Files:**
- Create: `src/components/Header.jsx`
- Create: `src/components/Header.css`

- [ ] **Step 1: 写组件**

`src/components/Header.jsx`：

```jsx
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
```

`src/components/Header.css`：

```css
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: var(--bg-header);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
}

.app-logo {
  font-size: 22px;
  font-weight: normal;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-search {
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: 20px;
  font-size: 14px;
  background: var(--bg-card);
  color: var(--text-primary);
  width: 220px;
  transition: border-color 0.2s;
}

.header-search:focus {
  border-color: var(--accent);
}

.btn-new {
  padding: 8px 18px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s;
  white-space: nowrap;
}

.btn-new:hover {
  background: #7a6348;
}
```

- [ ] **Step 2: 提交**

```bash
git add -A && git commit -m "feat: add Header component with search and new button"
```

---

### Task 7: TagFilter 组件

**Files:**
- Create: `src/components/TagFilter.jsx`
- Create: `src/components/TagFilter.css`

- [ ] **Step 1: 写组件**

`src/components/TagFilter.jsx`：

```jsx
import './TagFilter.css'

export default function TagFilter({ tags, selectedTag, onSelectTag }) {
  if (tags.length === 0) return null

  return (
    <div className="tag-filter">
      <button
        className={`tag-filter-btn ${!selectedTag ? 'active' : ''}`}
        onClick={() => onSelectTag('')}
      >
        全部
      </button>
      {tags.map(tag => (
        <button
          key={tag}
          className={`tag-filter-btn ${selectedTag === tag ? 'active' : ''}`}
          onClick={() => onSelectTag(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
```

`src/components/TagFilter.css`：

```css
.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 24px;
}

.tag-filter-btn {
  padding: 4px 14px;
  border: 1px solid var(--border);
  border-radius: 16px;
  font-size: 13px;
  background: var(--bg-card);
  color: var(--text-secondary);
  transition: all 0.2s;
}

.tag-filter-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.tag-filter-btn.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
```

- [ ] **Step 2: 提交**

```bash
git add -A && git commit -m "feat: add TagFilter component"
```

---

### Task 8: NoteList 页面组件

**Files:**
- Create: `src/components/NoteList.jsx`
- Create: `src/components/NoteList.css`

- [ ] **Step 1: 写组件**

`src/components/NoteList.jsx`：

```jsx
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
```

`src/components/NoteList.css`：

```css
.note-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 24px;
  max-width: 680px;
  margin: 0 auto;
}
```

- [ ] **Step 2: 提交**

```bash
git add -A && git commit -m "feat: add NoteList page with search and tag filtering"
```

---

### Task 9: NoteDetail 页面组件

**Files:**
- Create: `src/components/NoteDetail.jsx`
- Create: `src/components/NoteDetail.css`

- [ ] **Step 1: 写组件**

`src/components/NoteDetail.jsx`：

```jsx
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
```

`src/components/NoteDetail.css`：

```css
.note-detail {
  max-width: 680px;
  margin: 0 auto;
  padding: 20px 24px;
}

.note-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.btn-back {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 14px;
  padding: 4px 0;
}

.btn-back:hover { text-decoration: underline; }

.note-detail-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.note-detail-date {
  font-size: 12px;
  color: var(--text-muted);
}

.btn-edit, .btn-delete {
  padding: 6px 16px;
  border-radius: var(--radius);
  font-size: 13px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-secondary);
  transition: all 0.2s;
}

.btn-edit:hover { border-color: var(--accent); color: var(--accent); }
.btn-delete:hover { border-color: #c0392b; color: #c0392b; }

.note-detail-title {
  font-size: 24px;
  margin-bottom: 12px;
}

.note-detail-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.note-detail-tag {
  font-size: 12px;
  background: var(--bg-header);
  color: var(--text-secondary);
  padding: 3px 12px;
  border-radius: 12px;
}

.note-detail-content {
  font-size: 16px;
  line-height: 1.8;
  white-space: pre-wrap;
  margin-bottom: 20px;
}

.note-detail-images {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.note-detail-img {
  max-width: 300px;
  max-height: 300px;
  object-fit: contain;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

/* Confirm dialog */
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.confirm-dialog {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 24px;
  max-width: 360px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

.confirm-dialog h3 { margin-bottom: 8px; }
.confirm-dialog p { color: var(--text-secondary); font-size: 14px; margin-bottom: 20px; }

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel {
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 14px;
}

.btn-confirm-delete {
  padding: 8px 16px;
  border: none;
  border-radius: var(--radius);
  background: #c0392b;
  color: #fff;
  font-size: 14px;
}
```

- [ ] **Step 2: 提交**

```bash
git add -A && git commit -m "feat: add NoteDetail page with delete confirmation"
```

---

### Task 10: NoteEditor 页面组件

**Files:**
- Create: `src/components/NoteEditor.jsx`
- Create: `src/components/NoteEditor.css`

- [ ] **Step 1: 写组件**

`src/components/NoteEditor.jsx`：

```jsx
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './NoteEditor.css'

const MAX_IMAGE_SIZE = 500 * 1024 // 500KB

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
```

`src/components/NoteEditor.css`：

```css
.note-editor {
  max-width: 680px;
  margin: 0 auto;
  padding: 20px 24px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-save {
  padding: 8px 20px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 600;
}

.btn-save:hover { background: #7a6348; }

.editor-title {
  width: 100%;
  padding: 12px 16px;
  font-size: 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: var(--font-serif);
  margin-bottom: 12px;
}

.editor-title:focus { border-color: var(--accent); }

.editor-content {
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-card);
  color: var(--text-primary);
  resize: vertical;
  line-height: 1.7;
  margin-bottom: 16px;
}

.editor-content:focus { border-color: var(--accent); }

.editor-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
  align-items: center;
}

.editor-img-wrap {
  position: relative;
}

.editor-img-preview {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--border);
}

.editor-img-remove {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #c0392b;
  color: #fff;
  border: none;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.editor-img-add {
  width: 80px;
  height: 80px;
  border: 2px dashed var(--border);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text-muted);
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s;
}

.editor-img-add:hover { border-color: var(--accent); color: var(--accent); }

.editor-error {
  color: #c0392b;
  font-size: 13px;
  margin-bottom: 12px;
}

.editor-tags-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.editor-label {
  font-size: 14px;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.editor-tags-input {
  flex: 1;
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 14px;
  background: var(--bg-card);
  color: var(--text-primary);
}

.editor-tags-input:focus { border-color: var(--accent); }
```

- [ ] **Step 2: 提交**

```bash
git add -A && git commit -m "feat: add NoteEditor page with image upload"
```

---

### Task 11: App 组件 — 路由与数据流

**Files:**
- Modify: `src/App.jsx`
- Create: `src/App.css`
- Modify: `src/main.jsx`

- [ ] **Step 1: 写 App.jsx**

`src/App.jsx`：

```jsx
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
    const updated = saveNote(note)
    setNotes(getNotes())
    return updated
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
```

`src/App.css`：

```css
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
```

- [ ] **Step 2: 确认 main.jsx 正确**

`src/main.jsx` 应包含 BrowserRouter（已在 App 中处理，直接渲染 App）。

- [ ] **Step 3: 启动开发服务器验证**

```bash
npm run dev
```

在浏览器中测试：新建笔记、查看列表、编辑、删除、搜索、标签筛选、图片上传。

- [ ] **Step 4: 提交**

```bash
git add -A && git commit -m "feat: wire up App with routing and data flow"
```

---

### Task 12: 最终验证与修复

- [ ] **Step 1: 运行全部测试**

```bash
cd "C:/Users/CD/Desktop/AI work/notes-app" && npm test
```
预期：全部通过

- [ ] **Step 2: 手动功能测试清单**

在浏览器中完成：
- [ ] 新建笔记，保存后出现在列表
- [ ] 点击笔记进入详情
- [ ] 编辑笔记，保存后内容更新
- [ ] 删除笔记，确认框后删除
- [ ] 搜索框输入关键词，列表实时过滤
- [ ] 点击标签筛选
- [ ] 上传图片（小于 500KB），预览和删除功能正常
- [ ] 无笔记时显示空状态
- [ ] 搜索无结果时显示友好提示

- [ ] **Step 3: 修复发现的问题并提交**

---

## Self-Review Checklist

1. **Spec coverage:** 所有设计文档中的需求都有对应任务实现
2. **Placeholder scan:** 无 TBD、TODO 或占位符
3. **Type consistency:** 各组件之间的 props 接口一致，`note` 对象字段与 storage.js 一致
