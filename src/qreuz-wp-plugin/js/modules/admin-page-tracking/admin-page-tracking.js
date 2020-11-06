/** Material UI imports */
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
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles({

});

/**
 * Import custom components.
 * */
import { GenericContext, LocalContext } from './../../components/qreuz-state-provider/context';

/**
 * Module for: Admin Page Tracking
 */
export default function AdminPageTracking(props) {

	/**
	 * Load local styles.
	 */
	const classes = useStyles();

	/**
	 * Load context.
	 * */
	const { user, authKey, contextLoading, userPlan, isPropertyActive, message } = React.useContext(
		GenericContext
	);
	const { wpSettingsTracking, setWpSettingsTracking, setNavigationPosition } = React.useContext(
		LocalContext
	);

	/**
	 * Local state.
	 */

	/**
	 * Handlers.
	 */
	const handleSettingsChange = (event) => {
		setWpSettingsTracking({
			...wpSettingsTracking,
			[event.target.name]: event.target.checked
		});
	};

	/**
	 * useEffect on initial load.
	 * */
	React.useEffect(() => {

		setNavigationPosition('tracking');
	}, []);

	return (
		<div
			id={`qreuz-admin-page-tracking`}
			aria-labelledby={`qreuz-plugin-navigation-tracking`}
			index={'tracking'}
			>
			<Typography variant="h3">
				User tracking settings
			</Typography>

			<FormControlLabel
				control={
				<Switch
					checked={wpSettingsTracking.qreuz_tracking_visitor_tracking}
					onChange={handleSettingsChange}
					name="qreuz_tracking_visitor_tracking"
					color="primary"
				/>
				}
				label="Visitor tracking"
			/>
			<FormControlLabel
				control={
				<Switch
					checked={wpSettingsTracking.qreuz_tracking_low_budget_tracking}
					onChange={handleSettingsChange}
					name="qreuz_tracking_low_budget_tracking"
					color="primary"
				/>
				}
				label="Low budget tracking"
			/>
		</div>
	)
}
