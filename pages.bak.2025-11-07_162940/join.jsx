import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Join(){
  const router = useRouter();
  const [name,setName]   = useState('');
  const [email,setEmail] = useState('');
  const [code,setCode]   = useState('');
  const [sent,setSent]   = useState(false);
  const [loading,setLoading] = useState(false);
  const next = (typeof window!=='undefined'
    ? (new URLSearchParams(window.location.search).get('next') || '/')
    : '/'
  );

  // si ya está verificado, salir
  useEffect(()=>{
    try{
      if(localStorage.getItem('pp.user.verified')==='1'){
        router.replace(next);
      }
    }catch{}
  },[]);

  async function send(){
    if(!email) return alert('Poné tu email');
    setLoading(true);
    const r = await fetch('/api/sendCode',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({to:email})
    });
    setSent(r.ok);
    setLoading(false);
    if(!r.ok) alert('No pude enviar el código');
  }

  async function verify(){
    if(!code) return alert('Código?');
    setLoading(true);
    const r = await fetch('/api/verifyCode',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email,code})
    });
    const ok = r.ok;
    setLoading(false);
    if(!ok) return alert('Código inválido');

    const user = { name: name||email.split('@')[0], email, verified:true, ts:Date.now() };
    try{
      localStorage.setItem('pp.user', JSON.stringify(user));
      localStorage.setItem('pp.user.verified','1');
    }catch{}
    router.replace(next);
  }

  return (
    <div style={{padding:20, maxWidth:480, margin:'0 auto'}}>
      <h1 style={{fontWeight:800, fontSize:22, marginBottom:12}}>Crear perfil</h1>

      <label>Nombre</label>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre"
             style={{width:'100%',padding:12,margin:'6px 0 12px',borderRadius:10,border:'1px solid #ddd'}}/>

      <label>Email</label>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com" inputMode="email"
             style={{width:'100%',padding:12,margin:'6px 0 12px',borderRadius:10,border:'1px solid #ddd'}}/>

      {!sent ? (
        <button onClick={send} disabled={loading}
                style={{padding:'12px 16px',borderRadius:12,background:'#0ea66c',color:'#fff',fontWeight:700}}>
          {loading?'Enviando...':'Enviar código'}
        </button>
      ) : (
        <>
          <label style={{display:'block',marginTop:14}}>Código recibido</label>
          <input value={code} onChange={e=>setCode(e.target.value)} placeholder="123456" inputMode="numeric"
                 style={{width:'100%',padding:12,margin:'6px 0 12px',borderRadius:10,border:'1px solid #ddd',letterSpacing:2,fontWeight:700}}/>
          <button onClick={verify} disabled={loading}
                  style={{padding:'12px 16px',borderRadius:12,background:'#0ea66c',color:'#fff',fontWeight:700}}>
            {loading?'Verificando...':'Confirmar y continuar'}
          </button>
          <div style={{marginTop:10}}>
            <button onClick={send}
                    style={{padding:'6px 10px',borderRadius:10,border:'1px solid #ddd',background:'#fff'}}>
              Reenviar código
            </button>
          </div>
        </>
      )}
    </div>
  );
}
