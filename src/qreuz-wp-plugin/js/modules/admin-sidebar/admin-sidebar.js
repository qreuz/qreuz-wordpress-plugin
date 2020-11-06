/**
 * Basic imports/reqs.
 * */
const { render, useState } = wp.element;
import { BrowserRouter as Router, Route, Switch, Link, useRouteMatch, useParams } from 'react-router-dom';

/**
 * Material UI imports
 * */
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

/**
 * Import custom components.
 * */
import { GenericContext, LocalContext } from './../../components/qreuz-state-provider/context';
import { UserBox, GuestSidebar } from './../../components/qreuz-sidebar';

/**
 * Define local styles.
 */
const useStyles = makeStyles({
	root: {
	  maxWidth: 345,
	},
	media: {
	  height: 140,
	},
	cardHeader: {
		'& .MuiCardHeader-title': {
			fontFamily: 'inherit',
		},
		'& MuiCardHeader-subheader': {
			fontSize: '90%',
		},
	},
  });

const LoadUserSidebar = () => {

	return (
		<UserBox />
	);
}

/**
 * Export module: Admin sidebar
 */
export default function AdminSidebar(props) {

	/**
	 * Load context.
	 * */
	const { user, authKey, contextLoading, userPlan, isPropertyActive, message } = React.useContext(
		GenericContext
	);
	const { open } = React.useContext(
		LocalContext
	);

	/**
	 * Local state.
	 */
	

	/**
	 * Load local styles.
	 */
	const classes = useStyles();

	/**
	 * Handlers.
	 */
	

	/**
	 * useEffect on initial load.
	 * */
	React.useEffect(() => {

	}, []);

	/**
	 * Load sidebar content
	 */
	const LoadGuestSidebar = () => {

		return (
			<GuestSidebar />
		);
	}
	
	const LoadSidebarContent = () => {
	
		if ( true === user ) {
			return (
				<LoadUserSidebar />
			)
		} else {
			return(
				<LoadGuestSidebar />
			)
		}
	}

	return (
		<div id={'qreuz-admin-sidebar'}>
			<LoadSidebarContent />
		</div>
	)
}
