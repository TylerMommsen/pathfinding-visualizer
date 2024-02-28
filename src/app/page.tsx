import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Main from '@/components/layout/main';
import Info from '@/components/layout/info';
import { SelectionsProvider } from '@/contexts/SelectionsContext';

export default function Page() {
	return (
		<>
			<SelectionsProvider>
				<Header />
				<Info />
				<Main />
				<Footer />
			</SelectionsProvider>
		</>
	);
}
