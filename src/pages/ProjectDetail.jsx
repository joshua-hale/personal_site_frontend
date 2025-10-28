import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PostsAPI } from '../api/posts';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const data = await PostsAPI.getBySlug(slug); // Use getBySlug instead of get
      setPost(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-red-500">Post not found</p>
        <Link to="/projects" className="text-green-400 hover:underline mt-4 inline-block">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <Link to="/projects" className="text-green-400 hover:underline mb-4 inline-block">
        ← Back to Projects
      </Link>
      
      {post.heroImage && (
        <img 
          src={post.heroImage} 
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
        />
      )}
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
      
      <div className="text-gray-400 mb-8">
        <p>Published: {new Date(post.createdAt).toLocaleDateString()}</p>
        {post.updatedAt !== post.createdAt && (
          <p>Updated: {new Date(post.updatedAt).toLocaleDateString()}</p>
        )}
      </div>
      
      <div className="prose prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  );
}