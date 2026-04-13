import { useState } from "react";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import Wallet from "./Wallet";

export default function App() {
  const [page, setPage] = useState(
    localStorage.getItem("user") ? "wallet" : "login"
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  function handleLogin(userData) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setPage("wallet");
  }

  function handleLogout() {
    localStorage.removeItem("user");
    setUser(null);
    setPage("login");
  }

  return (
    <div>
      {page === "login" && (
        <Login
          onLogin={handleLogin}
          goRegister={() => setPage("register")}
        />
      )}

      {page === "register" && (
        <Register goLogin={() => setPage("login")} />
      )}

      {page === "wallet" && user && (
        <Wallet user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}