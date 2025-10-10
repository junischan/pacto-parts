export default function Check() {
  return (
    <div style={{padding:20}}>
      <h1>Test de imagen directa</h1>
      <p>Si ves la imagen abajo, /public/uploads funciona:</p>
      <img src="/uploads/test.jpg" alt="test" style={{maxWidth:320,border:"1px solid #ccc"}} />
      <p>Si no ves nada, renombra alguna imagen a <b>public/uploads/test.jpg</b> y recarga.</p>
    </div>
  );
}
