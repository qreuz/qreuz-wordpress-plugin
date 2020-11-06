/**
 * Basic imports/reqs.
 * */
const { render, useState } = wp.element;
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useRouteMatch, useHistory, useLocation } from 'react-router-dom';
var qs = require('qs');
import PropTypes from 'prop-types';

/** Material UI imports */
import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

/**
 * Import custom components
 * */
import { GenericContext, LocalContext } from './../../components/qreuz-state-provider/context';

/**
 * Define local styles.
 *  */
const useStyles = makeStyles((theme) => ({
	sidebar: {
		backgroundColor: '#ff0000',
	},
	qreuzNavigation: {
		boxShadow: 'none',
	},
}));

function a11yProps(index) {
	return {
		id: `qreuz-plugin-navigation-${index}`,
		'aria-controls': `qreuz-admin-page-${index}`,
	};
}

/**
 * Component for: Qreuz admin navigation
 * 
 * @param props
 */
export default function QreuzAdminNavigation(props) {

	/**
	 * Load context.
	 * */
	const { user, contextLoading } = React.useContext(
		GenericContext
	);
	const { navigationPosition } = React.useContext(
		LocalContext
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
	 * Navigation for logged-out (guest) mode.
	 * */
	const GuestNavigation = () => {

		var queryParams = qs.parse(location.search);
		
		switch ( queryParams.subpage ) {
			default:
				return (
					<React.Fragment>
						<AppBar
							position="static"
							className={classes.qreuzNavigation}>
							<Tabs value={navigationPosition} onChange={handleChange} aria-label="qreuz-plugin-navigation">
								<Tab label="Get started" value="getstarted" to="admin.php?page=qreuz&subpage=getstarted" component={Link} {...a11yProps('getstarted')} />
								<Tab label="What is Qreuz?" value="whatisqreuz" to="admin.php?page=qreuz&subpage=whatisqreuz" component={Link} {...a11yProps('whatisqreuz')} />
							</Tabs>
						</AppBar>
					</React.Fragment>
				);
		}
	}

	/**
	 * Load navigation for logged-out (guest) status.
	 * */
	const LoadGuestNavigation = () => {

		return (
			<GuestNavigation />
		)
	}

	/**
	 * Navigation for logged-in (user) mode.
	 * */
	const UserNavigation = () => {

		var queryParams = qs.parse(location.search);
		
		switch ( queryParams.subpage ) {
			default:
				return ( 
					<React.Fragment>
						<AppBar
							position="static"
							className={classes.qreuzNavigation}>
							<Tabs value={navigationPosition} onChange={handleChange} aria-label="qreuz-plugin-navigation">
								<Tab label="Get started" value="getstarted" to="admin.php?page=qreuz&subpage=getstarted" component={Link} {...a11yProps('getstarted')} />
								<Tab label="User tracking" value="tracking" to="admin.php?page=qreuz&subpage=tracking" component={Link} {...a11yProps('tracking')} />
								<Tab label="Shop pricing" value="pricing" to="admin.php?page=qreuz&subpage=pricing" component={Link} {...a11yProps('pricing')} />
							</Tabs>
						</AppBar>
					</React.Fragment>
				);
		}
	}

	/**
	 * Load navigation for logged-in (user) mode.
	 * */
	const LoadUserNavigation = () => {

		return (
			<UserNavigation />
		)
	}

	/**
	 * Load navigation based on user/guest context.
	 *  */
	const LoadUserOrGuestNavigation = () => {
		if ( user === false ) {
			return <LoadGuestNavigation {...props} />
		} else if ( user !== false ) {
			return <LoadUserNavigation {...props} />
		}
	}

	/**
	 * Handlers.
	 */
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	/**
	 * Return the plugin navigation.
	 */
	return (
		<React.Fragment>
			<LoadUserOrGuestNavigation {...props} />
		</React.Fragment>
	);
}
