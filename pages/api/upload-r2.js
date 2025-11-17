import { subirFotoR2 } from '../../lib/cloudflare-r2'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { file, nombre } = req.body

    // Convertir base64 a buffer
    const buffer = Buffer.from(file, 'base64')
    
    // Subir a R2
    const url = await subirFotoR2(buffer, nombre)
    
    res.status(200).json({ url })
  } catch (error) {
    console.error('Error uploading to R2:', error)
    res.status(500).json({ error: error.message })
  }
}
