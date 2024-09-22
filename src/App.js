import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import You from './pages/You'
import News from './pages/News'
import ResourceFinder from './pages/ResourceFinder'
import ReportExplanation from './pages/ReportExplanation'
import Chatbot from './pages/Chatbot'
import Sidebar from './pages/Sidebar'
import Appointment from './pages/Appointment'
import ProtectedRoute from './components/ProtectedRoute'
import Authentication from './pages/Authentication'

const App = () => {
  const [auth, setAuth] = useState(localStorage.getItem('auth'))
  const [ml, setMl] = useState(64);

  useEffect(() => {
    if (auth) {
      localStorage.setItem('auth', auth)
    } else {
      localStorage.removeItem('auth')
      setAuth(null)
    }

    return () => {
      if (auth) {
        localStorage.setItem('auth', auth)
      }
    }
  }, [localStorage])

  return (
    <Router>
      <div className="flex">
        {auth && <Sidebar ml={ml} setMl={setMl} />}
        <div className={`flex-grow transition-all duration-300 ${auth && `${ml == 14 && "ml-14"} ${ml == 64 && "ml-64"}`}`}>
          <Routes>
            <Route path="/auth" element={<Authentication />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <You />
                </ProtectedRoute>
              }
            />
            <Route
              path="/global-news"
              element={
                <ProtectedRoute>
                  <News />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resource-finder"
              element={
                <ProtectedRoute>
                  <ResourceFinder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report-explanation"
              element={
                <ProtectedRoute>
                  <ReportExplanation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <Chatbot ml={ml} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointment"
              element={
                <ProtectedRoute>
                  <Appointment />
                </ProtectedRoute>
              }
            />
          </Routes> 
        </div>
      </div>
    </Router>
  )
}

export default App