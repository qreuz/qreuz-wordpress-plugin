import QreuzAjax from './../qreuz-ajax';

import { GenericContext } from './context';

/** initial values */
const initialState = {
	contextLoading: true,
	localContextLoading: true,
	open: false,
	user: false,
	userPlan: false,
	authKey: false,
	authParam: false,
	userEmail: false,
	isPropertyActive: true,
	justLoggedIn: false,
	message: undefined,
};

/** actions */
const actions = {
	SET_CONTEXT_LOADING: "SET_CONTEXT_LOADING",
	SET_LOCAL_CONTEXT_LOADING: "SET_LOCAL_CONTEXT_LOADING",
	SET_OPEN: "SET_OPEN",
	SET_USER: "SET_USER",
	SET_USER_PLAN: "SET_USER_PLAN",
	SET_AUTH_KEY: "SET_AUTH_KEY",
	SET_AUTH_PARAM: "SET_AUTH_PARAM",
	SET_USER_EMAIL: "SET_USER_EMAIL",
	SET_IS_PROPERTY_ACTIVE: "SET_IS_PROPERTY_ACTIVE",
	SET_JUST_LOGGED_IN: "SET_JUST_LOGGED_IN",
	SET_MESSAGE: "SET_MESSAGE",
};

/** reducer */
function GenericReducer(state, action) {
	switch (action.type) {
		case actions.SET_CONTEXT_LOADING:
			return {
				...state,
				contextLoading: action.value
			};
		case actions.SET_LOCAL_CONTEXT_LOADING:
			return {
				...state,
				localContextLoading: action.value
			};
		case actions.SET_OPEN:
			return {
				...state,
				open: action.value
			};
		case actions.SET_USER:
			return {
				...state,
				user: action.value
			};
		case actions.SET_USER_PLAN:
			return {
				...state,
				userPlan: action.value
			};
		case actions.SET_AUTH_KEY:
			return {
				...state,
				authKey: action.value
			};
		case actions.SET_AUTH_PARAM:
			return {
				...state,
				authParam: action.value
			};
		case actions.SET_USER_EMAIL:
			return {
				...state,
				userEmail: action.value
			};
		case actions.SET_IS_PROPERTY_ACTIVE:
			return {
				...state,
				isPropertyActive: action.value
			};
		case actions.SET_JUST_LOGGED_IN:
			return {
				...state,
				justLoggedIn: action.value
			};
		case actions.SET_MESSAGE:
			return {
				...state,
				message: action.value
			};
		default:
			return state;
	}
}

/** export: GenericProvider */
export default function GenericProvider({ children }, props) {
	const [state, dispatch] = React.useReducer(GenericReducer, initialState);

	const value = {
		contextLoading: state.contextLoading,
		localContextLoading: state.localContextLoading,
		open: state.open,
		user: state.user,
		userPlan: state.userPlan,
		authKey: state.authKey,
		authParam: state.authParam,
		userEmail: state.userEmail,
		isPropertyActive: state.isPropertyActive,
		justLoggedIn: state.justLoggedIn,
		message: state.message,
		setContextLoading: value => {
			dispatch({ type: actions.SET_CONTEXT_LOADING, value });
		},
		setLocalContextLoading: value => {
			dispatch({ type: actions.SET_LOCAL_CONTEXT_LOADING, value });
		},
		setOpen: value => {
			dispatch({ type: actions.SET_OPEN, value });
		},
		setUser: value => {
			dispatch({ type: actions.SET_USER, value });
		},
		setUserPlan: value => {
			dispatch({ type: actions.SET_USER_PLAN, value });
		},
		setAuthKey: value => {
			dispatch({ type: actions.SET_AUTH_KEY, value });
		},
		setAuthParam: value => {
			dispatch({ type: actions.SET_AUTH_PARAM, value });
		},
		setUserEmail: value => {
			dispatch({ type: actions.SET_USER_EMAIL, value });
		},
		setIsPropertyActive: value => {
			dispatch({ type: actions.SET_IS_PROPERTY_ACTIVE, value });
		},
		setJustLoggedIn: value => {
			dispatch({ type: actions.SET_JUST_LOGGED_IN, value });
		},
		setMessage: value => {
			dispatch({ type: actions.SET_MESSAGE, value });
		},
	}

	function getUrlParam(param) {
		var results = new RegExp('[\\?&]' + param + '=([^&#]*)').exec(window.location.href);
		return (results && results[1]) || undefined;
	}

	/**
	 * Fetch user data
	 * */
	const fetchData = async () => {
		try {

			const response = await QreuzAjax('qreuz_get_user_data','wp_plugin_generic_provider_data',props);

			if (response.user !== true) {
				/**
				 * User is not logged in (Guest mode).
				 */
				value.setUser(false);

				var paramAuth = getUrlParam('auth');

				if( paramAuth > "" ) {
					/**
					 * Check auth url param if present
					 * */
					const fetchAuthKey = async () => {
						try {
							const pushParams = {
								"auth_key": paramAuth
							}
							const authKeyResponse = await QreuzAjax('qreuz_getstarted', 'wp_plugin_check_auth_key', props, pushParams);
							if (authKeyResponse.success === true) {
								value.setAuthKey(true);
								value.setAuthParam(paramAuth);
								value.setUserEmail(authKeyResponse.email);
							} else {
								value.setAuthKey(false);
							}
							value.setContextLoading(false);
						} catch (eAuth) {
							console.log(eAuth)
						}
					}

					fetchAuthKey();
				} else {
					/**
					 * Auth param not present
					 */
					value.setContextLoading(false);
					value.setAuthKey(false);
				}
			} else {
				/**
				 * User is logged in.
				 */
				value.setContextLoading(false);
				value.setUser(true);
				value.setUserPlan(response.user_data.plan.active);
				value.setIsPropertyActive(response.user_data.is_active);
				value.setMessage((response.user_data.is_active ? 'active' : 'pending'));
			}
		} catch (e) {

			console.log(e);
		}
	};

	/**
	 * useEffect on initial load.
	 * */
	React.useEffect(() => {

		fetchData();
	}, []);

	/**
	 * useEffect right after login.
	 */
	React.useEffect(() => {

		fetchData();
		value.setJustLoggedIn(false);
	}, [value.justLoggedIn]);

	return (
		<GenericContext.Provider value={value}>
			{children}
		</GenericContext.Provider>
	)
}
