-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('DIALOGUE', 'ACTION');

-- CreateTable
CREATE TABLE "SceneBlock" (
    "id" TEXT NOT NULL,
    "type" "BlockType" NOT NULL,
    "content" TEXT NOT NULL,
    "sceneId" TEXT NOT NULL,
    "characterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SceneBlock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SceneBlock" ADD CONSTRAINT "SceneBlock_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SceneBlock" ADD CONSTRAINT "SceneBlock_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;
