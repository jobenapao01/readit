import InfoSidebar from '@/components/InfoSidebar';
import { getAuthSession } from '@/lib/auth';
import prismadb from '@/lib/db';

import { notFound } from 'next/navigation';

export default async function Layout({
	children,
	params: { slug },
}: {
	children: React.ReactNode;
	params: { slug: string };
}) {
	const session = await getAuthSession();

	const subreddit = await prismadb.subreddit.findFirst({
		where: {
			name: slug,
		},
		include: {
			posts: {
				include: {
					author: true,
					votes: true,
				},
			},
		},
	});

	const subscription = !session?.user
		? undefined
		: await prismadb.subscription.findFirst({
				where: {
					subreddit: {
						name: slug,
					},
					user: {
						id: session.user.id,
					},
				},
		  });

	const isSubscribed = !!subscription;

	if (!subreddit) return notFound();

	const memberCount = await prismadb.subscription.count({
		where: {
			subreddit: {
				name: slug,
			},
		},
	});

	return (
		<>
			<div className='sm:container max-w-7xl mx-auto h-full pt-12'>
				<div>
					{/* TODO: button to take us back */}

					<div className='grid grid-cols-1 md:grid-cole-3 gap-y-4 md:gap-x-4 py-6'>
						<div className='flex flex-col col-span-2 space-y-6 '>
							{children}
						</div>

						{/* Info Sidebar */}

						<InfoSidebar
							subreddit={subreddit}
							memberCount={memberCount}
							session={session}
							isSubscribed={isSubscribed}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
