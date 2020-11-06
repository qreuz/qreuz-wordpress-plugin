/**
 * Component: LocalProvider
 * Used to provide the context for the local (WordPress) environment.
 */

/**
 * Custom component imports
 */
import QreuzAjax from './../qreuz-ajax';
import { LocalContext } from './context';

/** initial values */
const initialState = {
	contextLoading: true,
	open: true,
	navigationPosition: false,
	wpSettingsTracking: false,
	wpSettingsPricing: false,
	wpData: false,
	wpStaticData: false,
	qreuzData: false,
};

/** actions */
const actions = {
	SET_CONTEXT_LOADING: "SET_CONTEXT_LOADING",
	SET_OPEN: "SET_OPEN",
	SET_NAVIGATION_POSITION: "SET_NAVIGATION_POSITION",
	SET_WP_SETTINGS_TRACKING: "SET_WP_SETTINGS_TRACKING",
	SET_WP_SETTINGS_PRICING: "SET_WP_SETTINGS_PRICING",
	SET_WP_DATA: "SET_WP_DATA",
	SET_WP_STATIC_DATA: "SET_WP_STATIC_DATA",
	SET_QREUZ_DATA: "SET_QREUZ_DATA",
};

/** 
 * Local reducer
 * */
function LocalReducer(state, action) {
	switch (action.type) {
		case actions.SET_CONTEXT_LOADING:
			return {
				...state,
				contextLoading: action.value
			};
		case actions.SET_OPEN:
			return {
				...state,
				open: action.value
			};
		case actions.SET_NAVIGATION_POSITION:
			return {
				...state,
				navigationPosition: action.value
			};
		case actions.SET_WP_SETTINGS_TRACKING:
			return {
				...state,
				wpSettingsTracking: action.value
			};
		case actions.SET_WP_SETTINGS_PRICING:
			return {
				...state,
				wpSettingsPricing: action.value
			};
		case actions.SET_WP_DATA:
			return {
				...state,
				wpData: action.value
			};
		case actions.SET_WP_STATIC_DATA:
			return {
				...state,
				wpStaticData: action.value
			};
		case actions.SET_QREUZ_DATA:
			return {
				...state,
				qreuzData: action.value
			};
		default:
			return state;
	}
}

/** 
 * Export: LocalProvider
 * */
export default function LocalProvider({ children }, props) {
	const [state, dispatch] = React.useReducer(LocalReducer, initialState);

	const value = {
		contextLoading: state.contextLoading,
		open: state.open,
		navigationPosition: state.navigationPosition,
		wpSettingsTracking: state.wpSettingsTracking,
		wpSettingsPricing: state.wpSettingsPricing,
		wpData: state.wpData,
		wpStaticData: state.wpStaticData,
		qreuzData: state.qreuzData,
		setContextLoading: value => {
			dispatch({ type: actions.SET_CONTEXT_LOADING, value });
		},
		setOpen: value => {
			dispatch({ type: actions.SET_OPEN, value });
		},
		setNavigationPosition: value => {
			dispatch({ type: actions.SET_NAVIGATION_POSITION, value });
		},
		setWpSettingsTracking: value => {
			dispatch({ type: actions.SET_WP_SETTINGS_TRACKING, value });
		},
		setWpSettingsPricing: value => {
			dispatch({ type: actions.SET_WP_SETTINGS_PRICING, value });
		},
		setWpData: value => {
			dispatch({ type: actions.SET_WP_DATA, value });
		},
		setWpStaticData: value => {
			dispatch({ type: actions.SET_WP_STATIC_DATA, value });
		},
		setQreuzData: value => {
			dispatch({ type: actions.SET_QREUZ_DATA, value });
		},
	}

	function getUrlParam(param) {
		var results = new RegExp('[\\?&]' + param + '=([^&#]*)').exec(window.location.href);
		return (results && results[1]) || undefined;
	}

	/**
	 * Get navigation position
	 * */
	const getNavigationPosition = async () => {
		/** Get navigation position from url parameter */
		var paramNavPos = getUrlParam('subpage');

		if( paramNavPos > "" ) {
			/** Url parameter found - set navigation position accordingly */
			value.setNavigationPosition(paramNavPos);
		} else {
			/** Url parameter not present - set standard navigation position */
			value.setNavigationPosition('getstarted');
		}
	};

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
			
				value.setWpSettingsTracking({
					qreuz_tracking_visitor_tracking: response.tracking.qreuz_tracking_visitor_tracking,
					qreuz_tracking_low_budget_tracking: response.tracking.qreuz_tracking_low_budget_tracking,
				});
				value.setWpSettingsPricing({
					qreuz_smart_pricing_premium_category: response.pricing.qreuz_smart_pricing_premium_category,
					qreuz_smart_pricing_premium_percent: response.pricing.qreuz_smart_pricing_premium_percent,
					qreuz_smart_pricing_sale_category: response.pricing.qreuz_smart_pricing_sale_category,
					qreuz_smart_pricing_sale_percent: response.pricing.qreuz_smart_pricing_sale_percent,
					qreuz_smart_pricing_price_scheme: response.pricing.qreuz_smart_pricing_price_scheme,
				});
				value.setWpData({
					//
				});
				value.setWpStaticData({
					woocommerce_currency: response.static_data.woocommerce_currency,
				});
				value.setQreuzData({
					woocommerce_product_categories: response.qreuz_data.woocommerce_product_categories,
				});
				value.setContextLoading(false);
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
				tracking: value.wpSettingsTracking,
				pricing: value.wpSettingsPricing,
				qreuz_data: value.qreuzData,
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
			}
		} catch (e) {

			console.log(e);
		}
	}

	/**
	 * useEffect on initial load.
	 * */
	React.useEffect(() => {

		//getNavigationPosition();
		fetchLocalData();
	}, []);

	/**
	 * useEffect on variable change.
	 * */
	React.useEffect(() => {

		/** 
		 * Proceed only if we are not currently in initial loading of context.
		 */
		if ( false === value.contextLoading ) {
			updateLocalData();
		}
		
	}, [value.wpSettingsTracking, value.wpSettingsPricing, value.qreuzData]);


	return (
		<LocalContext.Provider value={value}>
			{children}
		</LocalContext.Provider>
	)
}
