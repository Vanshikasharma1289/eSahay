import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import SmartIntake from "./pages/case/SmartIntake";
import CaseSummary from "./pages/case/CaseSummary";
import RightsLaw from "./pages/case/RightsLaw";
import AuthorityRouter from "./pages/case/AuthorityRouter";
import ActionPlan from "./pages/case/ActionPlan";
import DocumentGenerator from "./pages/case/DocumentGenerator";
import CaseTracking from "./pages/case/CaseTracking";
import VoiceAssistant from "./pages/assistant/VoiceAssistant";
import CaseFollowUp from "./pages/case/CaseFollowUp";

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

        <Route
  path="/case/authority"
  element={<AuthorityRouter />}
/>

<Route
  path="/case/action"
  element={<ActionPlan />}
/>

<Route
  path="/case/document"
  element={<DocumentGenerator />}
/>


<Route
  path="/case/track"
  element={<CaseTracking />}
/>

<Route
  path="/assistant"
  element={<VoiceAssistant />}
/>

<Route
  path="/case/follow-up"
  element={<CaseFollowUp />}
/>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
