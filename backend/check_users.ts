import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


async function main() {
  const users = await prisma.user.findMany({
    select: { username: true }
  })
  console.log('Registered Users JSON:', JSON.stringify(users, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
