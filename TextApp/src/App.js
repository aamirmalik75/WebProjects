import './App.css';
import About from './components/About';
import Alert from './components/Alert';
import Navbar from './components/Navbar';
import TextForm from './components/TextForm';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  const [alert, setAlert] = useState(null);
  const [colorMode, setColorMode] = useState({
    navBarbackgroundColor: '#cfc9c9',
    navBarh2: '#000',
    navBarATag: '#7a7474',
    textHeading: '#43eb43',
    textareabackgroundColor: '#383636',
    textareaColor: '#4bdb4b',
    btnbackgroundColor: '#4bdb4b',
    btnColor: '#fff',
    textInfobackgroundColor: '#dbd7d7',
    textInfoColor: '#000',
    textHighlightedColor: '#4bdb4b',
    aboutBackground: '#383636',
    aboutColor: '#fff',
  });

  const toggleBodyColor = (CL) => {
    let bodyC = document.body;
    if (CL === 'white') bodyC.style.backgroundColor = '#fff';
    else if (CL === 'black') bodyC.style.backgroundColor = '#000';
    else if (CL === 'red') bodyC.style.backgroundColor = '#ff0000';
    else if (CL === 'green') bodyC.style.backgroundColor = '#008000';
  }

  const toggleColorMode = (selectedColor) => {
    if (selectedColor === 'black') {
      toggleBodyColor(selectedColor);
      setColorMode({
        navBarbackgroundColor: '#383636',
        navBarh2: '#fff',
        navBarATag: '#43eb43',
        textHeading: '#43eb43',
        textareabackgroundColor: '#fff',
        textareaColor: '#000',
        btnbackgroundColor: '#4bdb4b',
        btnColor: '#fff',
        textInfobackgroundColor: '#383636',
        textInfoColor: '#fff',
        textHighlightedColor: '#43eb43',
        aboutBackground: '#fff',
        aboutColor: '#383636',
      })

    } else if (selectedColor === 'red') {
      toggleBodyColor(selectedColor);

      setColorMode({
        navBarbackgroundColor: '#ca261a',
        navBarh2: '#000',
        navBarATag: '#fff',
        textHeading: '#000',
        textareabackgroundColor: '#fff',
        textareaColor: '#ff1100',
        btnbackgroundColor: '#000',
        btnColor: '#fff',
        textInfobackgroundColor: '#fff',
        textInfoColor: '#000',
        textHighlightedColor: '#ff1100',
        aboutBackground: '#383636',
        aboutColor: '#fff',
      })

    } else if (selectedColor === 'green') {
      toggleBodyColor(selectedColor);

      setColorMode({
        navBarbackgroundColor: '#43eb43',
        navBarh2: '#000',
        navBarATag: '#7a7474',
        textHeading: '#fff',
        textareabackgroundColor: '#43eb43',
        textareaColor: '#fff',
        btnbackgroundColor: '#fff',
        btnColor: '#000',
        textInfobackgroundColor: '#fff',
        textInfoColor: '#000',
        textHighlightedColor: '#008000',
        aboutBackground: '#fff',
        aboutColor: '#383636',
      })

    } else if (selectedColor === 'white') {
      toggleBodyColor(selectedColor);

      setColorMode({
        navBarbackgroundColor: '#cfc9c9',
        navBarh2: '#000',
        navBarATag: '#7a7474',
        textHeading: '#43eb43',
        textareabackgroundColor: '#383636',
        textareaColor: '#4bdb4b',
        btnbackgroundColor: '#4bdb4b',
        btnColor: '#fff',
        textInfobackgroundColor: '#dbd7d7',
        textInfoColor: '#000',
        textHighlightedColor: '#43eb43',
        aboutBackground: '#383636',
        aboutColor: '#fff',
      })
    }
  }

  const showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type
    });

    setTimeout(() => {
      setAlert(null)
    }, 1600);
  }

  return (
    <>
      <Router>
        <Navbar title="TextScanner" showAlert={showAlert} colorMode={colorMode} toggleColorMode={toggleColorMode} />
        <Alert alert={alert} />
        <Routes>
          <Route exact path='/' element=<TextForm heading={'Analyze Your Text:'} showAlert={showAlert} colorMode={colorMode} /> />
          <Route exact path='/about' element=<About colorMode={colorMode} /> />
        </Routes>
      </Router>
    </>
  );
}

export default App;