# Twitter Clone

## The basic installs:

1. Setup the app: npx create-next-app@latest twitter-clone
2. Add the jsconfig.json file as we have done elsewhere
3. Install tailwind: npm install -D tailwindcss postcss autoprefixer
4. Init tailwind: npx tailwindcss init -p (which generates tailwind.config.js and postcss.config.js).
5. Configure tailwind.config.js:

```
    module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    }
```

6. Add the tailwind modules to styles/global.css (also remove the Home.module.css):

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

7. Create the PostgreSQL database on railway.
8. Install Prisma and then run init:

```
npm install -D prisma
npx prisma init
```

9. In the .env file, add the connection URL to the railway PostreSQL database. Make sure the .env file is added to .gitignore.
10. Create a lib/prisma.js file with the following content:

```
import { PrismaClient } from '@prisma/client'

let global = {}

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') global.prisma = prisma

export default prisma
```

## Adding NextAuth

1. Install NextAuth.js: npm install next-auth pg @next-auth/prisma-adapter nodemailer
   This installs NextAuth, the PostgreSQL library and nodemailer, which is used to send the login workflow emails.
2. Setup the environment variables in the .env file - same as in Week 8's tutorial:

```
EMAIL_SERVER=smtp://user:pass@smtp.mailtrap.io:465
EMAIL_FROM=Your name <you@email.com>
NEXTAUTH_URL=http://localhost:3000
SECRET=<ENTER A UNIQUE STRING HERE>
```

The secret is generated using: https://generate-secret.vercel.app/32

3. Create the NextAuth configuration file in pages/api/auth/[...nextauth].js - I copied the one from Week 8, although the jwt secret and encryption values are not used this time?
4. Add the 4 models to the prisma.schema file (as we did in Week 8):
   - VerificationRequest
   - Account
   - Session
   - User

Migrate to the database:

```
npx prisma migrate dev
```

5. In "pages/\_app.js", wrap the component in a SessionProvider component:

```
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

```

6. Add a login link in "index.js" which will use the mailtrap.io email authorization to fake a login with an email. Works up to this point - note that this is the only contents of "index.js":

```
export default function Home() {
  return <a href='/api/auth/signin'>login</a>
}
```

7. To check whether we're logged in, use the "useSession" hook from NextAuth. In "index.js", add the following:

```
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return null
  }

  if (session) {
    router.push('/home')
  }

  return <a href='/api/auth/signin'>login</a>
}
```

8. Currently there is no "home" page, so the above will generate a 404. Add the "home" page - add "home.js" to "pages":

```
import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session, status } = useSession()
  return (
    <div>
      {session ? <p>You are logged in!</p> : <p>You are not logged in 😞</p>}
    </div>
  )
}
```

At this point, if you refresh the page, it will momentarily show that you are NOT logged in, and then changes to "logged in". This is dues to the fact that the page is generated on the server but the session cookie is on the client. Unlike Week 8 where we added this bit to index.js, since we have a "home" page, we need to add it to the "home" page:

```
  if (status === "loading") {
    return <p>......</p>;
  }

```

## Create a Tweet Form

Most of this is explanatory by looking at the diffs....

## Show A Tweet List

Most of this is explanatory as well.

1. Bit of JS to remember: in Tweets.js, the 'mapping' code is currently:

```
  return (
    <>
      {tweets.map((tweet, index) => (
        <Tweet key={index} tweet={tweet} />
      ))}
    </>
  );
```

Notice the usage of '=> ()' If you use '{}' instead, recall that you need to do an explicit return - using '()' has an implicit return:

```
  return (
    <>
      {tweets.map((tweet, index) => {
        return <Tweet key={index} tweet={tweet} />
      })}
    </>
  );
```

2. We made use of the Next.js getServerSideProps. This works in conjunction with the data.js file - this pattern will be repeated in our other projects.

## Clear the window after clicking the Tweet button.

Main thing here is that we need to add an 'await' on the 'fetch' - otherwise, the "reload" clears the fetch call before we can use it...

## Show more tweet data

