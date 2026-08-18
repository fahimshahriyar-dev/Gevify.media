import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './style.css'
import 'react-phone-input-2/lib/style.css'
import Home from './pages/Home/Home'
import Work from './pages/Work'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminSignin from './pages/Authentication/AdminSignin'
import AdminSignup from './pages/Authentication/AdminSignup'
import AdminProfile from './pages/AdminProfile'
import TestFooter from './__TestFooter'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/work" element={<Work isAdminMode={true} />} />
        <Route path="/admin/about" element={<About isAdminMode={true} />} />
        <Route path="/admin/contact" element={<Contact isAdminMode={true} />} />
        <Route path="/admin/signin" element={<AdminSignin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/dashboard" element={<Home isAdminMode={true} />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/__test-footer" element={<TestFooter />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

