import prisma from "./src/config/prisma.js"

async function main() {
  const movies = await prisma.movie.findMany({
    select: {
      id: true,
      title: true,
      slug: true
    }
  })
  console.log(JSON.stringify(movies, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