1. To improve the formatting, install javascript-time-ago (https://www.npmjs.com/package/javascript-time-ago) - see this library for good documentation.

```
npm install javascript-time-ago
```

2. Add a file in 'lib', lib/timeago.js where we initialize our locale. We can then use the library in the Tweet output.
3. To add the author, adjust the "fetch" function to include the author - see data.js.
4. Add username capability (see setup.js in pages and pages/api)
5. In home.js, if the user isn't logged in, show the "setup" form.
6. Left as an exercise to check whether the username already exists....

## Create fake users

1. To create the fake data, we'll use a library @faker-js/faker. Ideally, this would be installed for development only. Flavio has a blog on how to hide the form: https://flaviocopes.com/nextjs-show-something-only-in-dev/

```
npm install @faker-js/faker --save-dev
```

2. We'll create a form in Utils that will allow us to clean the database, create fake user's and their tweets, and generate a single tweet.
3. In pages, add a Utils.js and likewise a api handler api/Utils.js To view the page:

```
https://localhost:3000/utils
```

4. The 'generate_users_and_tweets' task generates 5 users and creates a single tweet for each to of them.

## Pretty the Tweet Display

1. Add the cloudfare-ipsfs.com domain to the list of whitelisted image domains - in next.config.js:

```
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['cloudflare-ipfs.com', 'localhost'],
  },
}
```

2. Import the "Image" component from Next.js and use that to display the image in the Tweet component.

## Profile Page for each User

1. If the username is 'Flavio', then the profile page will be http://localhost:3000/flavio. Create a page 'pages/[name].js':

```
export default function UserProfile({ name }) {
  return <p>User profile of {name}</p>
}

export async function getServerSideProps({ params }) {
  return {
    props: {
      name: params.name,
    },
  }
}
```

With this initial setup, any page not matching 'utils' or 'home' will match a user profile, even if the user doesn't exist. That will be fixed later? as a exercise for the reader??

2. Addition of 'getUserTweets' in lib/data.js.
3. The profile page is accessed by clicking on the tweet from the tweets page. In the Tweet component, a "link" is added using the tweet author name.

## Create a Single Tweet View

1. A tweet will be available in the URL '/<author name>/status/<tweet id>'.
2. Create a new folders and a page for pages/[name]/status/[id].js'.
3. Link the tweet using the new dynamic URL in the 'Tweet' component. This makes the timestamp a link. I would think you'd want to make the tweet itself as part of the link...

## Improve the Home Page

1. Add a new page, 'pages/index.js' that is shown when the user is not logged in.
2. This tutorial is confusing since the verbiage doesn't match what we're working with. For example,
   - the current HTML will error since the '<h2>' is nested inside a '<p>' => need to make the outer '<p>' a '<div>'.
   - the current component in the 'index.js' is called 'Home', not 'Welcome'.
   - the change to getTweets is to add a 'take' parameter - it really does need to be called 'take' for prisma to work.

## Allow the User to Delete their own Tweets

1. In 'pages/[name]/status/[id].js' we'll show a 'delete' link if the user is logged in and the user is the author of the tweet.
2. Implement DELETE in 'api/tweet.js'.

## Allow the User to Reply to Tweets and Show the Replies

1. To keep things simple, the user can't reply to a reply. And, the reply is not shown in its own page (as with a single tweet).
2. New component, 'NewReply.js' added to handle replies.
3. The new form is imported in 'pages/[user]/status/[id].js'.
4. In 'pages/api/tweet.js', in the POST request handler, also take care about the parent - this sets the parent column corresponding to the id of the tweet you’re replying to.

```
await prisma.tweet.create({
  data: {
    content: req.body.content,
    parent: req.body.parent || null,
    author: {
      connect: { id: user.id },
    },
  },
})
```

5. Show the replies in 'lib/data.js by adding a 'getReplies()' method.
6. In 'pages/[user]/status/[id].js', import the 'getReplies()' method from lib/data. Get the replies in getServerSideProps and pass them as props to the component. Finally show them using the Tweets component we already created and used in various places.
7. Fix the replies so that they have their own URL - this is done using the addition of a 'nolink' prop to the Tweet.js component. The prop is passed down from '[id].js' and 'Tweets.js'.
8. This next bit is confusing: "But people could still go manually to a URL that points to a reply tweet.
   So we’re going to deny showing the content if the tweet is a reply. We’ll point to the parent instead." In 'pages/[user]/status/[id].js':

```
//...

export default function SingleTweet({ tweet, replies }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (typeof window !== 'undefined' && tweet.parent) {
    router.push(`/${tweet.author.name}/status/${tweet.parent}`)
  }

  //...
```

The check for 'typeof window !== 'undefined'' is needed since router code has to run on the client.

9. To make sure that replies only appear on the single tweet view, in 'data.js', add 'parent: null' to the where clauses to the findMany() calls in 'getTweets' and 'getUserTweets'.

## Load more Tweets

1. Using cursor-based pagination, meaning Prisma will return take elements starting from the element with id equal to the one we pass in 'cursor'. In 'getTweets', we add an addition parameter, 'cursor'. Along with 'cursor', 'skip' is added - see the documentation for 'skip'.
2. Add a LoadMore component, which takes a list of tweets as a prop - uses the last tweet ID as input to the fetch. 'LoadMore' is added to 'home.js' as well.
3. Implement the GET /api/tweets API call in the file 'pages/api/tweets.js' (new file).
4. There's some complication around limiting the number of tweets (done on the client) when the tweets are setup on the server. This is resolved using a combination of 'getServerSideProps' and the 'useState' hook (in home.js).
5. Once the above is resolved, we now have an issue when a new tweet is added - the page is reloaded and we're back to 2 tweets again. To fix this, NewTweet will update the list of tweets currently displayed by the Home component - meaning, if the current display is showing 3 tweets, it will now show 4 tweets, with the new Tweet listed first.
6. Bug fixed where the Tweet text box was not cleared - addition of setContent('') and value={content} ...
