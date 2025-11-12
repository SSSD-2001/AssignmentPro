
import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignIn from "./signin"
import SignUp from "./signup"
import Home from "./Home"
import Navbar from "./Navbar"
import Dashboard from "./Dashboard"

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
