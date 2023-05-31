import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import {
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {login, logout} from '../../../redux/actions';

const useStyles = makeStyles({
    header: {
        width: '100%',
        height: 50
    },
});

function Header() {

    const dispatch = useDispatch();
    const classes = useStyles();
    const isAuthenticated = useSelector((state)=> state.auth.isAuthenticated);
    const authError = useSelector((state)=> state.auth.error);
    const [openLogin, setOpenLogin] = React.useState(false);
    const [userName, setUserName] = React.useState('');
    const [userPass, setUserPass] = React.useState('');

    useEffect(() => {
        if(authError){
            setOpenLogin(true);
            window.alert(authError);
        }
    }, [authError]);

    const handleLoginWin = () => {
        setOpenLogin((e) => !e);
    }

    const handleLogin = () => {
        dispatch(login(userName,userPass)).then(res=>{
            if(res.type === "LOGIN_SUCCESS") handleLoginWin();
        });
    }

    const exit = () => {
        dispatch(logout());
    }

    return (
        <div className={classes.header}>
            <Button variant="contained" color="primary" onClick={isAuthenticated ? exit : handleLoginWin}>{isAuthenticated ? "Выйти" : "Войти"}</Button>
            <Dialog open={openLogin} onClose={handleLoginWin}>
                <DialogTitle>Авторизация</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Имя"
                        fullWidth
                        value={userName}
                        onChange={(event) => setUserName(event.target.value)}
                        error={!!authError}
                        sx={{mt:1}}
                    />
                    <TextField
                        label="Пароль"
                        fullWidth
                        value={userPass}
                        onChange={(event) => setUserPass(event.target.value)}
                        error={!!authError}
                        sx={{mt:1}}
                        hidden={true}
                        type={"password"}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLoginWin}>Отмена</Button>
                    <Button variant="contained" color="primary" onClick={handleLogin}>Войти</Button>
                </DialogActions>
            </Dialog>
        </div>
    )

}

export default Header;