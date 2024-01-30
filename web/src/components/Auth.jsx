import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react'
import { GET_ALL_USERS } from '../query/user';
import { CREATE_USER } from '../mutations/user';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';



const Auth = () => {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
      };
      

    const [users, setUsers] = useState([]);

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('')

    const { data, loading, error, refetch } = useQuery(GET_ALL_USERS);
    const [newUser] =  useMutation(CREATE_USER);

    useEffect(()=>{
        if(!loading) {
            setUsers(data.getUsers)
        }
    }, [data])

    const getAll = e => {
        e.preventDefault()
        refetch()
    }

    if(loading) {
        return <h1>Loading...</h1>
    }

    const addUser = async (e) => {
        e.preventDefault();
    
        if (pass.length <= 4) {
            handleSnackbar('Пароль должен содержать более 4 символов', 'error');
            return;
        }
    
        try {
            const { data } = await newUser({
                variables: {
                    email,
                    password: pass
                }
            });
    
            if (data.register === 'INVALID_EMAIL_FORMAT') {
                handleSnackbar('Неправильный формат почты', 'error');
            } else if (data.register === 'EMAIL_ALREADY_REGISTERED') {
                handleSnackbar('Email уже зарегистрирован', 'error');
            } else if (data.register === 'USER IS REGISTER') {
                console.log("Пользователь успешно добавлен:", data);
                handleSnackbar('Пользователь успешно добавлен', 'success');
                setEmail('');
                setPass(''); 
            }
        } catch (error) {
            console.error("Error while adding user:", error);
            handleSnackbar('Ошибка при добавлении пользователя', 'error');
        }
    };
    
    


    return (
        <div className="bg-white dark:bg-gray-800 dark:text-white min-h-screen flex items-center justify-center ">
          <form className="w-1/3 bg-white dark:bg-gray-700 p-8 rounded shadow-md">
            <h1 className='font-bold text-xl mb-8 dark:text-white'>Регистрация</h1>
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
                onClick={(e) => addUser(e)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Создать
              </button>
              <button
                onClick={(e) => getAll(e)}
                className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Получить
              </button>
            </div>
          </form>
          <div className="m-10 w-1/5 bg-white dark:bg-gray-700 p-8 rounded shadow-md">
            <h1 className='font-bold mb-6'>Список пользаков</h1>
            {users.map((user) => (
              <div key={user.id} className="text-gray-300">
                {user.email}
              </div>
            ))}
          </div>
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

export default Auth;