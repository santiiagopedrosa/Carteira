import { useState } from "react";
import API from "./api";

export default function Login({ onLogin, goRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login(e) {
    e.preventDefault();

    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      onLogin(data);
    } else {
      alert("Login inválido");
    }
  }

  return (
    <div className="app">
      <h1>Login</h1>

      <form onSubmit={login}>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Entrar</button>
      </form>

      <p onClick={goRegister} style={{ cursor: "pointer" }}>
        Criar conta
      </p>
    </div>
  );
}