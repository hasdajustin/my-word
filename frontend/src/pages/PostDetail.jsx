import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get(`posts/${slug}/`)
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
        setError("Failed to load the post. Please try again.");
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-purple-400 text-sm font-medium">Loading</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="bg-red-900/20 border border-red-500 rounded-xl p-8 text-center max-w-md backdrop-blur-sm">
          <svg
            className="w-12 h-12 text-red-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-400 font-medium">{error}</p>
          <Link
            to="/"
            className="mt-4 inline-block px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  if (!post) return null; // shouldn't happen due to error handling

  const imageUrl = post.image?.startsWith("http")
    ? post.image
    : `http://127.0.0.1:8000${post.image}`;

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Post header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">
            {post.title}
          </h1>
          <div className="flex items-center text-gray-400 text-sm gap-4 border-b border-gray-700 pb-4 mt-4">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              By Author
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {post.views} Views
            </span>
          </div>
        </header>

        {/* Featured image */}
        {post.image && (
          <figure className="mb-10">
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-auto rounded-2xl shadow-xl border border-gray-700 object-cover max-h-[500px]"
            />
          </figure>
        )}

        {/* Post content */}
        <article className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-line">
          {post.content}
        </article>
      </div>
    </div>
  );
}