import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function NewTweet() {
  const [content, setContent]  = useState("");
  const { data: session } = useSession();

  const router = useRouter();

  // Don't display if we're not logged in
  if (!session || !session.user) {
    return null;
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        if (!content) {
          alert("No content");
          return;
        }

        await fetch('/api/tweet', {
            body: JSON.stringify({
                content,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })

        // Reload the window to clear the newly entered tweet.
        router.reload(window.location.pathname);
      }}
    >
      <div className="flex">
        <div className="flex-1 px-1 pt-2 mt-2 mr-1 ml-1">
          <textarea
            className="border p-4 w-full text-lg font-medium bg-transparent outline-none color-primary "
            rows={2}
            cols={50}
            placeholder="What's happening?"
            name="content"
            onChange={(event) => setContent(event.target.value)}
          />
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 mb-5">
          <button className="border float-right px-8 py-2 mt-0 mr-2 font-bold rounded-full">
            Tweet
          </button>
        </div>
      </div>
    </form>
  );
}
