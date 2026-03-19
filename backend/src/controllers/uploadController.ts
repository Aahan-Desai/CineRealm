import { Request, Response } from "express"
import cloudinary from "../config/cloudinary.js"
import streamifier from "streamifier"

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const file =
      req.file ??
      (Array.isArray(req.files) && req.files.length > 0
        ? req.files[0]
        : undefined)
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "cinerealm",
            transformation: [
              { width: 800, crop: "limit" },
              { quality: "auto" },
              { fetch_format: "auto" }
            ]
          },
          (error, result) => {
            if (result) resolve(result)
            else reject(error)
          }
        )

        streamifier.createReadStream(file.buffer).pipe(stream)
      })
    }

    const result: any = await streamUpload()

    res.json({
      url: result.secure_url
    })
  } catch (error) {
    res.status(500).json({ message: "Upload failed" })
  }
}