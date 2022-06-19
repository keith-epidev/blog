import React,{useState,useEffect,useContext,useRef} from 'react';
import { CssBaseline, createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material';
import {blue,red,green} from '@mui/material/colors';

import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';

//import {ScrollToTop} from "./ui/ScrollToTop";


import { Landing } from './page/Landing';

import './font/Serif/cmun-serif.css';
import './font/Typewriter/cmun-typewriter.css';

import { Post } from './page/Post';
// import { DistributionAnalysis } from './page/DistributionAnalysis';
import { Resume } from './page/Resume';
import { ReadingList } from './page/ReadingList';




function App() {

  const theme = responsiveFontSizes(createTheme({
    typography: {
      fontFamily: [
        "Computer Modern Serif"
      ]
   },
    palette: {
        primary: blue,
        secondary: red,
        success: green
    },
  } as any ));
  
  return <ThemeProvider theme={theme}>
     <CssBaseline>
      <BrowserRouter >
          <Routes>
              <Route  path='/' element={<Landing />} />
              <Route  path='/post/:id' element={<Post />} />
              <Route  path='/resume' element={<Resume />} />
              <Route  path='/readingList' element={<ReadingList />} />
              <Route  path='*' element={<Landing />} />
            </Routes>
        </BrowserRouter>
    </CssBaseline>
  </ThemeProvider>

}

export default App;

//<ScrollToTop>  </ScrollToTop>
//<Route  path='/distributionAnalysis' element={<DistributionAnalysis />} />