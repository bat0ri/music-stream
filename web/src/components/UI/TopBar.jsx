import React, {useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import ThemeSwitch from '../../themes';

const TopBar = () => {

    const {store} = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            store.logout();
            navigate('/login');
        } catch (e) {
            console.log(e);
        }
    };

  return (
    <div className='p-2 flex justify-end items-center rounded-lg mx-10 mb-10 shadow-lg'>
        <ThemeSwitch />
        <div className="text-center flex items-center justify-between mx-3">
            <button onClick={handleLogout} className='flex items-center justify-between" hover:border dark:border-gray-200 border-gray-800 dark:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                </svg>
                Выйти
            </button>
        </div>
    </div>
  )
}

export default observer(TopBar)