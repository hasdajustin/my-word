import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const imageUrl = post.image?.startsWith("http") 
    ? post.image : `http://127.0.0.1:8000${post.image}`;

  return (
    <div className="border border-slate-200 rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow p-0 bg-white">
      {post.image ? (
        <img 
          src={imageUrl} 
          alt={post.title} 
          className="h-48 w-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; }} 
        />
      ) : (
        <div className="h-48 w-full bg-slate-100 flex items-center justify-center text-slate-400">
          No Image
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl font-bold text-slate-800 mb-1 line-clamp-1">
          {post.title}
        </h2>
        
        <div className="flex justify-between items-center text-sm text-slate-500 mb-4">
          <span>👁️ {post.views} Views</span>
        </div>

        <Link 
          to={`/post/${post.slug}`} 
          className="block text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Read Full Article
        </Link>
      </div>
    </div>
  );
}
