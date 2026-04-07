import prisma from "../src/config/prisma.js"

type RichCharacterSeed = {
  key: string
  name: string
  actorName: string
  avatarUrl?: string
  role: "Protagonist" | "Antagonist" | "Supporting"
  traits: string
  shortBio: string
}

type RichSceneSeed = {
  title: string
  actNumber: number
  sceneOrder: number
  location: string
  mood: "Tense" | "Calm" | "Chaos" | "Romantic" | "Mystery" | "Action"
  scriptText: string
  characterKeys: string[]
  blocks: Array<{
    type: "DIALOGUE" | "ACTION"
    content: string
    characterKey?: string
  }>
  choices: Array<{
    text: string
    outcomeText: string
  }>
}

async function seedTheElevator({
  creatorId,
}: {
  creatorId: string
}) {
  const movie = await prisma.movie.create({
    data: {
      title: "The Elevator",
      slug: "the-elevator",
      genre: "Mystery Thriller",
      runtime: 108,
      synopsis:
        "When a midnight elevator stalls inside a luxury high-rise during a citywide blackout, six strangers discover the car is no longer trapped between floors, but between moments. As memories begin repeating out of sequence and the elevator starts answering questions no machine should understand, a paramedic, a disgraced architect, and a child witness piece together a cover-up buried in the building's foundation. To escape, they must decide whether to expose the truth or let the tower keep feeding on everyone who tries to reach the top.",
      isPublished: true,
      visibility: "PUBLIC",
      creatorId,
      posterUrl: "/assets/The Elevator.png",
      backdropUrl:
        "https://images.unsplash.com/photo-1563200020-f5592ea88069?q=80&w=2070&auto=format&fit=crop",
    },
  })

  const characters: RichCharacterSeed[] = [
    {
      key: "elena",
      name: "Elena Ward",
      actorName: "Rebecca Ferguson",
      role: "Protagonist",
      traits: "Composed, Empathetic, Quick-thinking",
      shortBio:
        "A night-shift paramedic heading home after a brutal double shift. Elena stays calm under pressure, but the elevator begins surfacing a loss she has never fully processed.",
    },
    {
      key: "adrian",
      name: "Adrian Vale",
      actorName: "Oscar Isaac",
      role: "Antagonist",
      traits: "Controlled, Brilliant, Secretive",
      shortBio:
        "The building's celebrated architect. Adrian knows more about the tower's impossible design than he admits, and his confidence starts to crack as the elevator turns hostile.",
    },
    {
      key: "naomi",
      name: "Naomi Price",
      actorName: "Jodie Comer",
      role: "Supporting",
      traits: "Sharp, Defiant, Perceptive",
      shortBio:
        "An investigative journalist who came to the tower chasing a corruption lead. Naomi notices patterns before anyone else and refuses to let fear override the facts.",
    },
    {
      key: "miles",
      name: "Miles Chen",
      actorName: "Steven Yeun",
      role: "Supporting",
      traits: "Practical, Loyal, Restless",
      shortBio:
        "A freelance electrical technician who recognizes that the elevator's failures don't behave like normal outages. He becomes Elena's closest ally when the car starts rewriting its own logic.",
    },
    {
      key: "evelyn",
      name: "Evelyn Shaw",
      actorName: "Olivia Colman",
      role: "Supporting",
      traits: "Observant, Weary, Maternal",
      shortBio:
        "A retired judge with a talent for reading people. Evelyn masks her fear with dry wit, but she is the first to suspect the elevator is testing them rather than trapping them.",
    },
    {
      key: "leo",
      name: "Leo Mercer",
      actorName: "Noah Jupe",
      role: "Supporting",
      traits: "Quiet, Intuitive, Unsettling",
      shortBio:
        "A boy traveling alone with a sketchbook full of floors that don't exist on the directory. Leo seems strangely unsurprised by the elevator's behavior.",
    },
    {
      key: "voice",
      name: "The Intercom Voice",
      actorName: "Cillian Murphy",
      role: "Supporting",
      traits: "Calm, Ominous, Omniscient",
      shortBio:
        "A disembodied voice that slips through the elevator speakers whenever the lights dim. It knows the passengers' regrets, and it speaks as if the building itself is awake.",
    },
  ]

  const createdCharacters = await Promise.all(
    characters.map((character) =>
      prisma.character.create({
        data: {
          movieId: movie.id,
          name: character.name,
          actorName: character.actorName,
          avatarUrl: character.avatarUrl,
          role: character.role,
          traits: character.traits,
          shortBio: character.shortBio,
        },
      })
    )
  )

  const characterIdByKey = createdCharacters.reduce<Record<string, string>>((acc, character, index) => {
    acc[characters[index].key] = character.id
    return acc
  }, {})

  const scenes: RichSceneSeed[] = [
    {
      title: "Floor 17.5",
      actNumber: 1,
      sceneOrder: 1,
      location: "INT. ARGENT TOWER ELEVATOR - NIGHT",
      mood: "Mystery",
      scriptText:
        "The elevator shudders to a stop during a blackout, leaving six strangers sealed inside a mirrored box suspended between the seventeenth and eighteenth floors. Their phones die at once. When the emergency display blinks '17.5,' they realize the building is acknowledging a floor that should not exist.",
      characterKeys: ["elena", "adrian", "naomi", "miles", "evelyn", "leo"],
      blocks: [
        {
          type: "ACTION",
          content:
            "Darkness swallows the glass-and-steel elevator. A backup strip light stutters on, painting each passenger in a sick amber pulse while the floor display mutates from 17 to 17.5.",
        },
        {
          type: "DIALOGUE",
          characterKey: "miles",
          content:
            "That isn't a power dip. Something in the control logic just reset itself.",
        },
        {
          type: "DIALOGUE",
          characterKey: "elena",
          content:
            "Everyone breathe. We conserve light, we stay put, and we don't panic until we know what failed.",
        },
        {
          type: "DIALOGUE",
          characterKey: "adrian",
          content:
            "This building doesn't have a half-floor. The panel is wrong.",
        },
        {
          type: "ACTION",
          content:
            "Leo quietly opens his sketchbook. On the page is a child's drawing of the elevator doors opening onto a corridor labeled 17.5.",
        },
        {
          type: "DIALOGUE",
          characterKey: "leo",
          content:
            "It was always here. Grown-ups just never stop long enough to see it.",
        },
      ],
      choices: [
        {
          text: "Force the emergency call button",
          outcomeText:
            "The speaker crackles alive, but no operator answers. Instead, a calm voice whispers Elena's full name and asks why she couldn't save the girl in the ambulance last winter.",
        },
        {
          text: "Pry open the doors by hand",
          outcomeText:
            "The doors part an inch, revealing concrete where the shaft should be. Something knocks once from the other side, as if it heard them trying.",
        },
      ],
    },
    {
      title: "The Delay in the Mirror",
      actNumber: 1,
      sceneOrder: 2,
      location: "INT. ARGENT TOWER ELEVATOR - LATER",
      mood: "Tense",
      scriptText:
        "Minutes stretch strangely inside the stalled car. Reflections begin lagging behind the passengers by a heartbeat, then two. Naomi notices the mirrors are not showing the present moment but fragments of what each person is about to do next.",
      characterKeys: ["elena", "naomi", "adrian", "evelyn", "leo"],
      blocks: [
        {
          type: "ACTION",
          content:
            "Naomi wipes condensation from the mirror and freezes. Her reflection is still looking over her shoulder even after she turns away.",
        },
        {
          type: "DIALOGUE",
          characterKey: "naomi",
          content:
            "Don't move. The mirror is late. No... it's ahead.",
        },
        {
          type: "ACTION",
          content:
            "Evelyn lifts a hand. In the reflection, her fingers are already touching the emergency hatch before the real gesture finishes.",
        },
        {
          type: "DIALOGUE",
          characterKey: "evelyn",
          content:
            "I've spent my life watching witnesses lie. That mirror isn't lying. It's warning us.",
        },
        {
          type: "DIALOGUE",
          characterKey: "adrian",
          content:
            "Argent Tower uses reflective safety glass layered over a sensor mesh. If the system is replaying predictive data, someone built that possibility in.",
        },
        {
          type: "DIALOGUE",
          characterKey: "elena",
          content:
            "Then stop talking like this is abstract. Tell us who would build a building that predicts panic.",
        },
      ],
      choices: [
        {
          text: "Ask Adrian what he hid in the design",
          outcomeText:
            "Adrian admits the tower was commissioned with a private 'behavioral stress lab' sealed between the public floors. He claims it was never activated after construction.",
        },
        {
          text: "Follow Leo's reflection instead of Leo",
          outcomeText:
            "The reflection points to a seam beneath the handrail. Behind it, Naomi finds a maintenance key and a tiny lens still recording.",
        },
      ],
    },
    {
      title: "Playback",
      actNumber: 2,
      sceneOrder: 3,
      location: "INT. SERVICE VOID ADJACENT TO THE ELEVATOR SHAFT - NIGHT",
      mood: "Chaos",
      scriptText:
        "Using the hidden maintenance key, the group opens a service panel and uncovers a concealed monitor wall embedded inside the shaft. The screens play old footage from prior elevator failures, each one ending with passengers making impossible choices under the same strange intercom guidance.",
      characterKeys: ["elena", "naomi", "miles", "adrian", "voice"],
      blocks: [
        {
          type: "ACTION",
          content:
            "Miles removes the steel access plate. Behind it, a narrow cavity glows with a bank of dusty surveillance screens wired into hardware far older than the tower itself.",
        },
        {
          type: "DIALOGUE",
          characterKey: "miles",
          content:
            "These circuits were retrofitted. Not by maintenance. By someone who wanted this box to become a lab rat maze.",
        },
        {
          type: "ACTION",
          content:
            "One monitor shows the same elevator in 1998. Another in 2007. Another in the present. In every feed, the passengers are trapped at 17.5.",
        },
        {
          type: "DIALOGUE",
          characterKey: "naomi",
          content:
            "These aren't accidents. Someone kept repeating the event until they got the outcome they wanted.",
        },
        {
          type: "DIALOGUE",
          characterKey: "voice",
          content:
            "Correction: until the building learned which people break first and which ones open the right door.",
        },
        {
          type: "DIALOGUE",
          characterKey: "adrian",
          content:
            "I designed a hidden floor for investor demos. Not this. Not a machine that studies trauma.",
        },
      ],
      choices: [
        {
          text: "Destroy the monitor bank",
          outcomeText:
            "Miles smashes one screen and every display instantly switches to a live close-up of the elevator interior, including angles that should not physically exist.",
        },
        {
          text: "Watch the oldest recording to the end",
          outcomeText:
            "The oldest footage ends with a passenger who looks exactly like Leo stepping out alone while everyone else vanishes from the frame.",
        },
      ],
    },
    {
      title: "The Passenger Who Remembers",
      actNumber: 2,
      sceneOrder: 4,
      location: "INT. ARGENT TOWER ELEVATOR - LOOPED MIDNIGHT",
      mood: "Calm",
      scriptText:
        "After a violent flicker, the elevator resets to its original configuration as if nothing happened. Only Leo remembers the previous loop clearly. He reveals that this is not the first time he has ridden the half-floor and that the building is trying to find one person willing to trade memory for escape.",
      characterKeys: ["elena", "leo", "evelyn", "naomi", "voice"],
      blocks: [
        {
          type: "ACTION",
          content:
            "The floor display returns to 17. The emergency alarm silences. Everyone's wounds and torn clothing are briefly restored, then fray again as memory catches up with time.",
        },
        {
          type: "DIALOGUE",
          characterKey: "leo",
          content:
            "You keep waking up at the same stop. I don't. I stay here when you all start over.",
        },
        {
          type: "DIALOGUE",
          characterKey: "elena",
          content:
            "How many times has this happened?",
        },
        {
          type: "DIALOGUE",
          characterKey: "leo",
          content:
            "Enough that I know the building prefers people who think sacrifice makes them innocent.",
        },
        {
          type: "DIALOGUE",
          characterKey: "evelyn",
          content:
            "Then we stop offering it guilt. We give it testimony.",
        },
        {
          type: "DIALOGUE",
          characterKey: "voice",
          content:
            "Confession and testimony are the same thing inside a closed system.",
        },
      ],
      choices: [
        {
          text: "Ask Leo who escaped last time",
          outcomeText:
            "Leo says no one escaped. One person was simply allowed to forget enough to keep living, which is not the same thing.",
        },
        {
          text: "Record everyone's memories out loud",
          outcomeText:
            "Naomi begins a voice memo on her dead phone anyway. The blank screen starts transcribing every word in glowing text.",
        },
      ],
    },
    {
      title: "Counterweight",
      actNumber: 3,
      sceneOrder: 5,
      location: "INT. SHAFT MAINTENANCE BRIDGE / ABOVE FLOOR 17.5",
      mood: "Action",
      scriptText:
        "Miles and Elena climb onto a maintenance bridge above the car to reach the counterweight lock, hoping to force the elevator down to a real floor. Adrian confesses that the hidden level was funded to model crowd behavior during controlled crises, and the group realizes the tower has been feeding on recorded human fear for decades.",
      characterKeys: ["elena", "miles", "adrian", "naomi", "voice"],
      blocks: [
        {
          type: "ACTION",
          content:
            "The hatch grinds open. Elena and Miles pull themselves into the shaft, balancing on a narrow steel beam while cables hum around them like live nerves.",
        },
        {
          type: "DIALOGUE",
          characterKey: "miles",
          content:
            "On my count, we trip the counterweight and drop the car manually. If this thing thinks it's in charge, we make gravity vote.",
        },
        {
          type: "DIALOGUE",
          characterKey: "adrian",
          content:
            "The investors wanted a predictive environment. A place where panic could be measured, replayed, perfected. I told myself it would never go operational.",
        },
        {
          type: "DIALOGUE",
          characterKey: "naomi",
          content:
            "You don't get points for regret after building a machine that rehearses human collapse.",
        },
        {
          type: "ACTION",
          content:
            "The cables tense. The car lurches upward instead of down, dragging Elena toward a black opening hidden above the shaft.",
        },
        {
          type: "DIALOGUE",
          characterKey: "voice",
          content:
            "Ascension was always the preferred pathway. Descent is what frightened people ask for.",
        },
      ],
      choices: [
        {
          text: "Cut the power to the counterweight",
          outcomeText:
            "Miles severs the auxiliary line. Sparks rain through the shaft and the elevator finally drops half a floor, aligning the doors with a corridor marked RESEARCH LEVEL 17.5.",
        },
        {
          text: "Let the car rise toward the hidden opening",
          outcomeText:
            "The car climbs into a vault of mirrors and servers where dozens of archived passenger recordings turn their heads in perfect unison.",
        },
      ],
    },
    {
      title: "The Door to Zero",
      actNumber: 3,
      sceneOrder: 6,
      location: "INT. RESEARCH LEVEL 17.5 - PREDAWN",
      mood: "Mystery",
      scriptText:
        "The doors open onto the sealed research floor where the building's original experiment still runs on analog backups and archived confessions. Elena realizes the system can be shut down only by replacing its predictive model with a truthful, collective account. Instead of offering one sacrificial memory, the survivors choose to expose everything together.",
      characterKeys: ["elena", "adrian", "naomi", "miles", "evelyn", "leo", "voice"],
      blocks: [
        {
          type: "ACTION",
          content:
            "Rows of tape reels spin behind glass. Each label bears a date, an elevator incident, and a list of emotional responses scored like research data.",
        },
        {
          type: "DIALOGUE",
          characterKey: "elena",
          content:
            "It doesn't want blood. It wants a story clean enough to file away and repeat. So we give it the mess it can't control.",
        },
        {
          type: "DIALOGUE",
          characterKey: "naomi",
          content:
            "Every name, every sponsor, every floor they buried. I publish it all if we walk out.",
        },
        {
          type: "DIALOGUE",
          characterKey: "adrian",
          content:
            "Then use my access. I started this tower. Let me be the one who opens it.",
        },
        {
          type: "DIALOGUE",
          characterKey: "voice",
          content:
            "Shared testimony introduces variance. Variance collapses prediction. Prediction is the only mercy architecture can offer.",
        },
        {
          type: "ACTION",
          content:
            "Leo places his sketchbook on the central console. The child's drawing rewrites itself into the elevator doors opening on daylight. One by one, the others speak their truths into the intercom until every monitor floods white.",
        },
      ],
      choices: [
        {
          text: "Publish the tower's hidden archive",
          outcomeText:
            "Sirens rise outside as emergency lights finally return. Argent Tower becomes the center of a public scandal, and the half-floor is sealed as evidence instead of myth.",
        },
        {
          text: "Erase the archive and walk away",
          outcomeText:
            "The tapes burn, the research floor vanishes, and the survivors reach the lobby alive, but each of them leaves the building with one precise memory missing.",
        },
      ],
    },
  ]

  for (const scene of scenes) {
    await prisma.scene.create({
      data: {
        movieId: movie.id,
        title: scene.title,
        actNumber: scene.actNumber,
        sceneOrder: scene.sceneOrder,
        location: scene.location,
        mood: scene.mood,
        scriptText: scene.scriptText,
        characters: {
          create: scene.characterKeys.map((characterKey) => ({
            characterId: characterIdByKey[characterKey],
          })),
        },
        blocks: {
          create: scene.blocks.map((block) => ({
            type: block.type,
            content: block.content,
            ...(block.characterKey
              ? {
                  characterId: characterIdByKey[block.characterKey],
                }
              : {}),
          })),
        },
        choices: {
          create: scene.choices,
        },
      },
    })
  }
}

