import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { stitchPages, type StitchPageDefinition } from '@/shared/config/stitchPages'
import { syncMockStateFromPath } from '@/shared/mock/stitchMockStore'
import { StitchFrame } from '@/shared/ui/StitchFrame'

type StitchPageProps = {
  definition: StitchPageDefinition
}

export function StitchPage({ definition }: StitchPageProps) {
  const location = useLocation()

  useEffect(() => {
    document.title = `${definition.title} | TravelBook`
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [definition.title])

  useEffect(() => {
    syncMockStateFromPath(location.pathname)
  }, [location.pathname])

  const quickLinks =
    definition.category === 'Account'
      ? [
          ...(definition.href !== stitchPages.accountDashboard.href
            ? [{ label: 'Account Hub', to: stitchPages.accountDashboard.href }]
            : []),
          { label: 'Page Library', to: '/pages' },
        ]
      : definition.category === 'Admin'
        ? [
            ...(definition.href !== stitchPages.adminDashboard.href
              ? [{ label: 'Admin Hub', to: stitchPages.adminDashboard.href }]
              : []),
            { label: 'Page Library', to: '/pages' },
          ]
        : [
            ...(definition.href !== '/' ? [{ label: 'Home', to: '/' }] : []),
            { label: 'Page Library', to: '/pages' },
          ]

  return (
    <main className="stitch-page-shell">
      <div className="page-dock">
        <div className="page-dock-meta">
          <p className="page-dock-label">{definition.category}</p>
          <strong>{definition.title}</strong>
          <p className="page-dock-description">{definition.description}</p>
          <span className="page-dock-route">{definition.path}</span>
        </div>
        <div className="page-dock-actions">
          {quickLinks.map((link) => (
            <Link key={link.to} className="ghost-button" to={link.to}>
              {link.label}
            </Link>
          ))}
          <a
            className="solid-button"
            href={definition.source}
            rel="noreferrer"
            target="_blank"
          >
            Source HTML
          </a>
        </div>
      </div>

      <StitchFrame
        definition={definition}
        src={definition.source}
        title={definition.title}
      />
    </main>
  )
}
