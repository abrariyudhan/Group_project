import { BrowserRouter, Route, Routes } from "react-router"
import LoginPage from "./pages/LoginPage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import HomePage from "./pages/HomePage.jsx"
import ProjectDetail from "./pages/ProjectDetail.jsx"
function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>


          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />




        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
