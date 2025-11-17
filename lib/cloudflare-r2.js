import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const r2 = new S3Client({
  region: 'auto',
  endpoint: 'https://0bd1005d5a7304039f40ef6831aa997e.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: '3f995273701467577498cef246666144',
    secretAccessKey: 'c7108437a7ed2652a7135ac160151195d8b6390b745c3c2a73de3dd913d02958'
  }
})

export async function subirFotoR2(file, nombre) {
  const command = new PutObjectCommand({
    Bucket: 'pactonube',
    Key: `productos/${nombre}`,
    Body: file,
    ContentType: 'image/jpeg'
  })
  
  await r2.send(command)
  
  // URL PÚBLICA
  return `https://pub-48ee52c895174d0ab1c34790d522404a.r2.dev/productos/${nombre}`
}
