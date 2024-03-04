import Image from 'next/image';

export default function Footer() {
	const year = new Date().getFullYear();
	return (
		<footer id="footer">
			<p>&copy; {year} Tyler Mommsen</p>
			<a
				href="https://github.com/TylerMommsen/pathfinding-visualizer"
				target="_blank"
				rel="noreferrer noopener"
			>
				<Image src={'/github-icon.svg'} width={16} height={16} alt={'footer github icon'} />
			</a>
		</footer>
	);
}
