import { useState } from "react";

const initial = { name:"", phone:"", email:"", company:"", logo:"", referrer:"" };

export default function Signup({ onCancel, onSuccess, prefRef = "" }) {
  const [form, setForm] = useState({ ...initial, referrer: prefRef });
  const [err, setErr] = useState("");

  const onChange = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const validPhone = (p) => /^\+?\d{8,15}$/.test(p.replace(/\s/g,""));
  const validName = (n) => n.trim().length >= 2;

  const save = (e) => {
    e.preventDefault();
    setErr("");

    if (!validName(form.company)) return setErr("La empresa es obligatoria.");
    if (!validName(form.name)) return setErr("Nombre de contacto muy corto.");
    if (!validPhone(form.phone)) return setErr("WhatsApp inválido. Ej: +595991234567");

    const user = { ...form, phone: form.phone.replace(/\s/g,"") };
    try {
      localStorage.setItem("user", JSON.stringify(user));
      onSuccess?.(user);
    } catch {
      setErr("No se pudo guardar.");
    }
  };

  return (
    <section style={{padding:"12px 4px 100px"}}>
      <h2 style={{margin:"0 0 12px"}}>Registro de Empresa</h2>

      <form onSubmit={save} style={{ border:"1px solid #e6ecf5", borderRadius:12, padding:14, background:"#fff" }}>
        <label style={{display:"block", marginBottom:8}}>
          <span>Nombre de Empresa *</span>
          <input type="text" value={form.company} onChange={(e)=>onChange("company", e.target.value)}
            style={inputStyle} placeholder="Mi Empresa S.A." autoFocus />
        </label>

        <label style={{display:"block", marginBottom:8}}>
          <span>Logo (URL de imagen)</span>
          <input type="url" value={form.logo} onChange={(e)=>onChange("logo", e.target.value)}
            style={inputStyle} placeholder="https://misitio.com/logo.png" />
        </label>

        <label style={{display:"block", marginBottom:8}}>
          <span>Nombre de contacto *</span>
          <input type="text" value={form.name} onChange={(e)=>onChange("name", e.target.value)}
            style={inputStyle} placeholder="Juan Pérez" />
        </label>

        <label style={{display:"block", marginBottom:8}}>
          <span>WhatsApp *</span>
          <input type="tel" value={form.phone} onChange={(e)=>onChange("phone", e.target.value)}
            style={inputStyle} placeholder="+595 991 234 567" />
        </label>

        <label style={{display:"block", marginBottom:8}}>
          <span>Email (opcional)</span>
          <input type="email" value={form.email} onChange={(e)=>onChange("email", e.target.value)}
            style={inputStyle} placeholder="ventas@miempresa.com" />
        </label>

        {/* Referente */}
        {prefRef ? (
          <p style={{margin:"0 0 12px", opacity:.85}}>Te invitó: <strong>{prefRef}</strong></p>
        ) : (
          <label style={{display:"block", marginBottom:12}}>
            <span>¿Quién te invitó? (alias)</span>
            <input type="text" value={form.referrer} onChange={(e)=>onChange("referrer", e.target.value)}
              style={inputStyle} placeholder="Ej: Luis-Agente" />
          </label>
        )}

        {err && <p style={{color:"#b91c1c", margin:"0 0 10px"}}>{err}</p>}

        <div style={{display:"flex", gap:8}}>
          <button type="submit" style={primaryBtn}>Guardar</button>
          <button type="button" onClick={onCancel} style={ghostBtn}>Cancelar</button>
        </div>
      </form>
    </section>
  );
}

const inputStyle = { width:"100%", padding:"10px 12px", marginTop:6, borderRadius:10, border:"1px solid #d7deea", outline:"none", background:"#fff" };
const primaryBtn = { padding:"10px 14px", borderRadius:10, border:"1px solid #25d366", background:"#25d366", color:"#000", fontWeight:800, cursor:"pointer" };
const ghostBtn   = { padding:"10px 14px", borderRadius:10, border:"1px solid #d7deea", background:"#fff", color:"#0b1730", cursor:"pointer" };