async function main() {
  const user1 = await prisma.user.create({
    data: {
      username: "cinestudio",
      email: "studio@test.com",
      password: "hashedpassword",
    },
  })

  const user2 = await prisma.user.create({
    data: {
      username: "storycrafter",
      email: "crafter@test.com",
      password: "hashedpassword",
    },
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
      posterUrl: "/assets/Eclipse Protocol.png",
      backdropUrl:
        "https://images.unsplash.com/photo-1510511459019-5dee595ec031?q=80&w=2070&auto=format&fit=crop",
      scenes: {
        create: [
          {
            title: "The Breach",
            actNumber: 1,
            sceneOrder: 1,
            scriptText:
              "The screen flickers red. 'Access Denied' is no longer a warning, it's a taunt.",
          },
          {
            title: "Analog Chase",
            actNumber: 2,
            sceneOrder: 2,
            scriptText:
              "Dr. Aris ditches his phone. In a world of digital trackers, only the physical is safe.",
          },
          {
            title: "Hard Reboot",
            actNumber: 3,
            sceneOrder: 3,
            scriptText:
              "The final connection is manual. One wire. One choice. Zero room for error.",
          },
        ],
      },
    },
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
      posterUrl: "/assets/The Last Orbit.png",
      backdropUrl:
        "https://images.unsplash.com/photo-1614728263952-84ea206f25b1?q=80&w=1974&auto=format&fit=crop",
      scenes: {
        create: [
          {
            title: "Static Dreams",
            actNumber: 1,
            sceneOrder: 1,
            scriptText:
              "Commander Miller stares at the silent comms console. The Earth looks so small from here.",
          },
          {
            title: "Oxygen Low",
            actNumber: 2,
            sceneOrder: 2,
            scriptText:
              "Every breath counts. The station groans under the pressure of the void.",
          },
          {
            title: "The Final Transmission",
            actNumber: 3,
            sceneOrder: 3,
            scriptText: "A choice is made. For the many. For the future.",
          },
        ],
      },
    },
  })

  await prisma.movie.create({
    data: {
      title: "Midnight CafÃ©",
      slug: "midnight-cafe",
      synopsis:
        "Two strangers meet at a late-night cafÃ© and discover theyâ€™ve been dreaming of each other.",
      isPublished: true,
      visibility: "PUBLIC",
      creatorId: user2.id,
      posterUrl: "/assets/ChatGPT Image Mar 25, 2026, 04_43_28 AM.png",
      backdropUrl:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074&auto=format&fit=crop",
      scenes: {
        create: [
          {
            title: "The Rainy Table",
            actNumber: 1,
            sceneOrder: 1,
            scriptText:
              "Coffee steam rises in the neon light. Elena looks up. Elias is already standing there.",
          },
          {
            title: "Shared Shards",
            actNumber: 2,
            sceneOrder: 2,
            scriptText:
              "Details they shouldn't know. A red umbrella. A forgotten key. All from the same dream.",
          },
          {
            title: "The Awakening",
            actNumber: 3,
            sceneOrder: 3,
            scriptText:
              "The sun begins to rise. Does the dream end here, or is this the beginning?",
          },
        ],
      },
    },
  })

  await seedTheElevator({ creatorId: user2.id })

  await prisma.movie.create({
    data: {
      title: "The Godfather Alternate Ending",
      slug: "the-godfather-alternate",
      synopsis:
        "Michael Corleone's path diverges as he chooses a different legacy for the family.",
      isPublished: true,
      visibility: "PUBLIC",
      creatorId: user2.id,
      posterUrl:
        "https://images.unsplash.com/photo-1470219551729-3893a5482e3e?q=80&w=2072&auto=format&fit=crop",
      backdropUrl:
        "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop",
      scenes: {
        create: [
          {
            title: "The Garden Meeting",
            actNumber: 1,
            sceneOrder: 1,
            scriptText:
              "Don Vito whispers. Michael listens. This time, the answer is 'No'.",
          },
          {
            title: "Shadows in Sicily",
            actNumber: 2,
            sceneOrder: 2,
            scriptText: "A target on his back. A choice in his heart.",
          },
          {
            title: "The New Don",
            actNumber: 3,
            sceneOrder: 3,
            scriptText: "The baptism goes on, but the blood stays off his hands.",
          },
        ],
      },
    },
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
      posterUrl: "/assets/ffc60d22-6a9d-4a1d-949a-4e29885eb87e.png",
      backdropUrl:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
      scenes: {
        create: [
          {
            title: "The Hallway Twist",
            actNumber: 1,
            sceneOrder: 1,
            scriptText: "The gravity shifts 90 degrees. Cobb runs up the wall.",
          },
          {
            title: "Subconscious Guard",
            actNumber: 2,
            sceneOrder: 2,
            scriptText:
              "They are looking for him. Not the projections, but the dream itself.",
          },
          {
            title: "The Infinite Fall",
            actNumber: 3,
            sceneOrder: 3,
            scriptText: "The top spins. It doesn't matter if it stops.",
          },
        ],
      },
    },
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
