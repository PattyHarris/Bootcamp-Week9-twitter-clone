// Returns all the tweets.
export const getTweets = async (prisma, take, cursor) => {
  const tweets = await prisma.tweet.findMany({
    where: {
      parent: null,
    },
    orderBy: [
      {
        id: "desc",
      },
    ],
    include: {
      author: true,
    },
    take,
    cursor,
    skip: cursor ? 1 : 0,
  });

  return tweets;
};

// Returns all the tweets for a given user by user name.
export const getUserTweets = async (name, prisma) => {
  const tweets = await prisma.tweet.findMany({
    where: {
      author: {
        name: name,
      },
      parent: null,
    },
    orderBy: [
      {
        id: "desc",
      },
    ],
    include: {
      author: true,
    },
  });

  return tweets;
};

// Return a single tweet.
export const getTweet = async (id, prisma) => {
  const tweet = await prisma.tweet.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      author: true,
    },
  });

  // If there is a parent, then this is a reply.  In which case, the name
  // is that of the parent.
  if (tweet.parent) {
    tweet.parent_data = await prisma.tweet.findUnique({
      where: {
        id: parseInt(tweet.parent),
      },
      include: {
        author: true,
      },
    });
  }

  return tweet;
};

// Return all the replies for a given tweet.
export const getReplies = async (id, prisma) => {
  const tweets = await prisma.tweet.findMany({
    where: {
      parent: parseInt(id),
    },
    orderBy: [
      {
        id: "desc",
      },
    ],
    include: {
      author: true,
    },
  });

  return tweets;
};
