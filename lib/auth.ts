import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import credentialProvider from "next-auth/providers/credentials";
import {z} from "zod";
import bcrypt from "bcryptjs";
import prisma from "./db";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const {handlers, signIn, signOut, auth} = NextAuth({
  providers: [
    credentialProvider({
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"},
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const parsedValues = credentialsSchema.parse(credentials);
          const {email, password} = parsedValues;

          let user = await prisma.user.findUnique({where: {email}});

          // If user does not exist, create a new one
          if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await prisma.user.create({
              data: {email, password: hashedPassword},
            });
          } else {
            const isPasswordValid = await bcrypt.compare(
              password,
              user.password
            );

            if (!isPasswordValid) {
              return null;
            }
          }

          return {id: user.id.toString(), email: user.email};
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      async profile(profile) {
        try {
          const email = profile.email;

          if (!email) {
            throw new Error("No email provided by Google");
          }

          let user = await prisma.user.findUnique({
            where: {email},
          });

          // If user does not exist, create a new one
          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                password: "", // Empty password for Google OAuth users
              },
            });
          }

          return {
            id: user.id.toString(),
            email: user.email,
          };
        } catch (error) {
          console.error("Google authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    // Include user ID in JWT token
    async jwt({token, user}) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Include user ID in session for client-side access
    async session({session, token}) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});
