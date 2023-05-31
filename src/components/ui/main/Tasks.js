import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { Edit } from "@mui/icons-material"
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    Paper,
    TextField,
    Button,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { fetchTasks, createTask, updateTask } from '../../../redux/actions';

const useStyles = makeStyles({
    container: {
        maxWidth: 800,
        margin: '0 auto'
    },
    form: {
        display: 'flex',
        marginBottom: 16,
    },
    input: {
        marginRight: 16
    },
    editedCell: {
        fontStyle: "italic",
        '&:hover': {
            cursor: 'help'
        }
    },
    headCell: {
        fontWeight: "bold"
    },
    createBtn: {
        height: 56
    }

});

const columns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Имя' },
    { id: 'email', label: 'Email' },
    { id: 'text', label: 'Задача' },
    { id: 'completed', label: 'Статус' }
];

function Tasks() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks);
    const creatingTask = useSelector((state) => state.creatingTask);
    const updatingTask = useSelector((state) => state.updatingTask);
    const isAuthenticated = useSelector((state)=> state.auth.isAuthenticated);
    const error = useSelector((state) => state.error);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [text, setText] = useState('');
    const [open, setOpen] = useState(false);
    const [editedTask, setEditedTask] = useState(null);
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [textError, setTextError] = useState('');

    useEffect(() => {
        dispatch(fetchTasks({ page: page + 1, sort_field: sortField, sort_direction: sortDirection }));
    }, [dispatch, page, rowsPerPage, sortField, sortDirection,editedTask]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleEditClick = (task) => {
        setEditedTask(task);
        setOpen(true);
    };

    const handleSaveClick = () => {
        handleUpdateTask(editedTask.id, editedTask.text, true, editedTask.completed)
        setEditedTask(null);
        setOpen(false);
        dispatch(fetchTasks({ page: page + 1, sort_field: sortField, sort_direction: sortDirection }));
    };

    const handleCancelClick = () => {
        setEditedTask(null);
        setOpen(false);
    };

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleCreateTask = () => {
        let valid = validate()
        if(valid){
            dispatch(createTask({ name, email, text })).then(res=>{
                dispatch(fetchTasks({ page: page + 1, sort_field: sortField, sort_direction: sortDirection }));
            });
            setName('');
            setEmail('');
            setText('');
            setEmailError('');
            setNameError('');
            setTextError('');
        }
    };

    const handleUpdateTask = (id, text, editedByAdmin, completed) => {
        dispatch(updateTask({ id, text, editedByAdmin, completed })).then(res => {
            dispatch(fetchTasks({ page: page + 1, sort_field: sortField, sort_direction: sortDirection }));
        });
    };

    const validate = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) setEmailError('Некорректный email');
        if(!name) setNameError('Обязательное поле');
        if(!text) setTextError('Обязательное поле');
        return emailRegex.test(email) && !!name && !!text;
    };

    return (
        <div className={classes.container}>
            <h1>To-Do list</h1>
            {error && <p>{error.message}</p>}
            <form className={classes.form}>
                <TextField
                    className={classes.input}
                    label="Имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!nameError}
                    helperText={nameError}
                    sx={{mr:2}}
                />
                <TextField
                    className={classes.input}
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!emailError}
                    helperText={emailError}
                    sx={{mr:2}}
                />
                <TextField
                    className={classes.input}
                    label="Задача"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    error={!!textError}
                    helperText={textError}
                    sx={{mr:2}}
                />
                <Button className={classes.createBtn} variant="contained" color="primary" onClick={handleCreateTask} disabled={creatingTask}>
                    {creatingTask ? 'Создается...' : 'Создать задачу'}
                </Button>
            </form>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} sortDirection={sortField === column.id ? sortDirection : false}>
                                    <TableSortLabel className={classes.headCell}
                                        active={sortField === column.id}
                                        direction={sortField === column.id ? sortDirection : 'asc'}
                                        onClick={() => handleSort(column.id)}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.data.map((task) => (
                            <TableRow key={`${task.id}-${task.name}`}>
                                <TableCell>{task.id}</TableCell>
                                <TableCell>{task.name}</TableCell>
                                <TableCell>{task.email}</TableCell>
                                <TableCell className={task.editedByAdmin ? classes.editedCell : null}>
                                    {task.editedByAdmin ? (
                                        <Tooltip title="Отредактировано администратором">
                                            <span>{task.text}</span>
                                        </Tooltip>
                                    ) : (
                                        <span>{task.text}</span>
                                    )}
                                    {
                                        isAuthenticated ? <IconButton aria-label={'Редактировать'} onClick={()=>handleEditClick(task)}>
                                            <Edit />
                                        </IconButton> : <></>
                                    }
                                </TableCell>
                                <TableCell>{task.completed ? 'Выполнено' :
                                    isAuthenticated ? <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleUpdateTask(task.id, task.text, task.editedByAdmin, !task.completed)}
                                        disabled={updatingTask}
                                    >
                                        {updatingTask ? 'Завершается...' : 'Завершить'}
                                    </Button> : ''
                                }</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <Dialog open={open} onClose={handleCancelClick}>
                        <DialogTitle>Редактирование задачи</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Текст задачи"
                                fullWidth
                                value={editedTask ? editedTask.text : ''}
                                onChange={(event) => setEditedTask({ ...editedTask, text: event.target.value })}
                                sx={{mt:1}}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCancelClick}>Отмена</Button>
                            <Button variant="contained" color="primary" onClick={handleSaveClick}>Сохранить</Button>
                        </DialogActions>
                    </Dialog>
                </Table>
                <TablePagination
                    component="div"
                    count={tasks.total_task_count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[3]}
                    showFirstButton
                    showLastButton
                />
            </TableContainer>
        </div>
    );
}

export default Tasks;
