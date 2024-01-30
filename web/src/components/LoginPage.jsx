import { useMutation} from '@apollo/client';
import React, { useContext, useState } from 'react';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { LOGIN_USER } from '../mutations/user';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate, Link } from 'react-router-dom';


const LoginPage = () => {

    const {store} = useContext(Context);

    const navigate = useNavigate();

    // MUI-SnackBar для вывода ошибок
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [loginUser] = useMutation(LOGIN_USER);

    const login = async(e) => {
        e.preventDefault();
    
        if (pass.length <= 4) {
            handleSnackbar('Пароль должен содержать более 4 символов', 'error');
            return;
        }

        try {
            await store.singIn(loginUser, email, pass);
            navigate('/');
        } catch(error) {
            console.log(error.message);
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 dark:text-white min-h-screen flex items-center justify-center ">
          <form className="w-1/3 bg-white dark:bg-gray-700 p-8 rounded shadow-md">
            <h1 className='font-bold text-xl mb-8 dark:text-white'>Вход</h1>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email"
              className="w-full p-2 mb-4 bg-gray-200 dark:bg-gray-800 border-b border-gray-600 focus:outline-none focus:border-blue-500"
            />
            <input
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              type="text"
              placeholder="Password"
              className="w-full p-2 mb-4 bg-gray-200 dark:bg-gray-800 border-b border-gray-600 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-between items-center">
              <button
                onClick={(e)=> login(e)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Войти
              </button>
              
            </div>
            <div className="mt-4 text-center">
                <Link to="/singup" className="text-blue-500 hover:underline">Зарегистрироваться</Link>
            </div>
          </form>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={1000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            style={{ position: 'absolute', bottom: 50 }}
          >
            <MuiAlert
              elevation={24}
              variant="filled"
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarSeverity}
            >
              {snackbarMessage}
            </MuiAlert>
          </Snackbar>
        </div>
      );
}

export default observer(LoginPage);