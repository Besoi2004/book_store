import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'
import { TierNotificationProvider } from './context/TierNotificationContext'

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <>
    <TierNotificationProvider>
      <ScrollToTop />
      <Navbar />
      <main className='min-h-screen max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-6 font-primary'>
        <Outlet />
      </main>
      <Footer />
    </TierNotificationProvider>
    </>
  )
}

export default App
