import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  for (const user of users) {
    const lowerEmail = user.email.toLowerCase();
    const lowerUsername = user.username.toLowerCase();
    
    if (user.email !== lowerEmail || user.username !== lowerUsername) {
       await prisma.user.update({
         where: { id: user.id },
         data: { email: lowerEmail, username: lowerUsername }
       })
       console.log(`Updated user ${user.id}: ${user.username} -> ${lowerUsername}, ${user.email} -> ${lowerEmail}`)
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
