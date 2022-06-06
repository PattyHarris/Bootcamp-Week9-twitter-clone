import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

import NewTweet from "components/NewTweet";
import Tweets from "components/Tweets";
import LoadMore from "components/LoadMore";

// Data access
import prisma from "lib/prisma";
import { getTweets } from "lib/data";

/*
  Home Component
*/
export default function Home({ initialTweets }) {
  const [tweets, setTweets] = useState(initialTweets);
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

  if (session && !session.user.name) {
    router.push("/setup");
  }

  return (
    <>
      <div className="flex">
        <div className="flex-1 mb-5">
          <button
            className="float-right px-6 py-2 mt-0 mr-2 font-medium rounded-full"
            onClick={() => {
              signOut();
              router.push("/");
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
      <NewTweet tweets={tweets} setTweets={setTweets} />
      <Tweets tweets={tweets} />
      <LoadMore tweets={tweets} setTweets={setTweets} />
    </>
  );
}

/*
    This is needed so that Next.js (server side) can add the data it 
    needs from the database, before rendering the page.  We make the data
    available as a component prop.
*/
export async function getServerSideProps() {
  let tweets = await getTweets(prisma, 2);

  // This bit of transformation is needed to handle the date field.
  tweets = JSON.parse(JSON.stringify(tweets));

  return {
    props: {
      initialTweets: tweets,
    },
  };
}
