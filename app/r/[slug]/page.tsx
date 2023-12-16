import MiniCreatePost from '@/components/MiniCreatePost';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config';
import { getAuthSession } from '@/lib/auth';
import prismadb from '@/lib/db';
import { notFound } from 'next/navigation';

interface SubredditSlugPage {
	params: {
		slug: string;
	};
}

const SubredditSlugPage = async ({ params }: SubredditSlugPage) => {
	const { slug } = params;

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
					comments: true,
					subreddit: true,
				},
				take: INFINITE_SCROLLING_PAGINATION_RESULTS,
			},
		},
	});

	if (!subreddit) {
		return notFound();
	}

	return (
		<>
			<h1 className='font-bold text-3xl md:text-4xl h-14'>
				r/{subreddit.name}
			</h1>

			<MiniCreatePost session={session} />

			{/* TODO: SHOW posts in user feed */}
		</>
	);
};

export default SubredditSlugPage;
