import axios from "axios";

const BASE_URL = "http://192.168.15.95:5000";

const handleApiError = (error) => {
  const msg = error.response?.data?.message || error.message || "";
  if (msg.includes("Invalid authentication token") || error.response?.status === 401) {
    console.warn("Session expired or invalid token. Logging out...");
    localStorage.removeItem('token');
    // Optional: Redirect to login if window is available
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
  // console.error("API Error:", error.response?.data || error.message);
  throw error;
};

/**
 * Login API call
 */
export const loginAPI = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/`, credentials);
    const token = response.data.token || response.data.accessToken;
    if (token) localStorage.setItem('token', token);
    return response.data;
  } catch (error) {
    // Login error usually doesn't need global handler (user might just have wrong password)
    // But if you want to be consistent, you can use it. 
    // Usually invalid token implies we were logged in, but here we are trying to log in.
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Create/Add CMS Section
 */
export const createSectionAPI = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}/api/cms`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'authorization': `${token}`
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Update CMS Section
 * @param {string|number} id - The ID of the section to update
 * @param {FormData} formData - The data to update
 */
export const updateSectionAPI = async (id, formData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${BASE_URL}/api/cms/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'authorization': `${token}`
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Delete CMS Section
 * @param {string|number} id - The ID of the section to delete
 */
export const deleteSectionAPI = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${BASE_URL}/api/cms/${id}`, {
      headers: {
        'authorization': `${token}`
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Get All CMS Sections
 */
export const getAllSectionsAPI = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/api/cms`, {
      headers: { 'authorization': `${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Delete Image from Section
 * @param {string|number} id - The ID of the section
 * @param {string} imageName - The name of the image to delete
 */
export const deleteImageAPI = async (id, imageName) => {
  try {
    const token = localStorage.getItem('token');
    // Using simple concatenation as it matches the requested format
    const response = await axios.delete(`${BASE_URL}/api/cms/image/${id}?image=${imageName}`, {
      headers: {
        'authorization': `${token}`
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Submit Contact Form (Suppliers/Contact)
 * @param {FormData} formData
 */
export const submitContactFormAPI = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/contact`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // No auth header needed as per requirements for public form
      },
    });
    return response.data;
  } catch (error) {
    console.error("Contact Form Error:", error.response?.data || error.message);
    throw error;
  }
};
