/**
 * Basic imports/reqs.
 * */

/**
 * Material UI imports
 * */
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import CheckIcon from '@material-ui/icons/Check';
import Divider from '@material-ui/core/Divider';

/**
 * Import custom components.
 * */
import { GenericContext, LocalContext } from './../../components/qreuz-state-provider/context';

/**
 * Define local styles.
 */
const useStyles = makeStyles({
	media: {
	  height: 140,
	},
	cardHeader: {
		'& .MuiCardHeader-title': {
			fontWeight: 'bold',
		},
		'& .MuiCardHeader-subheader': {
		},
	},
	divider: {
		margin: '2em 4em 1em',
	},
  });

export default function AdminPageHome(props) {

	/**
	 * Load context.
	 * */
	const { user, authKey, contextLoading, userPlan, isPropertyActive, message } = React.useContext(
		GenericContext
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
		document.title = "Get started - Qreuz";
	}, []);

	return (
		<div
			id={`qreuz-admin-page-getstarted`}
			aria-labelledby={`qreuz-plugin-navigation-getstarted`}
			>
			<Card className={classes.root}>
				<CardContent>
					<Typography gutterBottom variant="h3" component="h3">
						Track your users' behavior
					</Typography>
					<Typography variant="body2" component="p">
					Qreuz Tracking helps you to monitor the traffic and marketing of your WordPress website or WooCommerce store. We have invented a brand-new privacy first method of tracking user behavior. Finally, the growth and user tracking platform you were looking for.
					</Typography>

					<Divider className={classes.divider} />
					<Typography gutterBottom variant="h3" component="h3">
						Automate your WooCommerce pricing at scale
					</Typography>
					<Typography variant="body2" component="p">
						Qreuz Shop Pricing helps you to optimize your prices across your WooCommerce store. Stop wasting time by manually adjusting prices for your products. Automatically adjust prices across your WooCommerce catalog based on price levels, sale cycles, user behavior, and more.
					</Typography>

					<Divider className={classes.divider} />
					<Typography gutterBottom variant="h3" component="h3">
						Send your data wherever you want
					</Typography>
					<Typography variant="body2" component="p">
						Levarage our Qreuz Connectors to push optimized tracking data to ad networks, marketing dashboards, and email automation tools. Qreuz can integrate with the tools you are already using today.
						<List
							aria-labelledby="qreuz-connectors-subheader"
							subheader={
								<ListSubheader component="div" id="qreuz-connectors-subheader">
									Connect your data with
								</ListSubheader>
							}
							className={classes.root}
							>
							<ListItem>
								<ListItemIcon>
									<CheckIcon />
								</ListItemIcon>
								<ListItemText primary="Google Analytics" />
							</ListItem>
							<ListItem>
								<ListItemIcon>
									<CheckIcon />
								</ListItemIcon>
								<ListItemText primary="Google Ads" />
							</ListItem>
							<ListItem>
								<ListItemIcon>
									<CheckIcon />
								</ListItemIcon>
								<ListItemText primary="Google Merchant Center" />
							</ListItem>
							<ListItem>
								<ListItemIcon>
									<CheckIcon />
								</ListItemIcon>
								<ListItemText primary="Facebook Ads (Pixel)" />
							</ListItem>
							<ListItem>
								<ListItemIcon>
									<CheckIcon />
								</ListItemIcon>
								<ListItemText primary="Facebook Page" />
							</ListItem>
							<ListItem>
								<ListItemIcon>
									<CheckIcon />
								</ListItemIcon>
								<ListItemText primary="Bing Ads" />
							</ListItem>
    					</List>
					</Typography>

					<Divider className={classes.divider} />
					<Typography gutterBottom variant="h3" component="h3">
						Measure your WooCommerce business performance
					</Typography>
					<Typography variant="body2" component="p">
						Qreuz integrates perfectly with WooCommerce. Track conversions, add-to-carts, and other interactions of your customers. Identify the campaigns that drive your success. Understand your product performance.
					</Typography>
				</CardContent>
				<CardActions>
					<Button
						size="small"
						color="primary"
						href="https://qreuz.com/contact-us"
						target="_blank"
						>
						Request a new feature
					</Button>
					<Button
						size="small"
						color="primary"
						href="https://qreuz.com/contact-us"
						target="_blank"
						>
						Report a bug
					</Button>
				</CardActions>
			</Card>
		</div>
	)
}
