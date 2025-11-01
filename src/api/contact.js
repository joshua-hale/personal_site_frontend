// src/api/contact.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const contactApi = {
  /**
   * Submit a contact form message
   * @param {Object} contactData - The contact form data
   * @param {string} contactData.name - Sender's name
   * @param {string} contactData.email - Sender's email
   * @param {string} contactData.subject - Message subject
   * @param {string} contactData.message - Message content
   * @returns {Promise<Object>} Response with id, sentAt, and confirmation message
   */
  submit: async (contactData) => {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to send message');
    }

    return response.json();
  },
};