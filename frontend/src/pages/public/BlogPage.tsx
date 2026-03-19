import { Link } from 'react-router-dom'
import { CalendarDays, Clock3, Search } from 'lucide-react'
import { useState } from 'react'
import { SectionHero } from '../../components/SectionHero'
import { blogPosts } from '../../data/publicContent'

const categories = ['All', ...new Set(blogPosts.map((post) => post.category))]

export function BlogPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredPosts = blogPosts.filter((post) => {
    const query = search.trim().toLowerCase()
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory
    const matchesSearch =
      query.length === 0 ||
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query)

    return matchesCategory && matchesSearch
  })

  return (
    <>
      <SectionHero
        title="Travel Stories, Ideas, and Useful Planning Advice"
        subtitle="Browse destination notes, practical booking tips, and short reads for smoother trips."
      />

      <section className="bg-white py-16">
        <div className="container-custom space-y-8">
          <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-gray-50 p-6 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search article titles or excerpts"
                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const isActive = category === activeCategory

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-blue-50'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>{filteredPosts.length} articles available</p>
            <p>Editorially curated mock content from `frontend-test`</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img src={post.image} alt={post.title} className="h-56 w-full object-cover" />
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                    <span>{post.category}</span>
                    <span>{post.author}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
                  <p className="text-gray-600">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      {post.readTime} min read
                    </span>
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Read article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
