import { fetchTasks as fetchTasksApi, createTask as createTaskApi, updateTask as updateTaskApi, login as loginAPI } from '../utils/api';
import Utils from "../utils/utils";

export const FETCH_TASKS_REQUEST = 'FETCH_TASKS_REQUEST';
export const FETCH_TASKS_SUCCESS = 'FETCH_TASKS_SUCCESS';
export const FETCH_TASKS_FAILURE = 'FETCH_TASKS_FAILURE';
export const CREATE_TASK_REQUEST = 'CREATE_TASK_REQUEST';
export const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS';
export const CREATE_TASK_FAILURE = 'CREATE_TASK_FAILURE';
export const UPDATE_TASK_REQUEST = 'UPDATE_TASK_REQUEST';
export const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
export const UPDATE_TASK_FAILURE = 'UPDATE_TASK_FAILURE';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

export const fetchTasks = (params) => (dispatch) => {
    dispatch({ type: FETCH_TASKS_REQUEST });
    return fetchTasksApi(params)
        .then((data) => dispatch({ type: FETCH_TASKS_SUCCESS, payload: data }))
        .catch((error) => dispatch({ type: FETCH_TASKS_FAILURE, payload: error }));
};

export const createTask = (params) => (dispatch) => {
    dispatch({ type: CREATE_TASK_REQUEST });
    return createTaskApi(params)
        .then((data) => dispatch({ type: CREATE_TASK_SUCCESS, payload: data }))
        .catch((error) => dispatch({ type: CREATE_TASK_FAILURE, payload: error }));
};

export const updateTask = (params) => (dispatch) => {
    dispatch({ type: UPDATE_TASK_REQUEST });
    return updateTaskApi(params)
        .then((data) => dispatch({ type: UPDATE_TASK_SUCCESS, payload: data }))
        .catch((error) => dispatch({ type: UPDATE_TASK_FAILURE, payload: error }));
};

export const login = (username, password) => (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    return loginAPI(username, password).then((response) => {
        console.log(response)
            Utils.toLS("toDoAppToken", response.temp_token);
            return dispatch({ type: LOGIN_SUCCESS });
        })
        .catch((error) => {
            return dispatch({ type: LOGIN_FAILURE, payload: "Invalid username or password" });
        });
};

export const logout = () => ({
    type: LOGOUT,
});
