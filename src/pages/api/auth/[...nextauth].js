import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          const registerResponse = await fetch(`${process.env.BASE_URL_ENDPOINT}/api/login/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });
          const userdata = await registerResponse.json();
          
          if (userdata.status) {
            return userdata; // Assuming userdata contains user data when credentials are valid
          } else {
            return null; // Invalid credentials, return null
          }
        } catch (error) {
          console.error("Error during login:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const tokendata = user
        token.access = tokendata.access;
        token.name = tokendata.data.name;
        token.email = tokendata.data.email;
        token.phone = tokendata.data.phone;
        token.organization = tokendata.data.organization;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.id = token.id;
        session.token = token.access;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.phone = token.phone;
        session.user.organization = token.organization;
        const expiresIn = 6 * 60 * 60 * 1000; 
        session.expires = new Date(Date.now() + expiresIn).toISOString();
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 6 * 60 * 60,
  },
});
