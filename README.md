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
9. In the .env file, add the connection URL to the railway PostreSQL database.  Make sure the .env file is added to .gitignore.
10. Create a lib/prisma.js file with the following content:
```
import { PrismaClient } from '@prisma/client'

let global = {}

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') global.prisma = prisma

export default prisma
```