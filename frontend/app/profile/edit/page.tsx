"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { updateProfile } from "@/lib/users"
import { apiFetch } from "@/lib/api"
import ImageCropModal from "@/components/profile/ImageCropModal"

export default function EditProfilePage() {
  const router = useRouter()

  const { user, setUser } = useAuthStore()

  const [mounted, setMounted] = useState(false)

  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [coverUrl, setCoverUrl] = useState("")

  const [loading, setLoading] = useState(false)
  const [cropType, setCropType] = useState<"avatar" | "cover" | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (user) {
      setBio(user.bio || "")
      setAvatarUrl(user.avatarUrl || "")
      setCoverUrl(user.coverUrl || "")
    }
  }, [user])

  if (!mounted) return null

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-400">
        Please login to edit profile.
      </div>
    )
  }

  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    const res = await apiFetch("/uploads", {
      method: "POST",
      body: formData,
    })

    return res.url
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    setCropType("avatar")
    setPendingFile(e.target.files[0])
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    setCropType("cover")
    setPendingFile(e.target.files[0])
  }

  const handleSave = async () => {
    try {
      setLoading(true)

      const updatedUser = await updateProfile({
        bio,
        avatarUrl,
        coverUrl,
      })

      setUser(updatedUser)

      router.push(`/profile/${updatedUser.username}`)
    } catch (err) {
      console.error(err)
      alert("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit Profile</h1>

      <div>
        <label className="block mb-2 text-sm text-gray-400">
          Cover Image
        </label>

        {coverUrl && (
          <img
            src={coverUrl}
            className="w-full h-40 object-cover rounded-lg mb-2"
          />
        )}

        <input type="file" accept="image/*" onChange={handleCoverChange} />
      </div>

      <div>
        <label className="block mb-2 text-sm text-gray-400">
          Avatar
        </label>

        {avatarUrl && (
          <img
            src={avatarUrl}
            className="w-20 h-20 rounded-full mb-2"
          />
        )}

        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>

      <div>
        <label className="block mb-2 text-sm text-gray-400">
          Bio
        </label>

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700"
          rows={4}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-white text-black px-6 py-2 rounded-lg"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
    <ImageCropModal
      isOpen={!!cropType && !!pendingFile}
      file={pendingFile}
      title={cropType === "avatar" ? "Crop avatar" : "Crop cover image"}
      aspect={cropType === "avatar" ? 1 : 16 / 9}
      onCancel={() => {
        setCropType(null)
        setPendingFile(null)
      }}
      onComplete={async (croppedFile, previewUrl) => {
        const url = await handleUpload(croppedFile)
        if (cropType === "avatar") {
          setAvatarUrl(url)
        } else if (cropType === "cover") {
          setCoverUrl(url)
        }
        setCropType(null)
        setPendingFile(null)
      }}
    />
    </>
  )
}