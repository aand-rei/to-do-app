import axios from 'axios';
import Utils from "./utils";

const LOCAL_DEV = 0;
const API_URL = LOCAL_DEV ? 'http://localhost:3005' : 'http://194.67.116.114';

export const fetchTasks = ({ page = 1, sort_field = 'id', sort_direction = 'asc' }) => {
    const url = `${API_URL}/api/tasks?page=${page}&sort_field=${sort_field}&sort_direction=${sort_direction}`;
    return axios.get(url).then((response) => response.data);
};

export const createTask = ({ name, email, text }) => {
    const url = `${API_URL}/api/tasks`;
    return axios.post(url, { name, email, text }).then((response) => response.data);
};

export const updateTask = ({ id, text, editedByAdmin, completed }) => {
    const url = `${API_URL}/api/admin/tasks/${id}?temp_token=${Utils.fromLS("toDoAppToken")}`;
    return axios.put(url, { text, editedByAdmin, completed }).then((response) => response.data);
};

export const login = ( username, password ) => {
    const url = `${API_URL}/api/login`;
    return axios.post(url, { username, password }).then((response) => response.data);
};