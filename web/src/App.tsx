import React, { useContext } from 'react';
import Registration from './components/RegistrationPage';
import ThemeSwitch from './themes';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import { Context } from '.';
import Home from './components/Home';
import { observer } from 'mobx-react-lite';
import { useNavigate, Link } from 'react-router-dom';
import TopBar from './components/UI/TopBar';


function App() {

    const {store} = useContext(Context);
    const navigate = useNavigate();

    if (!store.isAuthenticated) {
        return (
            <div className="bg-white dark:bg-gray-800 h-screen">
                <TopBar/>
                <Routes>
                    <Route path='/singup' element={<Registration/>}></Route>
                    <Route path='/login' element={<LoginPage/>}></Route>
                </Routes>
            </div>
        )
    }


  return (
    <div className="App bg-white dark:bg-gray-800 h-screen">
        <TopBar/>
        <Routes>
            <Route path='/' element={<Home/>}></Route>
        </Routes>
    </div>
  );
}

export default observer(App);