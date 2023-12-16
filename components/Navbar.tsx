import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { Icons } from './Icons';
import { buttonVariants } from './ui/button';
import UserAccountNav from './UserAccountNav';

const Navbar = async () => {
	const session = await getServerSession(authOptions);
	return (
		<div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-b-zinc-300 z-10 py-2'>
			<div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
				{/* logo */}
				<Link
					href='/'
					className='flex items-center gap-2'
				>
					<Icons.logo className='h-8 w-8 sm:h-6 sm:h-6' />
					<p className='hidden text-zinc-700 text-sm font-medium md:block'>
						Read.it
					</p>
				</Link>

				{/* search bar */}

				{/* sign in link */}

				{session?.user ? (
					<UserAccountNav user={session.user} />
				) : (
					<Link
						href='/sign-in'
						className={buttonVariants()}
					>
						SignIn
					</Link>
				)}
			</div>
		</div>
	);
};

export default Navbar;
