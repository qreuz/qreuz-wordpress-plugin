/** Material UI imports */
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
	column: {
		margin: '.5em 0',
		'& h1, h2, h3, h4, h5, h6': {
			margin: '0',
		},
	},
	helpText: {
		borderLeft: `1px solid ${theme.palette.divider}`,
		padding: theme.spacing(1, 2),
		whiteSpace: 'pre-line',
	},
}));


/**
 * Accordion block
 */
export default function QSettingsAccordion({
	children,
	name,
	title,
	subtitle,
	helpText,
	learnMoreLink,
	...props}) {

	/**
	 * Load resources
	 */
		/** Load styles */
		const classes = useStyles();

		/**Local state. */
		const [loading, setLoading] = React.useState(false);
		const [expanded,setExpanded] = React.useState(false);

	/**
	 * Handlers.
	 */
		/** Handle accordion expanded status */
		const handleChange = (panel) => (event, isExpanded) => {
			setExpanded(isExpanded ? panel : false);
			if (loading) {
				setLoading(false);
			}
		};
		/** Handle accordion save button click */
		const handleSettingsClose = (e) => {
			setLoading(true);
			setExpanded(false);
		}

	/**
	 * Components
	 */
		/** Learn more link */
		const LearnMoreLink = () => {
			if (undefined !== learnMoreLink) {
				return(
					<a href={learnMoreLink} target="_blank">Learn more</a>
				)
			}
		}

	/**
	 * Component return
	 */
	return(
		<React.Fragment>
			<Accordion
				expanded={expanded === name} 
				onChange={handleChange(name)}
				className={classes.accordionSetting}
				>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls={name + '-content'}
						id={name + '-header'}
						>
						<Grid container spacing={0}>
							<Grid item xs={4} sm={4} md={4} className={classes.column}>
								<Typography variant="h3">{title}</Typography>
							</Grid>
							<Grid item xs={8} sm={8} md={8} className={classes.column}>
								<Typography variant="caption" color="textSecondary" className={'accordionSettingsSecondaryHeading'}>{subtitle}</Typography>
							</Grid>
						</Grid>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={2}>
							<Grid item xs={8}>
								{children}
							</Grid>
							<Grid item xs={4} className={classes.helpText}>
								<Typography variant="caption">
									{helpText}
									<br />
									<LearnMoreLink />
								</Typography>
							</Grid>
						</Grid>
					</AccordionDetails>
					<Divider />
					<AccordionActions>
						<Button size="small" color="primary" onClick={(e) => {handleSettingsClose()}}>
							Save and close
							{loading && <CircularProgress size={24} />}
						</Button>
					</AccordionActions>
			</Accordion>
		</React.Fragment>
	)
}
