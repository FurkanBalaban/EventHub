import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from './loginpage/LoginPage'
import RegisterPage from './registerpage/RegisterPage'
import HomePage from './homepage/HomePage'
import MyEvents from './MyEvents/MyEvents';
import MyAccount from './myaccount/MyAccount'
import ForgotPassword from './forgotpassword/ForgotPassword';

function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />

          <Route path='/home' element={<HomePage />} />
          <Route path='/hesabim' element={<MyAccount />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<HomePage />} />
                <Route path="/my-events" element={<MyEvents />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
