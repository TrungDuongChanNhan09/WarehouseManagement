import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { publicRoutes } from './routes';
function App() {
  <BrowserRouter>
      <div id="App">
      <Routes>
                {publicRoutes.map((route, index) => {
                    const Page = route.component
                    const Layout = route.layout
                    return <Route key={index} path={route.path} element={<Layout>{Page}</Layout>} />
              })}
            </Routes>
      </div>
  </BrowserRouter>
}
export default App