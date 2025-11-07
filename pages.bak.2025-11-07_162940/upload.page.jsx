import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function UploadGuardWrapper(){
  const router = useRouter();
  useEffect(()=>{
    try{
      const ok = (localStorage.getItem("pp.user.verified") === "1" || localStorage.getItem("pp.user.verified") === "true");
      if(!ok){ router.replace("/verify"); }
    }catch(e){}
  },[router]);
  return <UploadPage />;
}

function UploadPage(){

function UploadPage() {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [galeria, setGaleria] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/list-uploads");
        const j = await r.json();
        setGaleria(j.files || []);
      } catch {}
    })();
  }, []);

  async function subir(e) {
    e.preventDefault();
    if (!files.length) return alert("Elegí al menos una imagen.");

    try {
      for (const f of files) {
        const fd = new FormData();
        fd.append("file", f);
        fd.append("title", title || f.name);

        const r = await fetch("/api/upload", { method: "POST", body: fd });
        const j = await r.json();
        if (!j.ok) {
          alert("Error al subir: " + (j.msg || "desconocido"));
        } else {
          const urls = Array.isArray(j.url) ? j.url : [j.url];
          setGaleria((g) => [...urls, ...g]);
        }
      }
    } finally {
      // Limpiar estados + input file sin usar .reset()
      setTitle("");
      setFiles([]);
      const inp = document.getElementById("fileInput");
      if (inp) inp.value = "";
    }
  }

  return (
    <div style={{ padding: 16, color: "#fff", background: "#111", minHeight: "100vh" }}>
      <h1>🧰 Prueba de subida y galería</h1>
      <form onSubmit={subir} style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
        <input
          placeholder="Título (opcional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: 8, borderRadius: 8 }}
        />
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
        />
        <button type="submit" style={{ gridColumn: "1 / span 2", padding: 12, borderRadius: 12 }}>
          Subir imagen(es)
        </button>
      </form>

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {galeria.map((src) => (
          <figure key={src} style={{ margin: 0, background: "#222", borderRadius: 12, overflow: "hidden" }}>
            <img src={src} alt="" style={{ width: "100%", display: "block" }} />
            <figcaption style={{ padding: 8, fontSize: 12, color: "#bbb" }}>{src.split("/").pop()}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

}
