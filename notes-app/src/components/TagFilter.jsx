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
