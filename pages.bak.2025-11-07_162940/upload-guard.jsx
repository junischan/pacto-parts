import { useEffect } from "react";
import { useRouter } from "next/router";
export default function UploadGuard({ children }){
  const router = useRouter();
  useEffect(()=>{
    try{
      const v = (localStorage.getItem("pp.user.verified")||"").toLowerCase();
      const p = (localStorage.getItem("pp.profile.ok")||"").toLowerCase();
      if(!(v==="1"||v==="true") || !(p==="1"||p==="true")){
        router.replace("/onboard");
      }
    }catch(e){ router.replace("/onboard"); }
  },[router]);
  return children ?? null;
}
