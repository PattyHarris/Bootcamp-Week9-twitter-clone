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
