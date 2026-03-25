import prisma from "./src/config/prisma.js"

const movieUpdates = [
  {
    oldSlug: "eclipse-protocol",
    newSlug: "eclipse-protocol",
    title: "Eclipse Protocol",
    poster: "/assets/Eclipse Protocol.png",
    scenes: [
      { title: "The Breach", actNumber: 1, sceneOrder: 1, scriptText: "The screen flickers red. 'Access Denied' is no longer a warning, it's a taunt." },
      { title: "Analog Chase", actNumber: 2, sceneOrder: 2, scriptText: "Dr. Aris ditches his phone. In a world of digital trackers, only the physical is safe." },
      { title: "Hard Reboot", actNumber: 3, sceneOrder: 3, scriptText: "The final connection is manual. One wire. One choice. Zero room for error." }
    ]
  },
  {
    oldSlug: "the-last-orbit",
    newSlug: "the-last-orbit",
    title: "The Last Orbit",
    poster: "/assets/The Last Orbit.png",
    scenes: [
      { title: "Static Dreams", actNumber: 1, sceneOrder: 1, scriptText: "Commander Miller stares at the silent comms console. The Earth looks so small from here." },
      { title: "Oxygen Low", actNumber: 2, sceneOrder: 2, scriptText: "Every breath counts. The station groans under the pressure of the void." },
      { title: "The Final Transmission", actNumber: 3, sceneOrder: 3, scriptText: "A choice is made. For the many. For the future." }
    ]
  },
  {
    oldSlug: "midnight-cafe",
    newSlug: "midnight-cafe",
    title: "Midnight Café",
    poster: "/assets/ChatGPT Image Mar 25, 2026, 04_43_28 AM.png",
    scenes: [
      { title: "The Rainy Table", actNumber: 1, sceneOrder: 1, scriptText: "Coffee steam rises in the neon light. Elena looks up. Elias is already standing there." },
      { title: "Shared Shards", actNumber: 2, sceneOrder: 2, scriptText: "Details they shouldn't know. A red umbrella. A forgotten key. All from the same dream." },
      { title: "The Awakening", actNumber: 3, sceneOrder: 3, scriptText: "The sun begins to rise. Does the dream end here, or is this the beginning?" }
    ]
  },
  {
    oldSlug: "the-elevator",
    newSlug: "the-elevator",
    title: "The Elevator",
    poster: "/assets/The Elevator.png",
    scenes: [
      { title: "The Snap", actNumber: 1, sceneOrder: 1, scriptText: "A jolt. A silence. The 4th floor button flickers like a dying heart." },
      { title: "The Mirror Paradox", actNumber: 2, sceneOrder: 2, scriptText: "If I touch the glass, why does the reflection move late?" },
      { title: "Falling Up", actNumber: 3, sceneOrder: 3, scriptText: "Gravity is a suggestion. The doors open to nowhere." }
    ]
  },
  {
    oldSlug: "dark-knight-alternate",
    newSlug: "the-godfather-alternate",
    title: "The Godfather Alternate Ending",
    poster: "https://images.unsplash.com/photo-1470219551729-3893a5482e3e?q=80&w=2072&auto=format&fit=crop",
    scenes: [
      { title: "The Garden Meeting", actNumber: 1, sceneOrder: 1, scriptText: "Don Vito whispers. Michael listens. This time, the answer is 'No'." },
      { title: "Shadows in Sicily", actNumber: 2, sceneOrder: 2, scriptText: "A target on his back. A choice in his heart." },
      { title: "The New Don", actNumber: 3, sceneOrder: 3, scriptText: "The baptism goes on, but the blood stays off his hands." }
    ]
  },
  {
    oldSlug: "inception-level-two",
    newSlug: "inception-level-two",
    title: "Inception: Level Two",
    poster: "/assets/ffc60d22-6a9d-4a1d-949a-4e29885eb87e.png",
    scenes: [
      { title: "The Hallway Twist", actNumber: 1, sceneOrder: 1, scriptText: "The gravity shifts 90 degrees. Cobb runs up the wall." },
      { title: "Subconscious Guard", actNumber: 2, sceneOrder: 2, scriptText: "They are looking for him. Not the projections, but the dream itself." },
      { title: "The Infinite Fall", actNumber: 3, sceneOrder: 3, scriptText: "The top spins. It doesn't matter if it stops." }
    ]
  }
]

async function main() {
  console.log("Adding stories and fixing assets...")
  
  for (const item of movieUpdates) {
    try {
      // Find movie
      const movie = await prisma.movie.findUnique({ where: { slug: item.oldSlug } })
      if (!movie) {
        console.log(`Movie not found: ${item.oldSlug}`)
        continue
      }
      
      // Clear existing scenes to avoid duplicates in manual run
      await prisma.scene.deleteMany({ where: { movieId: movie.id } })
      
      // Update movie and create scenes
      await prisma.movie.update({
        where: { id: movie.id },
        data: {
          title: item.title,
          slug: item.newSlug,
          posterUrl: item.poster,
          scenes: {
            create: item.scenes
          }
        }
      })
      console.log(`Updated Movie and Added Stories for: ${item.title}`)
    } catch (err) {
      console.error(`Failed to update ${item.oldSlug}:`, err.message)
    }
  }
  
  console.log("All stories added successfully!")
}

main().catch(console.error).finally(() => prisma.$disconnect())
