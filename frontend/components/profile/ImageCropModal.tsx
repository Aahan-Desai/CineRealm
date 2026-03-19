"use client"

import { useCallback, useState } from "react"
import Cropper, { Area } from "react-easy-crop"
import { getCroppedImageFromFile } from "@/lib/utils/cropImage"

type Props = {
  isOpen: boolean
  file: File | null
  title: string
  aspect: number
  onCancel: () => void
  onComplete: (croppedFile: File, previewUrl: string) => Promise<void> | void
}

export default function ImageCropModal({
  isOpen,
  file,
  title,
  aspect,
  onCancel,
  onComplete,
}: Props) {
  const [zoom, setZoom] = useState(1)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  if (!isOpen || !file) return null

  const fileUrl = URL.createObjectURL(file)

  const handleSave = async () => {
    if (!croppedAreaPixels || !file) return
    try {
      setSubmitting(true)
      const croppedFile = await getCroppedImageFromFile(
        file,
        {
          x: croppedAreaPixels.x,
          y: croppedAreaPixels.y,
          width: croppedAreaPixels.width,
          height: croppedAreaPixels.height,
        },
        file.name,
      )
      const previewUrl = URL.createObjectURL(croppedFile)
      await onComplete(croppedFile, previewUrl)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-[#262A35] bg-[#0F1115] p-4 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#F1F5F9]">{title}</h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-[#9CA3AF] hover:text-[#F1F5F9]"
          >
            Cancel
          </button>
        </div>

        <div className="relative h-72 w-full overflow-hidden rounded-xl bg-[#151821]">
          <Cropper
            image={fileUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={aspect === 1 ? "round" : "rect"}
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1"
          />

          <button
            type="button"
            onClick={handleSave}
            disabled={submitting}
            className="rounded-xl bg-[#E5484D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#E5484D]/80 disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}

