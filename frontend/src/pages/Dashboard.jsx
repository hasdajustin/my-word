import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get("posts/")
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load your posts. Please try again.");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await API.delete(`posts/${slug}/`);
      // Remove from UI instantly
      setPosts((prev) => prev.filter((post) => post.slug !== slug));
    } catch (err) {
      console.error(err);
      alert("Delete failed. Please try again.");
    }
  };

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
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalPosts = posts.length;
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Posts</p>
                <p className="text-3xl font-bold text-purple-400">{totalPosts}</p>
              </div>
              <svg
                className="w-12 h-12 text-purple-500/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Views</p>
                <p className="text-3xl font-bold text-indigo-400">{totalViews}</p>
              </div>
              <svg
                className="w-12 h-12 text-indigo-500/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Create Post Button */}
        <div className="flex justify-end mb-6">
          <Link
            to="/create"
            className="inline-flex items-center px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition shadow-md"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Post
          </Link>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700">
            <svg
              className="mx-auto h-12 w-12 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-300">No posts yet</h3>
            <p className="mt-1 text-gray-500">
              Get started by creating your first post.
            </p>
            <Link
              to="/create"
              className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              Create Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800/30 rounded-xl border border-gray-700 p-4 hover:bg-gray-800/50 transition group"
              >
                <div className="flex flex-wrap gap-4">
                  {/* Image thumbnail if available */}
                  {post.image && (
                    <div className="flex-shrink-0 w-24 h-24">
                      <img
                        src={
                          post.image.startsWith("http")
                            ? post.image
                            : `http://127.0.0.1:8000${post.image}`
                        }
                        alt={post.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                      {post.content?.slice(0, 100)}...
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>Views: {post.views || 0}</span>
                      <span>
                        Created:{" "}
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 self-center">
                    <Link
                      to={`/post/${post.slug}`}
                      className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition"
                    >
                      View
                    </Link>
                    <Link
                      to={`/edit/${post.slug}`}
                      className="px-3 py-1.5 text-sm bg-indigo-600/50 hover:bg-indigo-600 text-indigo-200 rounded-lg transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.slug)}
                      className="px-3 py-1.5 text-sm bg-red-600/50 hover:bg-red-600 text-red-200 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}