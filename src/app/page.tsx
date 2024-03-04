import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Main from '@/components/layout/Main';
import Info from '@/components/layout/Info';
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
