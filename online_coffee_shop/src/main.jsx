import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RootLayout from './Root_Layout/RootLayout.jsx'
import { Router, RouterProvider, Routes } from 'react-router'
import { router } from './routes/Router.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
     <RouterProvider router={router}>
      <RootLayout />
    </RouterProvider>
  </StrictMode>,
)
