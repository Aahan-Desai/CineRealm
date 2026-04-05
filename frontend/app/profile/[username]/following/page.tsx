import { notFound } from "next/navigation"
import { getApiUrl } from "@/lib/api"

async function getFollowing(username: string) {
  const res = await fetch(
    `${getApiUrl()}/users/${username}/following`
  )

  if (!res.ok) return null

  return res.json()
}

export default async function FollowingPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  const data = await getFollowing(username)

  if (!data) return notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">
        Following
      </h1>

      {data.length === 0 ? (
        <p className="text-gray-400">Not following anyone yet.</p>
      ) : (
        <div className="space-y-4">
          {data.map((user: any) => (
            <a
              key={user.id}
              href={`/profile/${user.username}`}
              className="flex items-center gap-4 p-3 rounded-lg bg-black/40 hover:bg-black/60 transition"
            >
              <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    {user.username[0].toUpperCase()}
                  </div>
                )}
              </div>

              <span className="font-medium">
                {user.username}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
