import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "lib/prisma";

export default NextAuth({
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],

  database: process.env.DATABASE_URL,
  secret: process.env.SECRET,

  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  /* Not used?  Used in Week 8...
  jwt: {
    secret: process.env.SECRET,     // Use the random secret token you used 
                                    // for .env also here
    encryption: true
  },*/

  debug: true,
  adapter: PrismaAdapter(prisma),
});
