import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface Program {
  id: number;
  name: string;
}

export interface Client {
  id: number;
  name: string;
  age: number;
  gender: string;
  contact: string;
  programs: Program[];
}

export const programsApi = {
  create: (data: { name: string }) => api.post<Program>('/programs/', data),
  getAll: () => api.get<Program[]>('/programs/'),
  delete: (id: number) => api.delete<{ message: string }>(`/programs/${id}`),
  update: (id: number, data: { name: string }) => 
    api.put<Program>(`/programs/${id}`, data),
};

export const clientsApi = {
  create: (data: Omit<Client, 'id' | 'programs'>) => 
    api.post<Client>('/clients/', data),
  getAll: () => api.get<Client[]>('/clients/'),
  getById: (id: number) => api.get<Client>(`/clients/${id}`),
  search: (query: string) => api.post<Client[]>('/clients/search/', { query }),
  delete: (id: number) => api.delete<{ message: string }>(`/clients/${id}`),
  update: (id: number, data: Omit<Client, 'id' | 'programs'>) =>
    api.put<Client>(`/clients/${id}`, data),
};

export const enrollmentsApi = {
  create: (data: { client_id: number; program_id: number }) =>
    api.post<Client>('/enrollments/', data),
  delete: (data: { client_id: number; program_id: number }) =>
    api.delete<Client>('/enrollments/', { data }),
};

export default api;