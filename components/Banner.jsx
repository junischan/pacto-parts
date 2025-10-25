export default function Banner(){
  return (
    <div style={{
      position:"relative",
      width:"100%",
      height:"220px",
      overflow:"hidden",
      borderRadius:"0 0 14px 14px",
      boxShadow:"0 4px 20px rgba(0,0,0,.25)"
    }}>
      <img
        src="/pacto-banner.jpg"
        alt="Pacto.parts banner"
        style={{ width:"100%", height:"100%", objectFit:"cover" }}
      />
    </div>
  );
}
