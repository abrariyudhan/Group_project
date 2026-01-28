import { BrowserRouter, Route, Routes } from "react-router"
import LoginPage from "./pages/LoginPage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
function App() {
  

  return (
    <>
<BrowserRouter>
<Routes>


  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />




</Routes>
</BrowserRouter>
    </>
  )
}

export default App
