import { useState } from "react";
export default function Signup(){
  const [f,setF]=useState({name:"",phone:"",email:""});
  const save=(e)=>{e.preventDefault(); alert("✅ Cuenta enviada (demo)");};
  return (
    <main style={{padding:16,maxWidth:520,margin:"0 auto"}}>
      <h1>Crear cuenta</h1>
      <form onSubmit={save} style={{display:"grid",gap:10}}>
        <input placeholder="Nombre *" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/>
        <input placeholder="Teléfono *" value={f.phone} onChange={e=>setF({...f,phone:e.target.value})}/>
        <input type="email" placeholder="Email" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/>
        <button type="submit" style={{padding:"10px 14px"}}>Crear</button>
      </form>
    </main>
  );
}
