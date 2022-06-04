import prisma from "lib/prisma";
import { faker } from "@faker-js/faker";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession(req);

  // This isn't working entirely since the session coming in here is
  // null....
  if (!session) {
    console.log("session is null");
    // return res.end();
  }

  if (req.method !== "POST") {
    return res.end();
  }

  if (req.body.task === "clean_database") {
    await prisma.tweet.deleteMany({
      // Commented out for now since there's a bug here
      // - session is null...
      //   where: {
      //     NOT: {
      //       authorId: {
      //         in: [session.user.id],
      //       },
      //     },
      //   },
    });
    await prisma.user.deleteMany({
      where: {
        NOT: {
          email: {
            in: [session.user.email],
          },
        },
      },
    });
  }

  if (req.body.task === "generate_users_and_tweets") {
    let count = 0;

    // Create 5 new users.
    while (count < 5) {
      await prisma.user.create({
        data: {
          name: faker.internet.userName().toLowerCase(),
          email: faker.internet.email().toLowerCase(),
          image: faker.internet.avatar(),
        },
      });
      count++;
    }

    // Create 1 tweet for each user.
    const users = await prisma.user.findMany({});

    users.forEach(async (user) => {
      await prisma.tweet.create({
        data: {
          content: faker.hacker.phrase(),
          author: {
            connect: { id: user.id },
          },
        },
      });
    });
  }

  if (req.body.task === "generate_one_tweet") {
    const users = await prisma.user.findMany({});

    const randomIndex = Math.floor(Math.random() * users.length);
    const user = users[randomIndex];

    await prisma.tweet.create({
      data: {
        content: faker.hacker.phrase(),
        author: {
          connect: { id: user.id },
        },
      },
    });
  }

  res.end();
}
