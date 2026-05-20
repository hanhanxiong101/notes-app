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
