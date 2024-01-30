import React from 'react';
import Registration from './components/RegistrationPage';
import ThemeSwitch from './themes';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App bg-white dark:bg-slate-800 h-screen">
        <ThemeSwitch />
        <Routes>
            <Route path='/singup' element={<Registration/>}></Route>
            <Route path='/login' element={<Auth/>}></Route>
        </Routes>
    </div>
  );
}

export default App;