import prisma from "./src/config/prisma.js"

async function main() {
  console.log("Updating Inception: Level Two poster URL...")
  
  const movie = await prisma.movie.update({
    where: { slug: "inception-level-two" },
    data: {
      posterUrl: "/assets/ffc60d22-6a9d-4a1d-949a-4e29885eb87e.png"
    }
  })
  
  console.log(`Updated successfully: ${movie.title}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
