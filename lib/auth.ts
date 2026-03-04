import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { signInSchema } from "./zod";
import { createApiClient } from "./apiClient";
import { API_ROUTES } from "./apiRoutes";

import { cookies } from "next/headers";

type RefreshResponse = {
  token: string;
  message: string;
  refreshToken: string;
  tokenExpiresAt: Date;
  admin: {
    _id: string;
    username: string;
    facilityId: string | null;
  };
};

// Deduplicate concurrent refresh calls (per refresh token) so we don't
// send multiple refresh requests while one is already in-flight.
const refreshPromises = new Map<string, Promise<RefreshResponse>>();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "ელ.ფოსტა",
          type: "email",
          placeholder: "user@example.com",
        },
        password: {
          label: "პაროლი",
          type: "password",
        },
      },
      async authorize(credentials) {
        try {
          console.log("🔐 Authorize called with credentials:", {
            email: credentials?.email,
            password: credentials?.password ? "***" : "missing",
          });

          // Validate credentials using Zod
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          console.log("✅ Credentials validated successfully");

          // Call authentication service

          const response = await createApiClient(API_ROUTES.LOGIN).post<
            {
              username: string;
              password: string;
            },
            {
              token: string;
              refreshToken: string;
              tokenExpiresAt: Date;
              admin: {
                _id: string;
                username: string;
              };
            }
          >({
            username: email,
            password: password,
          });

          console.log("📡 API Response:", response ? "Success" : "No response");

          const cookieStore = await cookies();
          cookieStore.set("refresh_token", response.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/",
          });

          if (response) {
            const user = {
              id: response.admin._id,
              email: response.admin.username,
              name: response.admin.username,
              tokenExpiresAt: new Date(response.tokenExpiresAt).toISOString(),
              _id: response.admin._id,
              token: response.token,
              refreshToken: response.refreshToken, // Store in JWT for server-side refresh
            };
            console.log("👤 User object created:", {
              ...user,
              token: "***",
            });
            return user;
          }

          console.log("❌ No response from API");
          return null;
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("❌ Validation error:", error);
            return null;
          }

          console.error("❌ Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("user", user);
        console.log("token+++++++", token);
        const jwtToken = {
          ...token,
          accessToken: user.token,
          tokenExpiresAt: user.tokenExpiresAt,
          _id: user._id,
          email: user.email,
          name: user.name,
          expiresAt: new Date(user.tokenExpiresAt).getTime(),
          refreshToken: user.refreshToken || token.refreshToken, // Store refresh token in JWT
        };
        return jwtToken;
      }

      // Ensure token has required properties before checking expiration
      if (!token.tokenExpiresAt || !token._id || !token.accessToken) {
        return token;
      }

      console.log(
        "token before refresh check",
        token,
        new Date(token.tokenExpiresAt).getTime(),
        Date.now()
      );

      // Check if access token is expired
      if (Date.now() > new Date(token.tokenExpiresAt).getTime()) {
        const cookieStore = await cookies();
        try {
          let refreshToken = token.refreshToken;

          if (!refreshToken) {
            const refreshTokenCookie = cookieStore.get("refresh_token");
            refreshToken = refreshTokenCookie?.value;
          }

          console.log(
            "🔄 Refresh token source:",
            refreshToken ? "Found in JWT/Cookie" : "Not found"
          );

          if (!refreshToken) {
            console.error("❌ No refresh token available");
            return null;
          }

          const existing = refreshPromises.get(refreshToken);
          const refreshPromise =
            existing ??
            (async () => {
              const p = createApiClient(API_ROUTES.REFRESH_TOKEN).post<
                Record<string, never>,
                RefreshResponse
              >(
                {},
                {
                  headers: {
                    Cookie: `refresh_token=${refreshToken}`,
                  },
                }
              );
              refreshPromises.set(refreshToken, p);
              try {
                return await p;
              } finally {
                refreshPromises.delete(refreshToken);
              }
            })();

          const response = await refreshPromise;

          console.log("🔄 response from refresh token", response.refreshToken);

          cookieStore.set("refresh_token", response.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/",
          });

          const refreshedToken = {
            ...token,
            accessToken: response.token,
            tokenExpiresAt: new Date(response.tokenExpiresAt).toISOString(),
            expiresAt: new Date(response.tokenExpiresAt).getTime(),
            refreshToken: response.refreshToken, // Update refresh token in JWT from response
          };
          return refreshedToken;
        } catch (error) {
          console.error("❌ Refresh token error:", error);
          return null;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.accessToken = token.accessToken;
        session.user._id = token._id;
        session.user.id = token._id;

        if (token.email) {
          session.user.email = token.email as string;
        }
        if (token.name) {
          session.user.name = token.name as string;
        }
      }
      return session;
    },
  },
  events: {},
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    updateAge: 10 * 60 * 1000, // 10 minutes
  },
  secret: process.env.NEXTAUTH_SECRET,
});
