import prisma from "../config/prisma.js"

export const generateUniqueSlug = async (title: string) => {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")

  let slug = baseSlug
  let counter = 1

  while (true) {
    const existingMovie = await prisma.movie.findUnique({
      where: { slug }
    })

    if (!existingMovie) {
      return slug
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }
}