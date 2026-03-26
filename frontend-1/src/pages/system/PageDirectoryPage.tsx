import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  categoryOrder,
  pageDirectoryItems,
  type StitchPageDefinition,
} from '@/shared/config/stitchPages'

const groupByCategory = (category: StitchPageDefinition['category']) =>
  pageDirectoryItems.filter((item) => item.category === category)

export function PageDirectoryPage() {
  useEffect(() => {
    document.title = 'TravelBook Page Directory'
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  return (
    <main className="directory-page">
      <section className="directory-hero">
        <span className="directory-kicker">frontend-1 stitch pages</span>
        <h1>Page Directory</h1>
        <p>
          Mỗi page trong `frontend-1` giờ đã có file riêng theo đúng cây thư mục.
          Bên dưới là route thật để mở từng screen Stitch.
        </p>
        <div className="directory-actions">
          <Link className="solid-button" to="/">
            Open Home
          </Link>
          <Link className="ghost-button" to="/admin">
            Open Admin
          </Link>
        </div>
      </section>

      {categoryOrder.map((category) => {
        const items = groupByCategory(category)
        if (items.length === 0) {
          return null
        }

        return (
          <section key={category} className="directory-section">
            <div className="directory-section-header">
              <div>
                <p className="directory-section-kicker">{category}</p>
                <h2>{items.length} page</h2>
              </div>
            </div>

            <div className="directory-grid">
              {items.map((item) => (
                <article key={item.path} className="directory-card">
                  <div className="directory-card-top">
                    <span className="directory-chip">{item.category}</span>
                    <code>{item.slug}</code>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <dl className="directory-meta">
                    <div>
                      <dt>Route</dt>
                      <dd>
                        <code>{item.path}</code>
                      </dd>
                    </div>
                    <div>
                      <dt>Preview</dt>
                      <dd>
                        <code>{item.href}</code>
                      </dd>
                    </div>
                  </dl>
                  <div className="directory-actions">
                    <Link className="solid-button" to={item.href}>
                      Open Page
                    </Link>
                    <a
                      className="ghost-button"
                      href={item.source}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Raw HTML
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}
