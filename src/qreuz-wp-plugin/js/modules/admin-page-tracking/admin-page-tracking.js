/** Material UI imports */
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import { useForm } from "react-hook-form";

import { SelectAutosave } from '../../components/react-hook-form-components';

import { LocalContext } from './../../components/qreuz-state-provider/context';
import { QSettingsAccordion } from './../../components/qreuz-settings-components';

const useStyles = makeStyles((theme) => ({

}));

/**
 * Module for: Admin Page Tracking
 */
export default function AdminPageTracking(props) {

	/**
	 * Load resources
	 */
		/** Load styles */
		const classes = useStyles();

		/** Load context */
		const { localStore } = React.useContext(
			LocalContext
		);

		/** Load state */
		const [defaultValue,setDefaultValue] = React.useState({
			qreuz_tracking_method: localStore.tracking.qreuz_tracking_method
		});

		/** react-hook-form */
		const { control } = useForm();

	/**
	 * useEffect on initial load.
	 * */
	React.useEffect(() => {
		document.title = "Tracking settings - Qreuz";
	}, []);

	return (
		<React.Fragment>
			<div
				id={`qreuz-admin-page-tracking`}
				aria-labelledby={`qreuz-plugin-navigation-tracking`}
				index={'tracking'}
				>
				<Grid container spacing={0}>
					<Grid item xs={12} md={12}>
						<Typography variant="h2" gutterBottom>
							User tracking
						</Typography>
						<Typography variant="body1" gutterBottom>
							On this page, you can configure Qreuz Tracking.
						</Typography>
					</Grid>
					<Grid item xs={12} sm={12} md={12}>
						<QSettingsAccordion
							name="visitorTracking"
							title="Visitor tracking"
							subtitle="Select your tracking method"
							helpText={"Activate visitor tracking to start capturing behavioral data from your website's visitors. \nYou can select from the options listed here. We recommend to select 'Enhanced visitor tracking' unless you know what you're doing."}
							learnMoreLink="https://qreuz.com/documentation"
							>
							<SelectAutosave
								id="qreuz_tracking_method"
								name="qreuz_tracking_method"
								label="Visitor tracking method"
								defaultValue={(defaultValue.qreuz_tracking_method === '' ? false : defaultValue.qreuz_tracking_method)}
								control={control}
								saveOnChange={true}
								localStoreData={{
									section:'tracking',
									data:'qreuz_tracking_method'
									}}
								>
									<MenuItem value="enhanced" key="enhanced">Enhanced visitor tracking (recommended)</MenuItem>
									<MenuItem value="frontend" key="frontend">Front-end visitor tracking (not recommended)</MenuItem>
									<MenuItem value={false} key="no_tracking">Disable visitor tracking</MenuItem>
							</SelectAutosave>
						</QSettingsAccordion>
					</Grid>
				</Grid>
			</div>
		</React.Fragment>
	)
}
