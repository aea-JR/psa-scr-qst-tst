import { connect, currentLanguage } from 'scrivito'

interface LoadingProps {
	className?: string;
}
export const Loading: React.FC<LoadingProps> = connect(({ className }) => {


	const message = getMessage()

	return (
		<div className={className}>
			<div
				aria-busy="true"
				aria-valuetext={message}
				className='loading-placeholder'
				role="progressbar"
				title={message}
			/>
		</div>
	)
})

function getMessage(): string {
	switch (currentLanguage()) {
		case 'de':
			return 'Daten werden geladen…'
		case 'fr':
			return 'Chargement des données…'
		case 'pl':
			return 'Ładowanie danych…'
		default:
			return 'Loading data…'
	}
}
