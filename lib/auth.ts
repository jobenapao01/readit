import { NextAuthOptions, getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prismadb from './db';
import { nanoid } from 'nanoid';

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prismadb),
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/sign-in',
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async session({ token, session }) {
			if (token) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.image = token.picture;
				session.user.username = token.username;
			}
			return session;
		},

		async jwt({ token, user }) {
			const dbUser = await prismadb.user.findFirst({
				where: {
					email: token.email,
				},
			});

			if (!dbUser) {
				token.id = user!.id;
				return token;
			}

			if (!dbUser.username) {
				await prismadb.user.update({
					where: {
						id: dbUser.id,
					},
					data: {
						username: nanoid(10),
					},
				});
			}
			return {
				id: dbUser.id,
				name: dbUser.name,
				email: dbUser.email,
				picture: dbUser.image,
				username: dbUser.username,
			};
		},
		redirect() {
			return '/';
		},
	},
};

//Get user Session

export const getAuthSession = () => getServerSession(authOptions);
