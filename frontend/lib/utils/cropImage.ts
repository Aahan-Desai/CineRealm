export type CropArea = {
  width: number
  height: number
  x: number
  y: number
}

// Adapted from react-easy-crop docs: converts a file + crop selection into a new File.
export async function getCroppedImageFromFile(
  file: File,
  cropAreaPixels: CropArea,
  outputFileName: string,
): Promise<File> {
  const image = await loadImageFromFile(file)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Failed to get canvas context")
  }

  const { width, height, x, y } = cropAreaPixels

  canvas.width = width
  canvas.height = height

  ctx.drawImage(
    image,
    x,
    y,
    width,
    height,
    0,
    0,
    width,
    height,
  )

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"))
          return
        }
        const croppedFile = new File([blob], outputFileName, {
          type: file.type || "image/jpeg",
        })
        resolve(croppedFile)
      },
      file.type || "image/jpeg",
      0.92,
    )
  })
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = reader.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

