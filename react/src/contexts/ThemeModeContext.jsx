import React, { useState, useEffect, useContext, createContext } from 'react';

const createThemeModeConstext = createContext({
    _setThemeMode:()=>{},
    icon:"",
    mode:"",
});

export const useThemeModeContext = () => useContext(createThemeModeConstext);

const ThemeModeContext = ( {children} ) => {

    const [themeModes, setThemeModes] = useState([
        {
          icon:"bi bi-circle-half",
          mode: 'auto',
          status: 'active'
        },
        {
          icon:"bi bi-brightness-high",
          mode: 'light',
          status: ''
        },
        {
          icon:"bi bi-moon-stars",
          mode: 'dark',
          status: ''
        }
    ]);

    const [icon, setIcon] = useState("");
    const [mode, setMode] = useState("");

    useEffect(() =>{
        _displayMode();
    }, [themeModes]);

    const _setThemeMode = (e, mode) => {
        e.preventDefault();
        setThemeModes(themeModes.map((themeMode, index) => themeMode.mode == mode ? {...themeMode, status:'active'}: {...themeMode, status:''}));   
    }

    const _displayMode = () => {
        let active = themeModes.find((themeMode, index) => themeMode.status == 'active');
        setIcon(active.icon);
        setMode(active.mode);
    }

    let data = {
        _setThemeMode,
        icon, 
        mode
    }

  return (
    <createThemeModeConstext.Provider value={data}>
        {children}
    </createThemeModeConstext.Provider>
  )
}

export default ThemeModeContext