import { useState } from "react";
import API from "./api";

export default function Register({ goLogin }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function register(e) {
    e.preventDefault();

    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, password }),
    });

    if (res.ok) {
      alert("Conta criada!");
      goLogin();
    } else {
      alert("Erro ao criar conta");
    }
  }

  return (
    <div className="app">
      <h1>Registo</h1>

      <form onSubmit={register}>
        <input placeholder="Nome" onChange={(e) => setNome(e.target.value)} />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Criar conta</button>
      </form>

      <p onClick={goLogin} style={{ cursor: "pointer" }}>
        Já tenho conta
      </p>
    </div>
  );
}