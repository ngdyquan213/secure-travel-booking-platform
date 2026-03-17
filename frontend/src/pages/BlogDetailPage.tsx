import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, User, ChevronLeft, Share2, ArrowRight } from 'lucide-react';
import { getBlogPost, blogPosts } from '../data/blogPosts';

export function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = id ? getBlogPost(id) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Get related posts (same category, different post)
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <>
      {/* Header with Back Button */}
      <div className="bg-gray-900 text-white py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-sm text-gray-400">Blog</span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-96 overflow-hidden bg-gray-200">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Main Content */}
      <article className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Meta Information */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 flex-wrap">
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {post.readTime} min read
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <User className="w-4 h-4" />
              {post.author}
            </div>
            <span className="text-sm text-gray-600">{new Date(post.date).toLocaleDateString()}</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold text-gray-900 mb-8">{post.title}</h1>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {post.content.split('\n').map((paragraph, idx) => {
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={idx} className="text-3xl font-bold text-gray-900 mt-8 mb-4">
                    {paragraph.slice(2)}
                  </h1>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-2xl font-bold text-gray-900 mt-6 mb-3">
                    {paragraph.slice(3)}
                  </h2>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <li key={idx} className="text-gray-700 ml-6 mb-2">
                    {paragraph.slice(2)}
                  </li>
                );
              }
              if (paragraph.trim() === '') {
                return <div key={idx} className="mb-4" />;
              }
              return (
                <p key={idx} className="text-gray-700 mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Share & Author */}
          <div className="border-t border-b border-gray-200 py-6 mb-12 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Written by</p>
              <p className="font-semibold text-gray-900">{post.author}</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              <Share2 className="w-4 h-4" />
              Share Article
            </button>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.id}`}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
                  >
                    <div className="h-40 overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {relatedPost.category}
                      </span>
                      <h3 className="font-bold text-gray-900 mt-3 mb-2 group-hover:text-blue-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">{relatedPost.excerpt}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-600">{relatedPost.readTime} min</span>
                        <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to book your trip?</h3>
            <p className="text-gray-600 mb-6">
              Start exploring flights, hotels, and tours on TravelBook.
            </p>
            <Link
              to="/flights"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Booking <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
