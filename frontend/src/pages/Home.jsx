import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import PostCard from "../components/PostCard";

export default function Home() {
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
                setError("Failed to load posts. Please try again later.");
                setLoading(false);
            });
    }, []);

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

    const featuredPost = posts[0];
    const remainingPosts = posts.slice(1);

    return (
        <div className="bg-gray-900 min-h-screen text-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {featuredPost && (
                    <div className="grid lg:grid-cols-3 gap-8 mb-16">
                        <FeaturedPost post={featuredPost} />
                        <Sidebar recentPosts={remainingPosts.slice(0, 3)} />
                    </div>
                )}
                {remainingPosts.length > 0 ? (
                    <LatestStories posts={remainingPosts} />
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
}


function FeaturedPost({ post }) {
    return (
        <div className="lg:col-span-2 group">
            <div className="relative rounded-2xl overflow-hidden bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                <img
                    src={post.image || "https://via.placeholder.com/1200x600?text=Featured"}
                    alt={post.title}
                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-gray-900 to-transparent">
                    <div className="inline-block px-3 py-1 rounded-full bg-purple-600 text-xs font-semibold mb-3">
                        Featured
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">{post.title}</h2>
                    <p className="text-gray-300 line-clamp-2">
                        {post.content?.slice(0, 120)}...
                    </p>
                    <Link
                        to={`/post/${post.slug}`}
                        className="inline-flex items-center mt-4 text-purple-400 hover:text-purple-300 font-medium transition"
                    >
                        Read more
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function Sidebar({ recentPosts }) {
    const topics = ["Technology", "Design", "Inspiration", "Tutorials", "News"];

    return (
        <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
                Popular Topics
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
                {topics.map((tag) => (
                    <span
                        key={tag}
                        className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300 hover:bg-purple-600 hover:text-white cursor-pointer transition"
                    >
                        #{tag}
                    </span>
                ))}
            </div>
            <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
                Recent Posts
            </h3>
            <ul className="space-y-3">
                {recentPosts.map((post) => (
                    <li key={post.id}>
                        <Link to={`/post/${post.slug}`} className="block hover:text-purple-400 transition">
                            <p className="font-medium">{post.title}</p>
                            <p className="text-sm text-gray-400 line-clamp-1">
                                {post.content?.slice(0, 60)}...
                            </p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function LatestStories({ posts }) {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 9; // 3x3 grid
    const totalPages = Math.ceil(posts.length / postsPerPage);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const goToPage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const nextPage = () => {
        if (currentPage < totalPages) goToPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) goToPage(currentPage - 1);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [posts.length]);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Latest Stories</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-12">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
                    >
                        Previous
                    </button>

                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`px-4 py-2 rounded-lg transition ${currentPage === page
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

// Empty State Component
function EmptyState() {
    return (
        <div className="text-center py-12">
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
            <h3 className="mt-2 text-lg font-medium text-gray-300">No more posts</h3>
            <p className="mt-1 text-gray-500">Check back later for new content.</p>
        </div>
    );
}