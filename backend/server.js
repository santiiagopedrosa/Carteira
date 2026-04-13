import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 SUPABASE (TEM DE SER REAL)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// =========================
// ROUTES (iguais às tuas)
// =========================

// register
app.post("/register", async (req, res) => {
  const { nome, email, password } = req.body;

  const { data, error } = await supabase
    .from("utilizadores")
    .insert([{ nome, email, password }])
    .select()
    .single();

  if (error) return res.status(400).json({ erro: "Email já existe" });

  res.json(data);
});

// login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase
    .from("utilizadores")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error || !data)
    return res.status(401).json({ erro: "Login inválido" });

  res.json(data);
});

// transações
app.get("/transacoes/:userId", async (req, res) => {
  const { data } = await supabase
    .from("transacoes")
    .select("*")
    .eq("utilizador_id", req.params.userId);

  res.json(data);
});

// add transação
app.post("/transacoes", async (req, res) => {
  const { descricao, valor, tipo, utilizador_id } = req.body;

  const v = Number(valor);

  if (!descricao || !v || !tipo || !utilizador_id)
    return res.status(400).json({ erro: "Dados inválidos" });

  const { data: transacoes } = await supabase
    .from("transacoes")
    .select("*")
    .eq("utilizador_id", utilizador_id);

  const saldo = (transacoes || []).reduce((t, x) => {
    return x.tipo === "entrada" ? t + x.valor : t - x.valor;
  }, 0);

  if (tipo === "saida" && saldo - v < 0)
    return res.status(400).json({ erro: "Saldo insuficiente" });

  const { data, error } = await supabase
    .from("transacoes")
    .insert([{ descricao, valor: v, tipo, utilizador_id }])
    .select()
    .single();

  if (error) return res.status(400).json({ erro: "Erro ao criar" });

  res.json(data);
});

// start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor a correr");
});