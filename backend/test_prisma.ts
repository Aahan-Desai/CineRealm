import "dotenv/config";
import prisma from "./src/config/prisma.js";

async function test() {
  try {
    const user = await prisma.user.findFirst();
    console.log("Success:", !!user);
  } catch (err) {
    console.error("Error connecting:", err);
  }
}

test();
