import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// Cargar MapPicker sólo en cliente
const MapPicker = dynamic(() => import("../components/MapPicker.jsx"), { ssr:false });

export default function ProfilePage(){
  const router = useRouter();
  const [foto, setFoto] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [loc, setLoc] = useState(null); // {lat, lon, label}
  const [verified, setVerified] = useState(false);

  const wrap = { maxWidth: 720, margin: "20px auto", padding: 16 };
  const card = { background: "#0f172a", color: "#e5e7eb", borderRadius: 18, padding: 18, boxShadow: "0 12px 30px rgba(0,0,0,.35)" };
  const row  = { display:"grid", gridTemplateColumns:"1fr", gap:12 };
  const label= { fontSize:14, color:"#cbd5e1", marginBottom:6 };
  const input= { width:"100%", boxSizing:"border-box", background:"#0b1224", color:"#e5e7eb",
                 border:"1px solid #1f2a44", borderRadius:12, padding:"12px 14px", outline:"none" };
  const btn  = (v)=>({ width:"100%", borderRadius:12, padding:"14px 16px",
    border:"1px solid " + (v==="ghost"?"#334155":"transparent"),
    background: v==="primary" ? "#10b981" : v==="ghost" ? "transparent" : "#1f2937",
    color: v==="primary" ? "#052e2b" : "#e5e7eb", fontWeight:700 });

  useEffect(()=>{
    try{
      setVerified(localStorage.getItem("pp.user.verified")==="1" || localStorage.getItem("pp.user.verified")==="true");
      const p = JSON.parse(localStorage.getItem("pp.profile")||"{}");
      if(p){
        setName(p.name||""); setPhone(p.phone||""); setEmail(p.email||"");
        setCity(p.city||""); setAddress(p.address||"");
        if(p.location) setLoc(p.location);
        if(p.photoUrl) setFoto({preview:p.photoUrl});
      }
    }catch{}
  },[]);

  function onPickPhoto(e){
    const f = e.target.files?.[0]; if(!f) return;
    const url = URL.createObjectURL(f); setFoto({file:f, preview:url});
  }

  async function onGuardar(e){
    e?.preventDefault?.();
    const data = {
      name: name.trim(), phone: phone.trim(), email: email.trim(),
      city: city.trim(), address: address.trim(),
      location: loc ? { lat: loc.lat, lon: loc.lon, label: loc.label||"" } : null,
      photoUrl: foto?.preview || null
    };
    localStorage.setItem("pp.profile", JSON.stringify(data));
    localStorage.setItem("pp.profile.ok", "1");
    alert("Perfil guardado ✅");
    try{
      const next = new URLSearchParams(window.location.search).get("next");
      if(next) router.replace(next);
    }catch{}
  }

  function goVerify(){ router.replace("/verify?next=/profile"); }

  return (
    <div style={wrap}>
      <div style={card}>
        {!verified && (
          <div style={{background:"#fef3c7", color:"#1f2937", borderRadius:12, padding:"12px 14px", marginBottom:16, border:"1px solid #f59e0b"}}>
            <div style={{fontWeight:800, marginBottom:6}}>Email sin verificar</div>
            <div style={{fontSize:14, marginBottom:10}}>Debes verificar tu correo para usar Publicar y Mensajes.</div>
            <button onClick={goVerify} style={{...btn("ghost"), width:"auto", padding:"10px 14px", color:"#1f2937"}}>Verificar ahora</button>
          </div>
        )}

        <h2 style={{fontSize:26, fontWeight:800, margin:"4px 0 14px"}}>Perfil</h2>
        <div style={{fontSize:14, color:"#94a3b8", marginBottom:18}}>Completá tus datos y ubicá tu negocio en el mapa.</div>

        <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:16}}>
          <div style={{width:72, height:72, borderRadius:"50%", overflow:"hidden", background:"#0b1224", border:"1px solid #1f2a44",
            display:"flex", alignItems:"center", justifyContent:"center", color:"#64748b"}}>
            {foto?.preview ? <img src={foto.preview} alt="foto" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : "sin foto"}
          </div>
          <label style={{...btn("ghost"), width:"auto", padding:"10px 14px", cursor:"pointer"}}>
            Subir foto
            <input type="file" accept="image/*" onChange={onPickPhoto} style={{display:"none"}}/>
          </label>
          <span style={{marginLeft:"auto", fontSize:12, padding:"4px 10px", borderRadius:999, background: verified ? "#064e3b" : "#3f3f46",
            color:"#e5e7eb", border:"1px solid #1f2a44"}}>Verificado: {verified? "Sí":"No"}</span>
        </div>

        <form onSubmit={onGuardar} style={{display:"grid", gap:14}}>
          <div style={row}>
            <div><div style={label}>Nombre</div><input style={input} placeholder="Tu nombre" value={name} onChange={e=>setName(e.target.value)} /></div>
            <div><div style={label}>Email</div><input style={input} placeholder="tucorreo@dominio.com" value={email} onChange={e=>setEmail(e.target.value)} /></div>
          </div>
          <div style={row}>
            <div><div style={label}>Teléfono</div><input style={input} placeholder="+595..." value={phone} onChange={e=>setPhone(e.target.value)} /></div>
            <div><div style={label}>Ciudad</div><input style={input} placeholder="Asunción, etc." value={city} onChange={e=>setCity(e.target.value)} /></div>
          </div>
          <div>
            <div style={label}>Dirección</div>
            <textarea style={{...input, minHeight:90, resize:"vertical"}}
              placeholder="Calle, número, referencia…" value={address} onChange={e=>setAddress(e.target.value)} />
          </div>

          <div>
            <div style={label}>Ubicación en mapa</div>
            <MapPicker value={loc} onChange={setLoc} />
          </div>

          <button type="submit" style={btn("primary")}>Guardar perfil</button>
        </form>
      </div>
    </div>
  );
}
