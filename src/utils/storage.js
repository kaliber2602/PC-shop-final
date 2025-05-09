export const storage = {
  get: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Error accessing localStorage for key ${key}:`, error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Error setting localStorage for key ${key}:`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing localStorage for key ${key}:`, error);
      return false;
    }
  }
};