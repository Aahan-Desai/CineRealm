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

  // Movie: Eclipse Protocol
  await prisma.movie.create({
    data: {
      title: "Eclipse Protocol",
      slug: "eclipse-protocol",
      synopsis: "A rogue AI threatens global infrastructure as a cybersecurity expert races against time.",
      isPublished: true,
      visibility: "PUBLIC",
      creatorId: user1.id,
      posterUrl: "/assets/Eclipse Protocol.png",
      backdropUrl: "https://images.unsplash.com/photo-1510511459019-5dee595ec031?q=80&w=2070&auto=format&fit=crop",
      scenes: {
        create: [
          { title: "The Breach", actNumber: 1, sceneOrder: 1, scriptText: "The screen flickers red. 'Access Denied' is no longer a warning, it's a taunt." },
          { title: "Analog Chase", actNumber: 2, sceneOrder: 2, scriptText: "Dr. Aris ditches his phone. In a world of digital trackers, only the physical is safe." },
          { title: "Hard Reboot", actNumber: 3, sceneOrder: 3, scriptText: "The final connection is manual. One wire. One choice. Zero room for error." }
        ]
      }
    }
  })

  // Movie: The Last Orbit
  await prisma.movie.create({
    data: {
      title: "The Last Orbit",
      slug: "the-last-orbit",
      synopsis: "A stranded astronaut must make an impossible choice between survival and saving Earth.",
      isPublished: true,
      visibility: "PUBLIC",
      creatorId: user1.id,
      posterUrl: "/assets/The Last Orbit.png",
      backdropUrl: "https://images.unsplash.com/photo-1614728263952-84ea206f25b1?q=80&w=1974&auto=format&fit=crop",
      scenes: {
        create: [
          { title: "Static Dreams", actNumber: 1, sceneOrder: 1, scriptText: "Commander Miller stares at the silent comms console. The Earth looks so small from here." },
          { title: "Oxygen Low", actNumber: 2, sceneOrder: 2, scriptText: "Every breath counts. The station groans under the pressure of the void." },
          { title: "The Final Transmission", actNumber: 3, sceneOrder: 3, scriptText: "A choice is made. For the many. For the future." }
        ]
      }
    }
  })

  // Movie: Midnight Café
  await prisma.movie.create({
    data: {
      title: "Midnight Café",
      slug: "midnight-cafe",
      synopsis: "Two strangers meet at a late-night café and discover they’ve been dreaming of each other.",
      isPublished: true,
      visibility: "PUBLIC",
      creatorId: user2.id,
      posterUrl: "/assets/ChatGPT Image Mar 25, 2026, 04_43_28 AM.png",
      backdropUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074&auto=format&fit=crop",
      scenes: {
        create: [
          { title: "The Rainy Table", actNumber: 1, sceneOrder: 1, scriptText: "Coffee steam rises in the neon light. Elena looks up. Elias is already standing there." },
          { title: "Shared Shards", actNumber: 2, sceneOrder: 2, scriptText: "Details they shouldn't know. A red umbrella. A forgotten key. All from the same dream." },
          { title: "The Awakening", actNumber: 3, sceneOrder: 3, scriptText: "The sun begins to rise. Does the dream end here, or is this the beginning?" }
        ]
      }
    }
  })

  // Movie: The Elevator
  await prisma.movie.create({
    data: {
      title: "The Elevator",
      slug: "the-elevator",
      synopsis: "An elevator stops between floors, trapping people who slowly realize time isn’t moving.",
      isPublished: true,
      visibility: "PUBLIC",
      creatorId: user2.id,
      posterUrl: "/assets/The Elevator.png",
      backdropUrl: "https://images.unsplash.com/photo-1563200020-f5592ea88069?q=80&w=2070&auto=format&fit=crop",
      scenes: {
        create: [
          { title: "The Snap", actNumber: 1, sceneOrder: 1, scriptText: "A jolt. A silence. The 4th floor button flickers like a dying heart." },
          { title: "The Mirror Paradox", actNumber: 2, sceneOrder: 2, scriptText: "If I touch the glass, why does the reflection move late?" },
          { title: "Falling Up", actNumber: 3, sceneOrder: 3, scriptText: "Gravity is a suggestion. The doors open to nowhere." }
        ]
      }
    }
  })

  // Movie: The Godfather Alternate Ending
  await prisma.movie.create({
    data: {
      title: "The Godfather Alternate Ending",
      slug: "the-godfather-alternate",
      synopsis: "Michael Corleone's path diverges as he chooses a different legacy for the family.",
      isPublished: true,
      visibility: "PUBLIC",
      creatorId: user2.id,
      posterUrl: "https://images.unsplash.com/photo-1470219551729-3893a5482e3e?q=80&w=2072&auto=format&fit=crop",
      backdropUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop",
      scenes: {
        create: [
          { title: "The Garden Meeting", actNumber: 1, sceneOrder: 1, scriptText: "Don Vito whispers. Michael listens. This time, the answer is 'No'." },
          { title: "Shadows in Sicily", actNumber: 2, sceneOrder: 2, scriptText: "A target on his back. A choice in his heart." },
          { title: "The New Don", actNumber: 3, sceneOrder: 3, scriptText: "The baptism goes on, but the blood stays off his hands." }
        ]
      }
    }
  })

  // Movie: Inception: Level Two
  await prisma.movie.create({
    data: {
      title: "Inception: Level Two",
      slug: "inception-level-two",
      synopsis: "Cobb returns to dream infiltration, but this time the dream fights back.",
      isPublished: true,
      visibility: "PUBLIC",
      creatorId: user1.id,
      posterUrl: "/assets/ffc60d22-6a9d-4a1d-949a-4e29885eb87e.png",
      backdropUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
      scenes: {
        create: [
          { title: "The Hallway Twist", actNumber: 1, sceneOrder: 1, scriptText: "The gravity shifts 90 degrees. Cobb runs up the wall." },
          { title: "Subconscious Guard", actNumber: 2, sceneOrder: 2, scriptText: "They are looking for him. Not the projections, but the dream itself." },
          { title: "The Infinite Fall", actNumber: 3, sceneOrder: 3, scriptText: "The top spins. It doesn't matter if it stops." }
        ]
      }
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