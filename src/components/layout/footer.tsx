export default function Footer() {
	const year = new Date().getFullYear();
	return (
		<footer id="footer">
			<p>Copyright &copy; {year} Tyler Mommsen </p>
		</footer>
	);
}
