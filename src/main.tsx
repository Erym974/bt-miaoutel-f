import { Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ParticleComponent from './Component/ParticleComponent.tsx';

createRoot(document.getElementById('root')!).render(
  <Fragment>
    <App />
    <ParticleComponent />
    <ToastContainer />
  </Fragment>,
)
