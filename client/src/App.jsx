import { BrowserRouter, Route, Routes } from "react-router"
import LoginPage from "./pages/LoginPage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import HomePage from "./pages/HomePage.jsx"
import ProjectDetail from "./pages/ProjectDetail.jsx"
import CreateProjectPage from "./pages/CreateProjectPage.jsx"
import ProjectsListPage from "./pages/ProjectsListPage.jsx"
import AIGeneratePage from "./pages/AIGeneratePage.jsx"
import { AuthProtected, PublicOnly } from "./components/AuthGuard.jsx"


function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>

        {/* Public Routes */}
          <Route element={<PublicOnly />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>


          {/*Authentication  */}
          <Route element={<AuthProtected />}>

            <Route path="/" element={<HomePage />} />
            <Route path="/ai-generate" element={<AIGeneratePage />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/create-project" element={<CreateProjectPage />} />
            <Route path="/projects" element={<ProjectsListPage />} />

          </Route>





        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
