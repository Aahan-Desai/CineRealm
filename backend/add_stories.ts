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
    oldSlug: "godfather-legacy-of-blood",
    newSlug: "godfather-legacy-of-blood",
    title: "The Godfather: Legacy of Blood",
    poster: "/assets/godfather.png",
    scenes: [
      { title: "The Illusion of Legitimacy", actNumber: 1, sceneOrder: 1, scriptText: "Michael meets with powerful financiers and politicians, presenting a vision of a legitimate empire. But beneath the polished surface, subtle tensions reveal that control is slipping in ways he cannot openly acknowledge." },
      { title: "New Blood", actNumber: 1, sceneOrder: 2, scriptText: "Vincent asserts himself in a violent confrontation, revealing both his capability and his recklessness. Michael sees in him both a successor—and a reflection of everything he fears repeating." },
      { title: "The Cost of Distance", actNumber: 2, sceneOrder: 3, scriptText: "Michael meets Kay after years apart. Their conversation is restrained but heavy with unspoken truths—about family, power, and what cannot be undone." },
      { title: "Fracture", actNumber: 2, sceneOrder: 4, scriptText: "Internal betrayal surfaces as factions within the family begin acting independently. The illusion of unity collapses, forcing Michael to respond with the very methods he tried to abandon." },
      { title: "Inheritance", actNumber: 3, sceneOrder: 5, scriptText: "Michael prepares to pass control, but the realization sets in—there is no clean transfer of power. Only continuation." },
      { title: "Legacy", actNumber: 3, sceneOrder: 6, scriptText: "In solitude, Michael reflects on the empire he built and the cost it demanded. The world moves on—but the weight remains." }
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
      console.error(`Failed to update ${item.oldSlug}:`, err instanceof Error ? err.message : err)
    }
  }
  
  console.log("All stories added successfully!")
}

main().catch(console.error).finally(() => prisma.$disconnect())
