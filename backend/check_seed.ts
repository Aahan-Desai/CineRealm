import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  const movie = await prisma.movie.findFirst({
    where: { slug: 'the-elevator' },
    include: {
      scenes: {
        include: {
          blocks: true,
          choices: true
        }
      },
      characters: true
    }
  })

  if (!movie) {
    console.log('Movie NOT found')
    return
  }

  console.log(`Movie: ${movie.title}`)
  console.log(`Runtime: ${movie.runtime}`)
  console.log(`CreationType: ${movie.creationType}`)
  console.log(`Scenes count: ${movie.scenes.length}`)
  console.log(`Characters count: ${movie.characters.length}`)
  
  const scene1 = movie.scenes.find(s => s.sceneOrder === 1)
  if (scene1) {
    console.log(`Scene 1 blocks: ${scene1.blocks.length}`)
    console.log(`Scene 1 choices: ${scene1.choices.length}`)
  }
}

check().finally(() => prisma.$disconnect())
