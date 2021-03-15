/**
 * Component: LocalProvider
 * Used to provide the context for the local (WordPress) environment.
 */

/**
 * Custom component imports
 */
import QreuzAjax from './../qreuz-ajax';
import { LocalContext, GenericContext } from './context';


/** initial values */
const initialState = {
	tracking: undefined,
	pricing: undefined,
	woocommerce: undefined,
	qreuz_data: undefined,
	autosaving: false,
};


/** 
 * Export: LocalProvider
 * */
export default function LocalProvider({ children }, props) {
	const [localStore, setLocalStore] = React.useState(initialState);
	const store = {localStore, setLocalStore};

	/** Load Generic context */
	const { localContextLoading, setLocalContextLoading } = React.useContext(
		GenericContext
	);

	/**
	 * Fetch local user data (WordPress)
	 * */
	const fetchLocalData = async () => {
		try {

			const response = await QreuzAjax('qreuz_get_wp_options','all',props);
			if (response.success !== true) {
				/**
				 * Options not sucessfully retrieved.
				 */
				
			} else {
				/**
				 * Update options in context.
				 */
				let newLocalStoreObj = { ...localStore };
				let newLocalStore = Object.keys(response).map((param) => {
					newLocalStoreObj[param] = response[param];	
				});
				setLocalStore(newLocalStoreObj);

				/** Announce context loaded state */
				setLocalContextLoading(false);
			}
		} catch (e) {

			console.log(e);
		}
	};

	/**
	 * Update local user data (WordPress)
	 */
	const updateLocalData = async () => {
		try {

			const pushParams = {
				tracking: localStore.tracking,
				pricing: localStore.pricing,
				qreuz_data: localStore.qreuz_data,
			}
			
			const response = await QreuzAjax('qreuz_update_wp_options','all',props, pushParams);
			if (response.success !== true) {
				/**
				 * Data not sucessfully updated.
				 */
				
			} else {
				/**
				 * Data updated in WordPress.
				 */
				return
			}
		} catch (e) {

			console.log(e);
		}
	}

	/**
	 * useEffect on initial load.
	 * */
	React.useEffect(() => {

		fetchLocalData();
	}, []);

	/**
	 * useEffect on variable change.
	 * */
	React.useEffect(() => {
		/** 
		 * Proceed only if we are not currently in initial loading of context.
		 */
		if ( false === localContextLoading ) {
				const timer = setTimeout(function(){
					setLocalStore({
						...localStore,
						autosaving: true,
					});
					updateLocalData();
					setLocalStore({
						...localStore,
						autosaving: false,
					});
				}, 2300);
				return() => clearTimeout(timer);
		}
		
	}, [localStore.tracking, localStore.pricing, localStore.woocommerce, localStore.qreuz_data]);

	return (
		<LocalContext.Provider value={store}>
			{children}
		</LocalContext.Provider>
	)
}
