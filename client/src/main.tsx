import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './style.css'

const Home = lazy(() => import('./pages/Home/Home'))
const Work = lazy(() => import('./pages/Work'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const AdminSignin = lazy(() => import('./pages/Authentication/AdminSignin'))
const AdminSignup = lazy(() => import('./pages/Authentication/AdminSignup'))
const AdminProfile = lazy(() => import('./pages/AdminProfile'))
const TestFooter = lazy(() => import('./__TestFooter'))

const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white">
    <div className="text-center">
      <div className="relative h-12 w-12 mx-auto mb-5">
        <div className="absolute inset-0 rounded-full border-2 border-[#0086F0]/20"></div>
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-[#0086F0]"></div>
      </div>
      <p className="text-sm text-[#5ACFFE]/80 tracking-widest uppercase font-medium">
        Loading...
      </p>
    </div>
  </div>
);

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)

