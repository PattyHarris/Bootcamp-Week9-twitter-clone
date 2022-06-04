import timeAgo from "lib/timeago";

export default function Tweet({ tweet }) {
  return (
    <p>
      {timeAgo.format(new Date(tweet.createdAt))} {tweet.author.name}{" "}
      {tweet.content}
    </p>
  );
}
