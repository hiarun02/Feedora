import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import credentialProvider from "next-auth/providers/credentials";
import {z} from "zod";
import bcrypt from "bcryptjs";
import {prisma} from "./db";

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
          } //

          const parsedValues = credentialsSchema.parse(credentials);
          const {email, password} = parsedValues;

          let user = await prisma.user.findUnique({where: {email}}); //

          // If user does not exist, create a new one
          if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await prisma.user.create({
              data: {email, password: hashedPassword},
            });
          } else {
            const isPasswordValid = await bcrypt.compare(
              password,
              user.password,
            );

            if (!isPasswordValid) {
              return null;
            }
          }

          const userEmail = user.email ?? email;

          return {
            id: user.id.toString(),
            email: userEmail,
            name: userEmail.split("@")[0],
            image: null,
          };
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

          const userEmail = user.email ?? email;

          return {
            id: user.id.toString(),
            email: userEmail,
            name: profile.name ?? userEmail.split("@")[0],
            image: profile.picture ?? null,
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
    async signIn({user, profile}) {
      // Ensure user has the correct database ID for Google OAuth
      if (profile && "email" in profile) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: {email: profile.email as string},
          });
          if (dbUser && dbUser.id) {
            user.id = dbUser.id.toString();
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
        }
      }
      return true;
    },
    // Include user ID in JWT token
    async jwt({token, user}) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    // Include user ID in session for client-side access
    async session({session, token}) {
      if (token && token.id) {
        session.user.id = token.id as string;
        session.user.name = (token.name as string | null) ?? null;
        session.user.image = (token.picture as string | null) ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});
