import { AuthProvider } from "./Context/AuthContext"
import { BlogProvider } from "./Context/BlogContext"
import { Routes, Route } from 'react-router-dom'
import Home from "./Components/Home"
import CreateBlog from "./Components/CreateBlog"
import LoginPage from "./Components/LoginPage"
import Navigation from "./Components/Navigation"
import SignUpPage from "./Components/SignUpPage"
import ProtectedRoute from "./Components/ProtectedRoute"
import EditBlog from "./Components/EditBlog"
import OwnPost from "./Components/OwnPost"

const App = () => {
  return (
    <>
      <AuthProvider>
        <BlogProvider>
          <Navigation />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/createblog" element={
                <ProtectedRoute>
                  <CreateBlog />
                </ProtectedRoute>
              }
              />
              <Route path="/ownpost" element={
                <ProtectedRoute>
                  <OwnPost />
                </ProtectedRoute>
              }
              />
              <Route 
                path="/edit/:userId/:blogId" element = {
                  <ProtectedRoute>
                    <EditBlog />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>


        </BlogProvider>
      </AuthProvider>
    </>
  )
}

export default App