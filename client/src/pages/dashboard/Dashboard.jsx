import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <main className="dashboard">
      <h1>Welcome to eSahay</h1>

      <p>
        {user?.name
          ? `Hello, ${user.name}`
          : "Your citizen assistance dashboard"}
      </p>

      <button onClick={() => navigate("/case/intake")}>
        Start a New Case
      </button>
    </main>
  );
}

export default Dashboard;