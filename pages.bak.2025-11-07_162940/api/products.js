import fs from "fs/promises";
import path from "path";

export default async function handler(req, res){
  const file = path.join(process.cwd(), "data", "products.json");
  if(req.method === "GET"){
    try {
      const data = JSON.parse(await fs.readFile(file, "utf8"));
      return res.status(200).json(data);
    } catch {
      return res.status(200).json([]);
    }
  }
  return res.status(405).json({error:"Method not allowed"});
}
