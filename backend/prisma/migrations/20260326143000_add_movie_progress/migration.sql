-- CreateTable
CREATE TABLE "MovieProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "sceneId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovieProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MovieProgress_userId_movieId_key" ON "MovieProgress"("userId", "movieId");

-- AddForeignKey
ALTER TABLE "MovieProgress" ADD CONSTRAINT "MovieProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieProgress" ADD CONSTRAINT "MovieProgress_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieProgress" ADD CONSTRAINT "MovieProgress_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene"("id") ON DELETE CASCADE ON UPDATE CASCADE;
