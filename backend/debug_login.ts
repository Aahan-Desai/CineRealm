import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || "test@example.com"
  const password = process.argv[3] || "password123"

  console.log(`Checking login for: ${email}`)

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: email, mode: 'insensitive' } },
        { username: { equals: email, mode: 'insensitive' } }
      ]
    }
  })

  if (!user) {
    console.log("User not found")
    return
  }

  console.log("User found:", user.email)
  const isMatch = await bcrypt.compare(password, user.password)
  console.log("Password match:", isMatch)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
