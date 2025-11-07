import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Onboard(){
  const router = useRouter();

  useEffect(() => {
    try{
      const v = (localStorage.getItem("pp.user.verified")||"").toLowerCase();
      const verified = (v === "1" || v === "true");

      const p = (localStorage.getItem("pp.profile.ok")||"").toLowerCase();
      const hasProfile = (p === "1" || p === "true");

      if(!verified){
        router.replace("/verify?next=/onboard");           // 1) verificar email
        return;
      }
      if(!hasProfile){
        router.replace("/profile?setup=1&next=/onboard");  // 2) completar perfil
        return;
      }
      router.replace("/nuevo");                            // 3) ya puede publicar
    }catch(e){
      console.error("[onboard]", e);
      router.replace("/verify?next=/onboard");
    }
  }, [router]);

  return <div style={{padding:20}}>Preparando tu acceso…</div>;
}
