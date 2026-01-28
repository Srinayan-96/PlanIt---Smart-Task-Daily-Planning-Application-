import axios from "axios";



const API_URL = "http://localhost:3000/api/tasks";

export const getTasks = () => axios.get(API_URL);

// Accept a full task payload so we can send title, due date and reminder time.
export const addTask = (task) => axios.post(API_URL, task);
export const deleteTask = (id) => axios.delete(`${API_URL}/${id}`);
export const toggleTask = (id) => axios.patch(`${API_URL}/${id}/toggle`);



