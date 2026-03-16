import { Button } from "@/components/ui/button";
import { loginUser } from "@/lib/auth";
import { registerUser } from "@/lib/auth";

export default function Home() {
  return (
    <div className="p-10">
      <Button>Test Button</Button>
    </div>
  )
}