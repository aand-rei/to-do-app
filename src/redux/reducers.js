import {
    FETCH_TASKS_REQUEST,
    FETCH_TASKS_SUCCESS,
    FETCH_TASKS_FAILURE,
    CREATE_TASK_REQUEST,
    CREATE_TASK_SUCCESS,
    CREATE_TASK_FAILURE,
    UPDATE_TASK_REQUEST,
    UPDATE_TASK_SUCCESS,
    UPDATE_TASK_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT
} from './actions';
import Utils from "../utils/utils";

const initialState = {
    tasks: {
        data: [],
        total_task_count: 0,
        page: 1,
        sort_field: 'id',
        sort_direction: 'asc',
        loading: false,
        error: null
    },
    auth: {
        isAuthenticated : !!Utils.fromLS("toDoAppToken") || false,
        error: null
    },
    creatingTask: false,
    updatingTask: false,
    error: null
};

const tasksReducer = (state = initialState.tasks, action) => {
    switch (action.type) {
        case FETCH_TASKS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_TASKS_SUCCESS:
            return {
                ...state,
                data: action.payload.tasks,
                total_task_count: action.payload.total_task_count,
                page: action.payload.page,
                sort_field: action.payload.sort_field,
                sort_direction: action.payload.sort_direction,
                loading: false,
                error: null
            };
        case FETCH_TASKS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

const creatingTaskReducer = (state = initialState.creatingTask, action) => {
    switch (action.type) {
        case CREATE_TASK_REQUEST:
            return true;
        case CREATE_TASK_SUCCESS:
            return false;
        case CREATE_TASK_FAILURE:
            return false;
        default:
            return state;
    }
};

const updatingTaskReducer = (state = initialState.updatingTask, action) => {
    switch (action.type) {
        case UPDATE_TASK_REQUEST:
            return true;
        case UPDATE_TASK_SUCCESS:
            return false;
        case UPDATE_TASK_FAILURE:
            localStorage.removeItem("toDoAppToken");
            return false;
        default:
            return state;
    }
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return state;
        case LOGIN_SUCCESS:
            return {
                isAuthenticated: true,
                error: null
            };
        case LOGIN_FAILURE:
            return {
                isAuthenticated: false,
                error: action.payload
            };
        case LOGOUT:
            localStorage.removeItem("toDoAppToken");
            return {
                isAuthenticated: false,
                error: null
            };
        default:
            return state;
    }
};

const rootReducer = (state = initialState, action) => {
    return {
        tasks: tasksReducer(state.tasks, action),
        creatingTask: creatingTaskReducer(state.creatingTask, action),
        updatingTask: updatingTaskReducer(state.updatingTask, action),
        auth: authReducer(state.auth, action),
    };
};

export default rootReducer;
