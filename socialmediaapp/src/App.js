import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from 'scenes/loginPage';
import HomePage from 'scenes/homePage';
import ProfilePage from 'scenes/profilePage';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles'
import { themeSettings } from 'theme';
import NavbarPage from 'scenes/navbar';

function App() {
  const mode = useSelector(state => state.mode);
  const isAuth = Boolean(useSelector(state => state.token))

  //? useMemo is used to call a particular function when the '[something]' is change in this case [mode].
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  return (
    <div className="App">
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path='/navbar' element={<NavbarPage />} />
            <Route path='/' element={<LoginPage />} />
            <Route path='/home' element={isAuth ? <HomePage /> : <Navigate to='/' />} />
            <Route path='/profile/:userId' element={isAuth ? <ProfilePage /> : <Navigate to='/' />} />
          </Routes>
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
