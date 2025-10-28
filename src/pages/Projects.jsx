import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PostsAPI } from '../api/posts';

export default function Projects() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await PostsAPI.list(); // Uses your existing list() method
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-gray-400">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      
      {posts.length === 0 ? (
        <p className="text-gray-400">No projects yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              to={`/projects/${post.slug}`}
              className="group"
            >
              <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
                {post.heroImage && (
                  <img 
                    src={post.heroImage} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-green-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Updated {new Date(post.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}