import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import CityComplaints from "./pages/citizen/CityComplaints";
import CitizenProjects from "./pages/citizen/CitizenProjects";
import Transport from "./pages/transport/Transport";

import GovtComplaints from "./pages/govt/GovtComplaints";
import GovtProjects from "./pages/govt/GovtProjects";
import GovtAnalytics from "./pages/govt/GovtAnalytics";

import AlertTicker from "./components/AlertTicker";
import AlertPopup from "./components/AlertPopup";
import AlertFooter from "./components/AlertFooter";

import AuthorityAlerts from "./pages/authority/AuthorityAlerts";
import AuthorityProjects from "./pages/authority/AuthorityProjects";
import AuthorityComplaints from "./pages/authority/AuthorityComplaints";

export default function App() {
  const { isAuthed } = useAuth();

  return (
    <>
     
      {isAuthed && <Navbar />}
      {isAuthed && <AlertTicker />}
      {isAuthed && <AlertPopup />}
      {isAuthed && <AlertFooter />}
      <Routes>
    
        <Route
          path="/"
          element={
            isAuthed ? <Home /> : <Navigate to="/auth/login" replace />
          }
        />
        <Route 
        path="/citizen/complaints" 
        element={<ProtectedRoute roles={["citizen"]}><CityComplaints />
        </ProtectedRoute>} />
        
        <Route
          path="/auth/login"
          element={isAuthed ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/auth/signup"
          element={isAuthed ? <Navigate to="/" replace /> : <Signup />}
        />

        <Route
          path="/authority/alerts"
          element={<AuthorityAlerts />}
        />

        <Route path="/authority/projects" 
        element={<AuthorityProjects />}
         />

         <Route 
         path="/authority/complaints" 
         element={<AuthorityComplaints />} 
         />

        <Route
          path="/citizen/projects"
          element={
            <ProtectedRoute roles={["citizen"]}>
              <CitizenProjects />
            </ProtectedRoute>
          }
        />

        <Route path="/transport" element={<Transport />} />
       
        <Route
          path="/citizen/complaints"
          element={
            <ProtectedRoute roles={["citizen"]}>
              <div>Citizen Complaints</div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/govt/complaints"
          element={
            <ProtectedRoute roles={["govt"]}>
              <GovtComplaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/govt/projects"
          element={
            <ProtectedRoute roles={["govt"]}>
              <GovtProjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/govt/analytics"
          element={
            <ProtectedRoute roles={["govt"]}>
              <GovtAnalytics />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}