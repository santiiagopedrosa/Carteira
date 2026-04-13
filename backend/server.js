import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 SUPABASE
const supabase = createClient(
  "https://xcjblzlmvusivmxuhiim.supabase.co",
  "SUA_ANON_KEY_AQUI"
);

// =========================
// 🔹 REGISTER
// =========================
app.post("/register", async (req, res) => {
  const { nome, email, password } = req.body;

  if (!nome || !email || !password) {
    return res.status(400).json({ erro: "Dados em falta" });
  }

  const { data, error } = await supabase
    .from("utilizadores")
    .insert([{ nome, email, password }])
    .select()
    .single();

  if (error) {
    return res.status(400).json({ erro: "Email já existe" });
  }

  res.json(data);
});

// =========================
// 🔹 LOGIN
// =========================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase
    .from("utilizadores")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error || !data) {
    return res.status(401).json({ erro: "Login inválido" });
  }

  res.json(data);
});

// =========================
// 🔹 GET TRANSAÇÕES
// =========================
app.get("/transacoes/:userId", async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("transacoes")
    .select("*")
    .eq("utilizador_id", userId);

  if (error) {
    return res.status(400).json({ erro: "Erro ao buscar transações" });
  }

  res.json(data);
});

// =========================
// 🔹 ADD TRANSAÇÃO (COM SEGURANÇA)
// =========================
app.post("/transacoes", async (req, res) => {
  const { descricao, valor, tipo, utilizador_id } = req.body;

  const v = Number(valor);

  if (!descricao || !v || !tipo || !utilizador_id) {
    return res.status(400).json({ erro: "Dados inválidos" });
  }

  if (v <= 0) {
    return res.status(400).json({ erro: "Valor tem de ser maior que 0" });
  }

  // 🔹 buscar transações do user
  const { data: transacoes } = await supabase
    .from("transacoes")
    .select("*")
    .eq("utilizador_id", utilizador_id);

  const saldo = (transacoes || []).reduce((t, x) => {
    return x.tipo === "entrada" ? t + x.valor : t - x.valor;
  }, 0);

  // 🚨 impedir saldo negativo
  if (tipo === "saida" && saldo - v < 0) {
    return res.status(400).json({ erro: "Saldo insuficiente 💸" });
  }

  const { data, error } = await supabase
    .from("transacoes")
    .insert([
      {
        descricao,
        valor: v,
        tipo,
        utilizador_id,
      },
    ])
    .select()
    .single();

  if (error) {
    return res.status(400).json({ erro: "Erro ao criar transação" });
  }

  res.json(data);
});

// =========================
// 🔹 DELETE TRANSAÇÃO
// =========================
app.delete("/transacoes/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("transacoes")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(400).json({ erro: "Erro ao eliminar" });
  }

  res.json({ ok: true });
});

// =========================
// 🔹 TEST SUPABASE
// =========================
app.get("/test", async (req, res) => {
  const { data, error } = await supabase
    .from("utilizadores")
    .select("*");

  res.json({ data, error });
});

// =========================
// 🔹 START SERVER
// =========================
app.listen(3000, () => {
  console.log("Servidor a correr em https://carteira-backend.onrender.com");
});