import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

import Tweets from "components/Tweets";
import prisma from "lib/prisma";
import { getTweets } from "lib/data.js";

export default function Index({ tweets }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return null;
  }

  if (session) {
    router.push("/home");
  }

  return (
    <div className="mt-10">
      <Tweets tweets={tweets} />
      <div className="text-center p-4 border m-4">
        <h2 className="mb-10">Join the conversation!</h2>
        <Link href="/api/auth/signin">
          <a className="border px-8 py-2 mt-5 font-bold rounded-full color-accent-contrast bg-color-accent hover:bg-color-accent-hover-darker">
            Login
          </a>
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const limitTweets = 3;

  let tweets = await getTweets(prisma, limitTweets);
  tweets = JSON.parse(JSON.stringify(tweets));

  return {
    props: {
      tweets,
    },
  };
}
