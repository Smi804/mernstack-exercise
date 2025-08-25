const BASE_URL = "http://localhost:5000/api";

export const API_ENDPOINTS = {
  categories: {
    getAll: `${BASE_URL}/categories`,
    create: `${BASE_URL}/categories/create`,
    update: (id) => `${BASE_URL}/categories/${id}`,
    delete: (id) => `${BASE_URL}/categories/${id}`,
    createorget: `${BASE_URL}/categories/createOrGet`,
  },
  subcategories: {
    getAll: `${BASE_URL}/subcategories`,
    create: `${BASE_URL}/subcategories/create`,
    update: (id) => `${BASE_URL}/subcategories/${id}`,
    delete: (id) => `${BASE_URL}/subcategories/${id}`,
    createorget: `${BASE_URL}/subcategories/createOrGet`,
  },
  items: {
    getAll: `${BASE_URL}/items`,
    create: `${BASE_URL}/items/create`,
    update: (id) => `${BASE_URL}/items/${id}`,
    delete: (id) => `${BASE_URL}/items/${id}`,
    createOrGet: `${BASE_URL}/items/createOrGet`,
  },
};
