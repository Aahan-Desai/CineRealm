import prisma from "../src/config/prisma.js"

async function main() {
  const user1 = await prisma.user.create({
    data: {
      username: "cinestudio",
      email: "studio@test.com",
      password: "hashedpassword"
    }
  })

  const user2 = await prisma.user.create({
    data: {
      username: "storycrafter",
      email: "crafter@test.com",
      password: "hashedpassword"
    }
  })

  await prisma.movie.create({
    data: {
      title: "Eclipse Protocol",
      slug: "eclipse-protocol",
      synopsis:
        "A rogue AI threatens global infrastructure as a cybersecurity expert races against time.",
      isPublished: true,
      visibility: "PUBLIC",
      creatorId: user1.id,
      posterUrl: "",
    }
  })

  await prisma.movie.create({
    data: {
      title: "The Last Orbit",
      slug: "the-last-orbit",
      synopsis:
        "A stranded astronaut must make an impossible choice between survival and saving Earth.",
      isPublished: true,
      visibility: "PUBLIC",
      creatorId: user1.id,
    }
  })

  await prisma.movie.create({
    data: {
      title: "Midnight Café",
      slug: "midnight-cafe",
      synopsis:
        "Two strangers meet at a late-night café and discover they’ve been dreaming of each other.",
      isPublished: true,
      visibility: "PUBLIC",
      creatorId: user2.id,
    }
  })

  await prisma.movie.create({
    data: {
      title: "The Elevator",
      slug: "the-elevator",
      synopsis:
        "An elevator stops between floors, trapping people who slowly realize time isn’t moving.",
      isPublished: true,
      visibility: "PUBLIC",
      creatorId: user2.id,
    }
  })

  await prisma.movie.create({
    data: {
      title: "The Dark Knight: Alternate Ending",
      slug: "dark-knight-alternate",
      synopsis:
        "Batman reveals his identity instead of taking the fall, changing Gotham forever.",
      isPublished: true,
      visibility: "PUBLIC",
      creatorId: user2.id,
    }
  })

  await prisma.movie.create({
    data: {
      title: "Inception: Level Two",
      slug: "inception-level-two",
      synopsis:
        "Cobb returns to dream infiltration, but this time the dream fights back.",
      isPublished: true,
      visibility: "PUBLIC",
      creatorId: user1.id,
    }
  })

  await prisma.movie.create({
    data: {
      title: "Untitled Draft Project",
      slug: "draft-project",
      synopsis: "Work in progress...",
      isPublished: false,
      visibility: "PRIVATE",
      creatorId: user1.id,
    }
  })

  console.log("Seed data created")
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })