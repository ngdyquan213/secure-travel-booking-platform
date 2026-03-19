import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Clock3 } from 'lucide-react'
import { blogPosts } from '../../data/publicContent'

export function BlogDetailPage() {
  const { id } = useParams<{ id: string }>()
  const post = blogPosts.find((entry) => entry.id === id)

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  const relatedPosts = blogPosts.filter((entry) => entry.id !== post.id).slice(0, 3)

  return (
    <section className="bg-white py-16">
      <div className="container-custom space-y-10">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        <article className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm">
          <img src={post.image} alt={post.title} className="h-72 w-full object-cover md:h-[28rem]" />
          <div className="space-y-6 p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
              <span>{post.category}</span>
              <span>{post.author}</span>
            </div>
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {post.readTime} min read
              </span>
            </div>
            <div className="space-y-4 text-lg leading-8 text-gray-700">
              {post.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>

        <div className="rounded-[2rem] bg-gray-900 px-8 py-10 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Next Step</p>
          <h2 className="mt-3 text-3xl font-bold">Turn inspiration into a plan.</h2>
          <p className="mt-3 max-w-2xl text-gray-300">
            Explore flights, stays, and tours from the main TravelBook experience when you are ready to book.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/services" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-900">
              Explore services
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white"
            >
              Contact support
            </Link>
          </div>
        </div>

        <section className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Related Articles</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">Keep reading</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedPosts.map((entry) => (
              <Link
                key={entry.id}
                to={`/blog/${entry.id}`}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">{entry.category}</p>
                <h3 className="mt-4 text-xl font-bold text-gray-900">{entry.title}</h3>
                <p className="mt-3 text-sm text-gray-600">{entry.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
