export default function BottomBar(){
  const focusSearch = () => {
    const el = document.getElementById("q");
    if (el) { el.focus(); el.scrollIntoView({behavior:"smooth", block:"center"}); }
  };
  const goTop = () => window.scrollTo({top:0, behavior:"smooth"});
  const goCats = () => {
    const el = document.getElementById("cats");
    if (el) el.scrollIntoView({behavior:"smooth", block:"start"});
  };
  const openWA = () => {
    const num = "+595991234567".replace(/[^\d]/g,"");
    const msg = encodeURIComponent("Hola! Me interesa un repuesto.");
    window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
  };

  return (
    <nav className="bottom-bar">
      <button className="bbtn" onClick={goTop}>Inicio</button>
      <button className="bbtn" onClick={focusSearch}>Buscar</button>
      <button className="bbtn" onClick={goCats}>Categorías</button>
      <button className="bbtn" onClick={openWA}>WhatsApp</button>
    </nav>
  );
}
