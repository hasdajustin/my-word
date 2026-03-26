import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function EditPost() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        image: null,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);

    // Fetch post data when component mounts
    useEffect(() => {
        API.get(`posts/${slug}/`)
            .then((res) => {
                setFormData({
                    title: res.data.title,
                    content: res.data.content,
                    image: null, // will handle separately
                });
                setCurrentImage(res.data.image);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load post. Please try again.");
                setLoading(false);
            });
    }, [slug]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setFormData((prev) => ({ ...prev, image: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        // Prepare data – if you need to send as multipart/form-data for image
        const data = new FormData();
        data.append("title", formData.title);
        data.append("content", formData.content);
        if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            await API.put(`posts/${slug}/`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate(`/post/${slug}`); // redirect to post detail page after success
        } catch (err) {
            setError("Failed to update post. Please check your inputs and try again.");
            setSaving(false);
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

    return (
        <div className="bg-gray-900 min-h-screen text-gray-100">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Edit Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
                            placeholder="Enter post title"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                            Content
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            rows="12"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
                            placeholder="Write your post content here..."
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Featured Image
                        </label>
                        {currentImage && !formData.image && (
                            <div className="mb-3">
                                <p className="text-sm text-gray-400 mb-2">Current image:</p>
                                <img
                                    src={currentImage.startsWith("http") ? currentImage : `http://127.0.0.1:8000${currentImage}`}
                                    alt="Current"
                                    className="h-32 w-auto object-cover rounded-lg border border-gray-700"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Leave empty to keep the current image.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/post/${slug}`)}
                            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg transition"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 text-center">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}