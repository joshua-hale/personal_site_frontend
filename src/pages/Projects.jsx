import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PostsAPI } from '../api/posts';

function TypedText({ text, speed = 50, className = "" }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setShown(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <span className={className}>
      {shown}
      <span className="inline-block w-[0.6ch] -translate-y-px animate-[blink_1s_steps(2,start)_infinite]">▌</span>
    </span>
  );
}

export default function Projects() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await PostsAPI.list();
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
        <p className="text-text-muted">Loading projects...</p>
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
      <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-accent mb-10 text-center">
        <TypedText text="Projects" speed={75} />
      </h1>
      
      {posts.length === 0 ? (
        <p className="text-text-muted">No projects yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              to={`/projects/${post.slug}`}
              className="group"
            >
              <div className="bg-black overflow-hidden hover:opacity-80 transition-opacity">
                {post.heroImage && (
                  <img 
                    src={post.heroImage} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 text-accent">
                    {post.title}
                  </h2>
                  <p className="text-sm text-text-muted">
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