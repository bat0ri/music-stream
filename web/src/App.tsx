import React, { useContext } from 'react';
import Registration from './components/RegistrationPage';
import ThemeSwitch from './themes';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';


function App() {




  return (
    <div className="App bg-white dark:bg-slate-800 h-screen">
        <ThemeSwitch />
        <Routes>
            <Route path='/singup' element={<Registration/>}></Route>
            <Route path='/login' element={<LoginPage/>}></Route>
        </Routes>
    </div>
  );
}

export default App;