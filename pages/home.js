import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import NewTweet from "components/NewTweet";
import Tweets from "components/Tweets";

// Data access
import prisma from "lib/prisma";
import { getTweets } from "lib/data";

export default function Home({ tweets }) {
  const { data: session, status } = useSession();

  // Not sure yet why we need a separate variable here..
  const loading = status === "loading";

  const router = useRouter();

  if (loading) {
    return null;
  }

  // If the user isn't logged in, send them to the '/'
  if (!session) {
    router.push("/");
  }

  return (
    <>
      <NewTweet />
      <Tweets tweets={tweets} />
    </>
  );
}

/*
    This is needed so that Next.js (server side) can add the data it 
    needs from the database, before rendering the page.  We make the data
    available as a component prop.
*/
export async function getServerSideProps() {
  let tweets = await getTweets(prisma);

  // This bit of transformation is needed to handle the date field.
  tweets = JSON.parse(JSON.stringify(tweets));

  return {
    props: {
      tweets,
    },
  };
}
