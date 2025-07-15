/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { dbConnect } from "./db";
import User from "@/Models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Enter your email" },
                password: { label: "Password", type: "password", placeholder: "Enter your password" }
            },
            async authorize(credentials) {
                if(!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }
                try {
                    await dbConnect();
                    const user = await User.findOne({ email: credentials.email, password: credentials.password });

                    if(!user) {
                        throw new Error("User not found or invalid credentials");
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if(!isValid) {
                        throw new Error("Invalid password");
                    }
                    return {
                        id: user._id.toString(),
                        email: user.email,
                    }
                }catch (error) {
                    console.error("Authorization error:", error);
                    throw new Error("Invalid credentials");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: any; user?: { id: string; email: string } }) {
            if(user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            if(session.user) {
                session.user.id = token.id;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, 
    },
    secret: process.env.NEXTAUTH_SECRET,
};