import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import SmartIntake from "./pages/case/SmartIntake";
import CaseSummary from "./pages/case/CaseSummary";
import RightsLaw from "./pages/case/RightsLaw";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/case/intake" element={<SmartIntake />} />
        <Route path="/case/summary" element={<CaseSummary />} />
        <Route path="/case/rights" element={<RightsLaw />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
