import prisma from "./src/config/prisma.js"

const movies = [
  {
    slug: "eclipse-protocol",
    poster: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1510511459019-5dee595ec031?q=80&w=2070&auto=format&fit=crop"
  },
  {
    slug: "the-last-orbit",
    poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2070&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1614728263952-84ea206f25b1?q=80&w=1974&auto=format&fit=crop"
  },
  {
    slug: "midnight-cafe",
    poster: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074&auto=format&fit=crop"
  },
  {
    slug: "the-elevator",
    poster: "https://images.unsplash.com/photo-1520697904033-02f6a5b6ceaa?q=80&w=1974&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1563200020-f5592ea88069?q=80&w=2070&auto=format&fit=crop"
  },
  {
    slug: "dark-knight-alternate",
    poster: "https://images.unsplash.com/photo-1470219551729-3893a5482e3e?q=80&w=2072&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop"
  },
  {
    slug: "inception-level-two",
    poster: "https://images.unsplash.com/photo-1493397212122-2b85def82820?q=80&w=2070&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
  }
]

async function main() {
  console.log("Updating premade movie posters...")
  
  for (const item of movies) {
    const movie = await prisma.movie.update({
      where: { slug: item.slug },
      data: {
        posterUrl: item.poster,
        backdropUrl: item.backdrop
      }
    })
    console.log(`Updated: ${movie.title}`)
  }
  
  console.log("All posters updated successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
