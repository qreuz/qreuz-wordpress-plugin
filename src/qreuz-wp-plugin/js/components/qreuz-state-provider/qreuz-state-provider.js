export const GenericProvider = React.lazy(() => import('./generic-provider.js'));
export const LocalProvider = React.lazy(() => import('./local-provider.js'));

export default function defaultExport() {
	return undefined 
}
