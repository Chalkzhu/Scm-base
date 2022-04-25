import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from '@/routers/router.js';
import { AliveScope } from 'react-activation';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AliveScope>
          <Router />
        </AliveScope>
      </BrowserRouter>
    </>
  );
}

export default App;
