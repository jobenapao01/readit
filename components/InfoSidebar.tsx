import { Subreddit } from '@prisma/client';
import SubscribeLeaveToggle from './SubscribeLeaveToggle';
import { Session } from 'next-auth';
import { format } from 'date-fns';

interface InfoSidebarProps {
	subreddit: Subreddit;
	memberCount: number;
	session: Session | null;
	isSubscribed: boolean;
}

const InfoSidebar = ({
	subreddit,
	memberCount,
	session,
	isSubscribed,
}: InfoSidebarProps) => {
	return (
		<div className='hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
			<div className='px-6 py-4'>
				<p className='font-semibold py-3'>About r/ {subreddit.name}</p>
			</div>

			<dl className='divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white'>
				<div className='flex justify-between gap-x-4 py-3'>
					<dt className='text-gray-500'>Created</dt>
					<dd className='text-gray-700'>
						<time dateTime={subreddit.createdAt.toDateString()}>
							{format(subreddit.createdAt, 'MMMM d, yyyy')}
						</time>
					</dd>
				</div>

				<div className='flex justify-between gap-x-4 py-3'>
					<dt className='text-gray-500'>Members</dt>
					<dd className='text-gray-700'>
						<div className='text-gray-900'>{memberCount}</div>
					</dd>
				</div>

				{subreddit.creatorId === session?.user.id ? (
					<div className='flex justify-between gap-x-4 py-3 '>
						<p className='text-gray-500'>You created this community</p>
					</div>
				) : null}

				{subreddit.creatorId !== session?.user?.id ? (
					<SubscribeLeaveToggle
						subredditId={subreddit.id}
						subredditName={subreddit.name}
						isSubscribed={isSubscribed}
					/>
				) : null}
			</dl>
		</div>
	);
};

export default InfoSidebar;
