import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth;

      const pathname = request.nextUrl.pathname;

      // Public routes
      if (
        pathname === "/login" ||
        pathname.startsWith("/api/auth")
      ) {
        return true;
      }

      // Protect everything else
      return isLoggedIn;
    },
  },

  secret: process.env.AUTH_SECRET,
});

