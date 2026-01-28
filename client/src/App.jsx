import { BrowserRouter, Route, Routes } from "react-router"
import LoginPage from "./pages/LoginPage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import HomePage from "./pages/HomePage.jsx"
import CreateProjectPage from "./pages/CreateProjectPage.jsx"
import ProjectsPage from "./pages/ProjectPage.jsx"

function App() {
  

  return (
    <>
<BrowserRouter>
<Routes>


  <Route path="/" element={<HomePage />} />
  <Route path="/create-project" element={<CreateProjectPage />} />
  <Route path="/projects" element={<ProjectsPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />




</Routes>
</BrowserRouter>
    </>
  )
}

export default App
