import React from 'react';

import MusicPlayer from './components/Player';
import Auth from './components/Auth';
import ThemeSwitch from './themes';


function App() {
  return (
    <div className="App bg-white dark:bg-slate-800 h-screen">
        <ThemeSwitch />
        <Auth />
    </div>
  );
}

export default App;