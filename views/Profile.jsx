export default function Profile({ user, onCreateAccount, alias, onChangeAlias, onShareInvite, onEditStore }) {
  const hasUser = !!user;
  let store = null; try { store = JSON.parse(localStorage.getItem("store")||"null"); } catch {}
  const isOwner = localStorage.getItem("isOwner")==="1";

  return (
    <section style={{padding:"12px 4px 100px"}}>
      <h2 style={{margin:"0 0 12px"}}>Mi Perfil</h2>

      {/* Ficha de Empresa (publicante) */}
      <div style={{ border:"1px solid #e6ecf5", borderRadius:12, padding:14, background:"#fff", textAlign:"center", marginBottom:12 }}>
        {hasUser ? (
          <>
            {user.logo && <img src={user.logo} alt="Logo" style={{width:80,height:80,objectFit:"contain",marginBottom:12}}/>}
            <h3 style={{margin:"0 0 6px"}}>{user.company}</h3>
            {isOwner && <span style={{fontSize:12,background:"#e7f8ef",border:"1px solid #b6e8c9",padding:"3px 8px",borderRadius:999,marginBottom:8,display:"inline-block"}}>Dueño verificado ✓</span>}
            <p style={{margin:"6px 0"}}><strong>Contacto:</strong> {user.name}</p>
            <p style={{margin:"0 0 6px"}}><strong>WhatsApp:</strong> {user.phone}</p>
            {user.email && <p style={{margin:"0 0 6px"}}><strong>Email:</strong> {user.email}</p>}
            {user.referrer && <p style={{margin:"0 0 6px",opacity:.8}}>Referente: {user.referrer}</p>}
          </>
        ) : (
          <>
            <p style={{margin:"0 0 8px"}}>Aún no registraste tu empresa.</p>
            <button onClick={onCreateAccount} style={primaryBtn}>Crear cuenta</button>
          </>
        )}
      </div>

      {/* Mi Tienda (cómo te ve el cliente) */}
      <div style={{ border:"1px solid #e6ecf5", borderRadius:12, padding:14, background:"#fff", marginBottom:12 }}>
        <h3 style={{margin:"0 0 8px"}}>Mi Tienda</h3>
        <p style={{margin:"0 0 6px"}}><strong>Nombre comercial:</strong> {store?.name || "—"}</p>
        <p style={{margin:"0 0 6px"}}><strong>Dirección:</strong> {store?.address || "—"}</p>
        <p style={{margin:"0 0 6px"}}><strong>Horarios:</strong> {store?.hours || "—"}</p>
        <p style={{margin:"0 0 6px"}}><strong>Pagos:</strong> {store?.payments || "—"}</p>
        <p style={{margin:"0"}}><strong>Entrega:</strong> {store?.delivery || "—"}</p>
        <div style={{marginTop:10}}>
          <button onClick={onEditStore} style={ghostBtn}>Editar tienda</button>
        </div>
      </div>

      {/* Referidos para traer empresas vendedoras */}
      <div style={{ border:"1px solid #e6ecf5", borderRadius:12, padding:14, background:"#fff" }}>
        <h3 style={{margin:"0 0 10px"}}>Programa de referidos</h3>
        <label style={{display:"block", marginBottom:10}}>
          <span>Tu alias de agente</span>
          <input
            type="text"
            value={alias}
            onChange={(e)=> onChangeAlias?.(e.target.value)}
            placeholder="Ej: Luis-Agente"
            style={{width:"100%", padding:"10px 12px", marginTop:6, borderRadius:10, border:"1px solid #d7deea"}}
          />
        </label>
        <button onClick={onShareInvite} style={ghostBtn}>Compartir link de registro</button>
      </div>
    </section>
  );
}

const primaryBtn={padding:"10px 14px",borderRadius:10,border:"1px solid #25d366",background:"#25d366",color:"#000",fontWeight:800,cursor:"pointer"};
const ghostBtn={padding:"10px 14px",borderRadius:10,border:"1px solid #d7deea",background:"#fff",color:"#0b1730",cursor:"pointer"};
