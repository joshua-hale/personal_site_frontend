import { useState } from 'react';
import { contactApi } from '../api/contact';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const data = await contactApi.submit(formData);
      
      setStatus({
        type: 'success',
        message: data.message || 'Thank you for your message!'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-mono font-bold text-accent mb-2">
          Contact_
        </h1>
        <p className="text-text-muted font-mono mb-8">
          Get in touch. I'll respond as soon as possible.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-text font-mono text-sm mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={200}
              className="w-full bg-surface border border-border rounded px-4 py-3 text-text font-mono focus:outline-none focus:border-accent focus:shadow-glow transition-all"
              placeholder="Your name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-text font-mono text-sm mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              maxLength={200}
              className="w-full bg-surface border border-border rounded px-4 py-3 text-text font-mono focus:outline-none focus:border-accent focus:shadow-glow transition-all"
              placeholder="you@example.com"
            />
          </div>

          {/* Subject Field */}
          <div>
            <label htmlFor="subject" className="block text-text font-mono text-sm mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              maxLength={200}
              className="w-full bg-surface border border-border rounded px-4 py-3 text-text font-mono focus:outline-none focus:border-accent focus:shadow-glow transition-all"
              placeholder="What's this about?"
            />
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-text font-mono text-sm mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              maxLength={500}
              rows={6}
              className="w-full bg-surface border border-border rounded px-4 py-3 text-text font-mono focus:outline-none focus:border-accent focus:shadow-glow transition-all resize-none"
              placeholder="Your message..."
            />
            <p className="text-text-muted text-xs font-mono mt-1">
              {formData.message.length}/500 characters
            </p>
          </div>

          {/* Status Message */}
          {status.message && (
            <div
              className={`p-4 rounded border font-mono text-sm ${
                status.type === 'success'
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'bg-red-500/10 border-red-500 text-red-500'
              }`}
            >
              {status.message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent hover:bg-accent-hover text-bg font-mono font-bold py-3 px-6 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}