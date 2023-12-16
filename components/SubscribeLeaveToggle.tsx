'use client';

import { useMutation } from '@tanstack/react-query';
import { Button } from './ui/button';
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit';
import axios, { AxiosError } from 'axios';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { toast } from '@/hooks/use-toast';
import { startTransition } from 'react';
import { useRouter } from 'next/navigation';

interface SubscribeLeaveToggleProps {
	subredditId: string;
	subredditName: string;
	isSubscribed: boolean;
}

const SubscribeLeaveToggle = ({
	subredditId,
	subredditName,
	isSubscribed,
}: SubscribeLeaveToggleProps) => {
	const { loginToast } = useCustomToast();

	const router = useRouter();

	const { mutate: subscribe, isPending: isSubscribeLoading } = useMutation({
		mutationFn: async () => {
			const payload: SubscribeToSubredditPayload = { subredditId };

			const { data } = await axios.post('/api/subreddit/subscribe', payload);

			return data as string;
		},
		onError: (err) => {
			if (err instanceof AxiosError) {
				if (err.response?.status === 401) {
					return loginToast();
				}
			}

			toast({
				title: 'There was a problem',
				description: 'Something went wrong. Please try again',
				variant: 'destructive',
			});
		},
		onSuccess: (data) => {
			startTransition(() => {
				router.refresh();
			});

			return toast({
				title: 'Subscribed',
				description: `You are now subscribed to r/${subredditName}`,
			});
		},
	});

	const { mutate: unSubscribe, isPending: isUnsubscribeLoading } = useMutation({
		mutationFn: async () => {
			const payload: SubscribeToSubredditPayload = { subredditId };

			const { data } = await axios.post('/api/subreddit/unsubscribe', payload);

			return data as string;
		},
		onError: (err) => {
			if (err instanceof AxiosError) {
				if (err.response?.status === 401) {
					return loginToast();
				}
			}

			toast({
				title: 'There was a problem',
				description: 'Something went wrong. Please try again',
				variant: 'destructive',
			});
		},
		onSuccess: (data) => {
			startTransition(() => {
				router.refresh();
			});

			return toast({
				title: 'Unsubscribed',
				description: `You are now unsubscribed to r/${subredditName}`,
			});
		},
	});
	return isSubscribed ? (
		<Button
			className='w-full mt-1 mb-4'
			onClick={() => unSubscribe()}
			isLoading={isUnsubscribeLoading}
		>
			Leave Community
		</Button>
	) : (
		<Button
			className='w-full mt-1 mb-4'
			onClick={() => subscribe()}
			isLoading={isSubscribeLoading}
		>
			Join to post
		</Button>
	);
};

export default SubscribeLeaveToggle;
