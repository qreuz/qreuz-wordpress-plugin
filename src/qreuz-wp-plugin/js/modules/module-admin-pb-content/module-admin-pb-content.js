/**
 * Basic imports/reqs.
 * */
const { render, useState } = wp.element;
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useRouteMatch, useHistory, useLocation } from 'react-router-dom';
var qs = require('qs');
import PropTypes from 'prop-types';

/** Material UI imports */
import { ThemeProvider, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

/**
 * Import theme
 * */
import { qreuzTheme } from './../../../../shared/components/qreuz-theme';
const qreuzThemeWpPlugin = createMuiTheme({
	...qreuzTheme,
	overrides: {
		...qreuzTheme.overrides,
		MuiButton: {
			...qreuzTheme.overrides.MuiButton,
			contained: {
				...qreuzTheme.overrides.MuiButton.contained,
				fontWeight: 'bold',
			},
		},
	},
});

/**
 * Import custom components
 * */
import { GenericContext } from './../../components/qreuz-state-provider/context';
import QreuzHelperErrorBoundary from './../../components/qreuz-helper-error-boundary';
const QreuzPluginNavigation = React.lazy(() => import('./../../components/qreuz-plugin-navigation'));

/**
 * Circular progress element (suspense loader).
 * */
const qreuzSuspenseLoader = () => <Container maxWidth={'lg'}><CircularProgress size={24} /></Container>;

/**
 * Import admin pages and content.
 */
const AdminPageHome = React.lazy(() => import('./../admin-page-home'));
const AdminPagePricing = React.lazy(() => import('./../admin-page-pricing'));
const AdminPageGetstarted = React.lazy(() => import('./../admin-page-getstarted'));
const AdminPageLogin = React.lazy(() => import('./../admin-page-login'));
const AdminPageTracking = React.lazy(() => import('./../admin-page-tracking'));
const AdminPageWhatIsQreuz = React.lazy(() => import('./../admin-page-what-is-qreuz'));
const AdminSidebar = React.lazy(() => import('./../admin-sidebar'));

/**
 * Define local styles.
 *  */
const useStyles = makeStyles((theme) => ({
	qreuzNavigation: {
		boxShadow: 'none',
	},
	wrapper: {
		margin: '2em 0',
	},
}));

console.log(`
 ██████╗ ██████╗ ███████╗██╗   ██╗███████╗
██╔═══██╗██╔══██╗██╔════╝██║   ██║╚══███╔╝
██║   ██║██████╔╝█████╗  ██║   ██║  ███╔╝ 
██║▄▄ ██║██╔══██╗██╔══╝  ██║   ██║ ███╔╝  
╚██████╔╝██║  ██║███████╗╚██████╔╝███████╗
╚══▀▀═╝ ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚══════╝`);


/**
 * Module for: admin page block 'content'
 * 
 * @param props
 */
export default function ModuleAdminPbContent(props) {

	/**
	 * Load context.
	 * */
	const { open, user, contextLoading } = React.useContext(
		GenericContext
	);

	/**
	 * Local state.
	 */
	const [value, setValue] = React.useState(0);

	/**
	 * Load local styles.
	 * */
	const classes = useStyles();

	/**
	 * Content for logged-out (guest) mode.
	 * */
	const GuestContent = () => {

		var queryParams = qs.parse(location.search);
		
		switch ( queryParams.subpage ) {
			case 'pricing':
				return ( <AdminPageGetstarted {...props} /> );
			case 'home':
				return ( <AdminPageGetstarted {...props} /> );
			case 'getstarted':
				return ( <AdminPageGetstarted {...props} /> );
			case 'login':
				return ( <AdminPageLogin {...props} /> );
			case 'tracking':
				return ( <AdminPageGetstarted {...props} /> );
			case 'whatisqreuz':
				return ( <AdminPageWhatIsQreuz {...props} /> );
			default:
				return ( <AdminPageGetstarted {...props} /> );
		}
	}

	/**
	 * Load content for logged-out (guest) status.
	 * */
	const LoadGuest = () => {

		return (
			<Router basename={(qreuzEnv.basepath == null ? '' : qreuzEnv.basepath) + "/wp-admin"}>
				<QreuzPluginNavigation {...props} />
				<Box className={classes.wrapper}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={12} md={8}>		
							<Switch>
								<Route path="/" component={GuestContent} />
							</Switch>
						</Grid>
						<Grid item xs={12} sm={12} md={4}>
							<AdminSidebar {...props} />
						</Grid>
					</Grid>
				</Box>
			</Router>
		)
	}

	/**
	 * Content for logged-in (user) mode.
	 * */
	const UserContent = () => {

		var queryParams = qs.parse(location.search);
		
		switch ( queryParams.subpage ) {
			case 'getstarted':
				return ( <AdminPageHome {...props} /> );
			case 'tracking':
				return ( <AdminPageTracking {...props} /> );
			case 'pricing':
				return ( <AdminPagePricing {...props} /> );
			default:
				return ( <AdminPageHome {...props} /> );
		}
	}

	/**
	 * Load content for logged-in (user) mode.
	 * */
	const LoadUser = () => {

		return (
			<Router basename={(qreuzEnv.basepath == null ? '' : qreuzEnv.basepath) + "/wp-admin"}>
				<QreuzPluginNavigation {...props} />
				<Box className={classes.wrapper}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={12} md={8}>
							<Switch>
								<Route path="/" component={UserContent} />
							</Switch>
						</Grid>
						<Grid item xs={12} sm={12} md={4}>
							<AdminSidebar {...props} />
						</Grid>
					</Grid>
				</Box>
			</Router>
		)
	}

	/**
	 * Load content based on user/guest switch.
	 *  */
	const LoadUserOrGuest = () => {
		if ( user === false ) {
			return <LoadGuest {...props} />
		} else if ( user !== false ) {
			return <LoadUser {...props} />
		}
	}

	/**
	 * Loading animation as long as contextLoading is true.
	 */
	if ( contextLoading ) {
		return (
			<React.Fragment>
				<ThemeProvider theme={qreuzThemeWpPlugin}>
					{qreuzSuspenseLoader()}
				</ThemeProvider>
			</React.Fragment>
		);
	}

	/**
	 * Handlers.
	 */
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	/**
	 * Return the content of the plugin admin pages.
	 */
	return (
		<React.Fragment>
			<ThemeProvider theme={qreuzThemeWpPlugin}>
				<QreuzHelperErrorBoundary>
					<Suspense fallback={qreuzSuspenseLoader()}>
							<LoadUserOrGuest {...props} />
					</Suspense>
				</QreuzHelperErrorBoundary>
			</ThemeProvider>
		</React.Fragment>
	);
}
