export const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            console.error('Error saving to storage:', e);
            return false;
        }
    },

    get: (key) => {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.error('Error reading from storage:', e);
            return null;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from storage:', e);
            return false;
        }
    }
};