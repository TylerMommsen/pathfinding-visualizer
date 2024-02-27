import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Pathfinding Visualizer',
	description:
		'A tool to visualize pathfinding and maze generation algorithms in real-time. View different pathfinding algorithms explore paths from point A to B. View various maze generation algorithms create distinct, unique patterns and mazes for the pathfinding algorithms to go through!',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
