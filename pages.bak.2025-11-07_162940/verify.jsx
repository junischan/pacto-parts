import { useState } from "react";
import { useRouter } from "next/router";

export default function VerifyPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");

  async function handleSend() {
    const res = await fetch("/api/sendCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: email, code: "123456" }),
    });
    const j = await res.json();
    if (j.ok) {
      setMsg("Código enviado a " + email);
      setStep(2);
    } else {
      setMsg("Error: " + (j.error || "no se pudo enviar"));
    }
  }

  async function handleVerify() {
    const res = await fetch("/api/verifyCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const j = await res.json();
    if (j.ok) {
      localStorage.setItem("pp.user.verified", "1");
      const next = router.query.next || "/";
      router.replace(next);
    } else {
      setMsg("Código incorrecto o vencido.");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Verificación de usuario</h1>
      {step === 1 ? (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo"
            style={{ width: "100%", padding: 8 }}
          />
          <button onClick={handleSend}>Enviar código</button>
        </>
      ) : (
        <>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Código recibido"
            style={{ width: "100%", padding: 8 }}
          />
          <button onClick={handleVerify}>Verificar</button>
        </>
      )}
      <p>{msg}</p>
    </div>
  );
}
