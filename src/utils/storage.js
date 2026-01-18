/**
 * Storage utility for persisting application data
 * Uses localStorage as the backend storage mechanism
 */

const storage = {
  /**
   * Get a value from storage
   * @param {string} key - The key to retrieve
   * @returns {Promise<Object|null>} The stored value or null if not found
   */
  async get(key) {
    try {
      const value = localStorage.getItem(key);
      if (value === null) {
        return null;
      }
      return { value };
    } catch (error) {
      console.error(`Error getting key "${key}" from storage:`, error);
      return null;
    }
  },

  /**
   * Set a value in storage
   * @param {string} key - The key to store
   * @param {string} value - The value to store (should be JSON stringified)
   * @returns {Promise<void>}
   */
  async set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting key "${key}" in storage:`, error);
      throw error;
    }
  },

  /**
   * Remove a value from storage
   * @param {string} key - The key to remove
   * @returns {Promise<void>}
   */
  async remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing key "${key}" from storage:`, error);
      throw error;
    }
  },

  /**
   * Clear all storage
   * @returns {Promise<void>}
   */
  async clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
};

// Make storage available globally
if (typeof window !== 'undefined') {
  window.storage = storage;
}

export default storage;
