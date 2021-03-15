/**
 * Basic imports/reqs.
 * */
const { useState } = wp.element;
import { BrowserRouter as Router, Route, Switch, Link, useRouteMatch, useParams, Redirect } from 'react-router-dom';

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
import QreuzAjax from './../qreuz-ajax';

/**
 * Define local styles.
 */
const useStyles = makeStyles({
	root: {
	 	width: '100%',
	},
	media: {
	  height: 140,
	},
	cardHeader: {
		'& .MuiCardHeader-title': {
			fontFamily: 'inherit',
		},
		'& .MuiCardHeader-subheader': {
			fontSize: '0.78rem',
		},
	},
  });

export default function UserBox(props) {

	/**
	 * Load context.
	 * */
	const { message } = React.useContext(
		GenericContext
	);
	const {} = React.useContext(
		LocalContext
	);

	/**
	 * Local state.
	 */
	const [anchorEl, setAnchorEl] = React.useState(null);

	/**
	 * Load local styles.
	 */
	const classes = useStyles();

	/**
	 * Functions
	 */
		/** Process logout */
		const processLogout = async () => {
			try {
				const response = await QreuzAjax('qreuz_logout','now',props);
				if (response.success !== true) {
					/**
					 * Logout not successful.
					 */
					
				} else {
					/**
					 * Logged out.
					 */
					document.location.reload();
					
				}
			} catch (e) {
	
				console.log(e);
			}
		}

	/**
	 * Handlers.
	 */
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	  };
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleLogout = (e) => {
		handleClose();
		processLogout();
	};

	/**
	 * useEffect on initial load.
	 * */
	React.useEffect(() => {

	}, []);

	return (
		<div
			id={'qreuz-admin-sidebar-user-box'}
			>
			<Card className={classes.root}>
				<CardHeader
					avatar={
					<Avatar aria-label="user-avatar" className={classes.avatar}>
						 
					</Avatar>
					}
					action={
					<IconButton
						aria-label="settings"
						aria-controls="simple-menu"
						aria-haspopup="true"
						onClick={handleClick}
						>
						<MoreVertIcon />
					</IconButton>
					}
					//title="Welcome to Qreuz"
					subheader={"Status: " + message}
					className={classes.cardHeader}
				/>
				{/**}<CardContent>
					<Typography gutterBottom variant="h5" component="h2">
					Automated business growth for WooCommerce starts here
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
					Get started with Qreuz and enjoy fully automated user tracking.
					</Typography>
				</CardContent>{**/}
				<CardActions>
				<Button
					size="small"
					color="primary"
					href="https://qreuz.com/documentation"
					target="_blank"
					>
					Documentation
				</Button>
				<Button
					size="small"
					color="primary"
					href="https://qreuz.com/contact-us"
					target="_blank"
					>
					Customer service
				</Button>
				</CardActions>
			</Card>
			<Menu
				id="qreuz-admin-logout-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
				>
				<MenuItem onClick={(e) => handleLogout(e)}>Logout</MenuItem>
			</Menu>
		</div>
	)
}
