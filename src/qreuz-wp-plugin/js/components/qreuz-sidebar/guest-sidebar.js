/**
 * Basic imports/reqs.
 * */
const { useState } = wp.element;
import { BrowserRouter as Router, Route, Switch, Link, useRouteMatch, useParams } from 'react-router-dom';

/**
 * Material UI imports
 * */
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

/**
 * Import custom components.
 * */
import { GenericContext, LocalContext } from './../../components/qreuz-state-provider/context';
import QreuzToolboxWoocommerce from './../qreuz-toolbox-woocommerce';

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

export default function GuestSidebar(props) {

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
	 * Handlers.
	 */
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	  };
	const handleClose = () => {
		setAnchorEl(null);
	};

	/**
	 * useEffect on initial load.
	 * */
	React.useEffect(() => {

	}, []);

	return (
		<div
			id={'qreuz-admin-sidebar-guest'}
			>
			<Card className={classes.root}>
				<CardHeader
					title="Elevate your game with sales tracking, inventory optimization, and AI-powered insights."
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
				<CardContent>
				<QreuzToolboxWoocommerce />
				</CardContent>
				<CardActions>
				<Button
					size="small"
					color="primary"
					href="https://qreuz.com/"
					target="_blank"
					>
					Visit Qreuz.com
				</Button>
				</CardActions>
			</Card>
		</div>
	)
}
