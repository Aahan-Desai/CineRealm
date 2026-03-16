"use client"

import { useState } from "react"
import { registerUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function RegisterPage() {
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    try {
      setLoading(true)

      await registerUser({
        username,
        email,
        password
      })

      alert("Account created successfully!")

      router.push("/login")

    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center mt-20">
      <Card className="w-[420px]">
        <CardContent className="space-y-4 pt-6">

          <h2 className="text-xl font-semibold">
            Create Account
          </h2>

          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}

          <Input
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <Input
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <Button
            onClick={handleRegister}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <a href="/login" className="underline">
              Login
            </a>
          </p>
            
        </CardContent>
      </Card>
    </div>
  )
}