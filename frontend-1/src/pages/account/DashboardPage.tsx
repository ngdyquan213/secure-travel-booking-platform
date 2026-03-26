import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  pageDirectoryItems,
  stitchPages,
  type StitchPageDefinition,
} from '@/shared/config/stitchPages'

type QuickAction = {
  actionLabel: string
  description: string
  title: string
  to: string
}

type WorkspaceGroup = {
  description: string
  items: StitchPageDefinition[]
  key: string
  kicker: string
  title: string
  tone: 'ocean' | 'sand' | 'sky'
}

const accountPages = pageDirectoryItems.filter((item) => item.category === 'Account')
const detailRouteCount = accountPages.filter((item) => item.path.includes(':')).length
const workspaceRouteCount = accountPages.length - detailRouteCount - 1

const quickActions: QuickAction[] = [
  {
    title: 'Complete your traveler setup',
    description:
      'Review profile details, travelers, and core identity information before your next booking.',
    actionLabel: 'Open profile',
    to: stitchPages.profile.href,
  },
  {
    title: 'Track upcoming trips',
    description:
      'Jump straight into bookings to review confirmations, payment status, and itinerary details.',
    actionLabel: 'View bookings',
    to: stitchPages.bookings.href,
  },
  {
    title: 'Prepare documents early',
    description:
      'Keep passports and supporting files ready so approvals do not block departure later.',
    actionLabel: 'Manage documents',
    to: stitchPages.documents.href,
  },
  {
    title: 'Resolve changes quickly',
    description:
      'Use refunds, notifications, and support together when a booking needs attention.',
    actionLabel: 'Get support',
    to: stitchPages.support.href,
  },
]

const workspaceGroups: WorkspaceGroup[] = [
  {
    key: 'identity',
    kicker: 'Foundation',
    title: 'Keep your traveler profile ready to go',
    description:
      'Everything tied to identity, companions, and travel paperwork lives together here.',
    tone: 'ocean',
    items: [stitchPages.profile, stitchPages.travelers, stitchPages.documents],
  },
  {
    key: 'trip-control',
    kicker: 'Trips',
    title: 'Move from booking overview to trip fulfillment',
    description:
      'Follow the main path from bookings into detail views and voucher delivery without hunting for routes.',
    tone: 'sand',
    items: [stitchPages.bookings, stitchPages.bookingDetail, stitchPages.vouchers],
  },
  {
    key: 'service-lane',
    kicker: 'Aftercare',
    title: 'Stay informed and handle post-booking issues',
    description:
      'Refund flows, alerts, and support requests now feel like one service lane instead of scattered pages.',
    tone: 'sky',
    items: [
      stitchPages.refunds,
      stitchPages.refundDetail,
      stitchPages.notifications,
      stitchPages.support,
    ],
  },
]

const spotlightCards = [
  {
    kicker: 'Start here',
    title: 'Profile, travelers, and documents',
    description: 'Set up who is traveling and make sure the paperwork side is not a last-minute scramble.',
  },
  {
    kicker: 'Most used',
    title: 'Bookings and vouchers',
    description: 'Keep the core trip flow in one lane, from confirmation review to voucher download.',
  },
  {
    kicker: 'Safety net',
    title: 'Refunds, alerts, and support',
    description: 'When plans shift, the recovery path is visible instead of buried in a page list.',
  },
]

const cardBadgeLabel = (item: StitchPageDefinition) =>
  item.path.includes(':') ? 'Sample drill-down' : 'Core page'

const cardActionLabel = (item: StitchPageDefinition) =>
  item.path.includes(':') ? 'Open sample view' : 'Open page'

export function DashboardPage() {
  useEffect(() => {
    document.title = 'Account Hub | TravelBook'
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  return (
    <main className="account-hub">
      <section className="account-hero">
        <div className="account-hero-copy">
          <p className="account-kicker">Account workspace</p>
          <h1>Your travel control center looks like a product now, not a route catalog.</h1>
          <p className="account-hero-text">
            After sign-in, this dashboard gives clearer entry points into the account journey instead of
            dropping everything into one repetitive grid of pages.
          </p>
          <div className="account-hero-actions">
            <Link className="solid-button" to={stitchPages.bookings.href}>
              Open bookings
            </Link>
            <Link className="ghost-button account-hero-ghost" to={stitchPages.profile.href}>
              Complete profile
            </Link>
          </div>
          <div className="account-chip-list">
            <span className="account-chip-stat">{accountPages.length} account routes</span>
            <span className="account-chip-stat">{workspaceRouteCount} working pages</span>
            <span className="account-chip-stat">{detailRouteCount} drill-down views</span>
          </div>
        </div>

        <div className="account-hero-panels">
          {spotlightCards.map((card) => (
            <article key={card.title} className="account-spotlight-card">
              <p className="account-card-kicker">{card.kicker}</p>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="account-quick-section">
        <div className="account-section-heading">
          <div>
            <p className="account-kicker">Quick actions</p>
            <h2>Common starting points after login</h2>
          </div>
          <p className="account-section-text">
            These are the actions people usually want first, so they should not be hidden in a wall of cards.
          </p>
        </div>

        <div className="account-quick-grid">
          {quickActions.map((action) => (
            <article key={action.title} className="account-quick-card">
              <h3>{action.title}</h3>
              <p>{action.description}</p>
              <Link className="subtle-link" to={action.to}>
                {action.actionLabel}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {workspaceGroups.map((group) => (
        <section
          key={group.key}
          className={`account-workspace-section account-workspace-section--${group.tone}`}
        >
          <div className="account-section-heading">
            <div>
              <p className="account-kicker">{group.kicker}</p>
              <h2>{group.title}</h2>
            </div>
            <p className="account-section-text">{group.description}</p>
          </div>

          <div className="account-link-grid">
            {group.items.map((item, index) => (
              <article
                key={item.path}
                className={`account-link-card${index === 0 ? ' account-link-card--featured' : ''}`}
              >
                <div className="account-link-card-top">
                  <span className="account-link-badge">{cardBadgeLabel(item)}</span>
                  <span className="account-link-route">{item.href}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="account-link-actions">
                  <Link className="solid-button" to={item.href}>
                    {cardActionLabel(item)}
                  </Link>
                  <a
                    className="subtle-link"
                    href={item.source}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Source HTML
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="account-source-strip">
        <div>
          <p className="account-card-kicker">Reference</p>
          <h2>Keep the original stitched dashboard close, but out of the spotlight.</h2>
          <p className="account-section-text">
            The exported HTML preview is still available whenever you need to compare against the source version.
          </p>
        </div>
        <div className="account-source-actions">
          <a
            className="ghost-button"
            href={stitchPages.accountDashboard.source}
            rel="noreferrer"
            target="_blank"
          >
            Open source HTML
          </a>
          <Link className="subtle-link" to="/pages">
            Browse page library
          </Link>
        </div>
      </section>
    </main>
  )
}
