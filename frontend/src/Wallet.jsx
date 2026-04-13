import { useEffect, useState } from "react";
import API from "./api";

export default function Wallet({ user, onLogout }) {
  const [transacoes, setTransacoes] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const [erro, setErro] = useState("");

  async function carregar() {
    const res = await fetch(`${API}/transacoes/${user.id}`);
    const data = await res.json();
    setTransacoes(data);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function adicionar(e) {
    e.preventDefault();
    setErro("");

    const v = Number(valor);

    if (!descricao.trim()) {
      setErro("Descrição obrigatória");
      return;
    }

    if (isNaN(v) || v <= 0) {
      setErro("Valor inválido");
      return;
    }

    const res = await fetch(`${API}/transacoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descricao,
        valor: v,
        tipo,
        utilizador_id: user.id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErro(data.erro);
      return;
    }

    setDescricao("");
    setValor("");
    carregar();
  }

  const saldo = transacoes.reduce((t, x) => {
    return x.tipo === "entrada" ? t + x.valor : t - x.valor;
  }, 0);

  return (
    <div className="app">

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Olá {user.nome}</h1>

        <button onClick={onLogout} style={{
          background: "#ef4444",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "10px"
        }}>
          Logout
        </button>
      </div>

      {/* SALDO */}
      <h2 className={saldo >= 0 ? "positivo" : "negativo"}>
        Saldo: {saldo.toFixed(2)}€
      </h2>

      {/* ERRO */}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {/* FORM */}
      <form onSubmit={adicionar}>
        <input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição" />
        <input value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Valor" />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
        <button>Adicionar</button>
      </form>

      {/* LISTA */}
      <div className="lista">
        {transacoes.map((t) => (
          <div key={t.id} className={t.tipo}>
            {t.tipo === "entrada" ? "💰" : "💸"} {t.descricao} - {Number(t.valor).toFixed(2)}€
          </div>
        ))}
      </div>

    </div>
  );
}