import React, {useContext} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { Context } from '..';
import { observer } from 'mobx-react-lite';

const Home = () => {

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
    <div>
        <div className="mt-4 text-center">
            <button onClick={handleLogout} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                Выйти
            </button>
        </div>
    </div>
  )
}

export default  observer(Home)