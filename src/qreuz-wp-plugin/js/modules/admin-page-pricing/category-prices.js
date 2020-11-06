const { useState } = wp.element;
import { BrowserRouter as Link } from 'react-router-dom';

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";

/** Material UI imports */
import { makeStyles } from '@material-ui/core/styles';

/**
 * Material UI imports.
 */
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert, AlertTitle } from '@material-ui/lab';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';

/**
 * Import custom components.
 * */
import { GenericContext, LocalContext } from './../../components/qreuz-state-provider/context';

/**
 * Define local styles.
 */
const useStyles = makeStyles((theme) => ({
	details: {
		alignItems: 'center',
	},
	column: {
		margin: '.5em 0',
		'& h1, h2, h3, h4, h5, h6': {
			margin: '0',
		},
		'& h4': {
			fontSize: '0.78rem',
			display: 'inline',
			verticalAlign: 'baseline',
		},
	},
	helper: {
		borderLeft: `1px solid ${theme.palette.divider}`,
		padding: theme.spacing(1, 2),
	},
	settingsHeading: {

	},
	settingsSecondaryHeading: {
		fontSize: theme.typography.pxToRem(15),
		color: theme.palette.text.secondary,
	},
}));

/**
 * Yup validation schemas
 * */
function transform(value, originalValue) {
	if (originalValue.trim() === "" || originalValue.trim() === "*") {
	  return null;
	} else {
	  return value;
	}
}
const validationSchemaPrice = yup.object().shape({
	qreuz_smart_pricing_premium_percent: yup.number()
		.typeError('Please enter a valid number from 0-100%')
		.min(0, 'Please enter a valid number from 0-100%')
		.max(100, 'Please enter a valid number from 0-100%')
		.nullable()
		.transform(transform),
	qreuz_smart_pricing_sale_percent: yup.number()
		.typeError('Please enter a valid number from 0-100%')
		.min(0, 'Please enter a valid number from 0-100%')
		.max(100, 'Please enter a valid number from 0-100%')
		.nullable()
		.transform(transform),
  });

/**
 * Module for: Admin Page Tracking
 */
export default function AdminPagePricing(props) {

	/**
	 * Load local styles.
	 */
	const classes = useStyles();

	/**
	 * react-hook-form
	 * */
	const { handleSubmit, register, reset, errors, control } = useForm({
		resolver: yupResolver(validationSchemaPrice)
	});

	/**
	 * Load context.
	 * */
	const { user, authKey, contextLoading, userPlan, isPropertyActive, message } = React.useContext(
		GenericContext
	);
	const { wpSettingsPricing, setWpSettingsPricing, wpStaticData, qreuzData, setQreuzData } = React.useContext(
		LocalContext
	);

	/**
	 * Local state.
	 */
	const [loading, setLoading] = React.useState(false);
	const [success, setSuccess] = React.useState(false);
	const timer = React.useRef();
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbar, setSnackbar] = useState({
		variant: '',
		message: '',
		title: '',
		link01: '',
		linkText01: '',
		link02: '',
		linkText02: '',
	});

	/**
	 * Handlers.
	 */
	const handleSnackbarClose = (event, reason) => {

		if (reason === 'clickaway') {
			return;
		}

		setSnackbarOpen(false);
	}
	const handleSettingsCancel = (e) => {

		reset()
	}

	/** 
	 * Form submit
	 * */
	const onSubmit = (data) => {

		if (!loading) {
			setSuccess(false);
			setLoading(true);
		}

		let newPrices = [
			...qreuzData.woocommerce_product_categories
		];

		let newPricesMap = newPrices.map((product_category) => {

			const elementsIndex = newPrices.findIndex( element => element.term_id == product_category.term_id );

			newPrices[elementsIndex] = {
				...newPrices[elementsIndex],
				price: data[product_category.term_id]
			}

			return
		});

		setQreuzData({
			...qreuzData,
			woocommerce_product_categories: newPrices
		});

		setSuccess(true);
		setLoading(false);
	}

	/**
	 * useEffect on initial load.
	 * */
	React.useEffect(() => {

	}, []);

	/**
	 * Map categories.
	 */
	const LoadCategories = () => {

		var productCategories = ( undefined === qreuzData.woocommerce_product_categories ? [] : qreuzData.woocommerce_product_categories );

		var productCategoriesMap = productCategories.map((product_category, index) => {

			return(
				<TextField 
					inputRef={register({required:false})}
					name={product_category.term_id}
					id={"qreuz_smart_price_cat_" + product_category.term_id}
					type="text"
					label={product_category.name}
					error={errors["qreuz_smart_price_cat_" + product_category.term_id]}
					defaultValue={(false === product_category.price ? '' : product_category.price)}
					InputProps={{
						endAdornment:<InputAdornment position="end">{wpStaticData.woocommerce_currency}</InputAdornment>,
					}}
					disabled={loading}
					helperText={errors["qreuz_smart_price_cat_" + product_category.term_id] ? errors["qreuz_smart_price_cat_" + product_category.term_id].message : ' '}
					/>
			)
		});

		return productCategoriesMap;
	}
	
	return (
		<React.Fragment>
			<Grid container spacing={0}>
				<Grid item xs={12} sm={12} md={12}>
					<form 
						id="qreuz-admin-page-pricing-product-category-prices"
						onSubmit={handleSubmit(onSubmit)}
						className={classes.form}
						noValidate
						autoComplete="off"
						>
						<Accordion>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1c-content"
								id="panel1c-header"
								>
								<Grid container spacing={0}>
									<Grid item xs={4} sm={4} md={4} className={classes.column}>
										<Typography variant="h3" className={classes.settingsHeading}>Category pricing</Typography>
									</Grid>
									<Grid item xs={8} sm={8} md={8} className={classes.column}>
										<Typography variant="h4" className={classes.settingsSecondaryHeading}>Price levels per product category</Typography>
									</Grid>
								</Grid>
							</AccordionSummary>
							<AccordionDetails className={classes.details}>
								<Grid container spacing={2}>
									<Grid item xs={8}>
										<LoadCategories />
									</Grid>
									<Grid item xs={4} className={classes.helper}>
									<Typography variant="caption">
										Set your a price level per category. These prices will be used as base prices <u>before</u> any additional premium, budget, or sale price modification.
										<br />
										<a href="https://qreuz.com/documentation">
											Learn more
										</a>
									</Typography>
									</Grid>
								</Grid>
							</AccordionDetails>
							<Divider />
							<AccordionActions>
							<Button size="small" onClick={(e) => {handleSettingsCancel()}}>Cancel</Button>
							<Button size="small" type="submit" color="primary" disabled={loading}>
								Save
								{loading && <CircularProgress size={24} />}
							</Button>
							</AccordionActions>
						</Accordion>
					</form>
				</Grid>
			</Grid>					
			
			<Snackbar open={snackbarOpen} autoHideDuration={18000} onClose={handleSnackbarClose}>
				<Alert onClose={handleSnackbarClose} severity={snackbar.variant} elevation={6} variant="filled" {...props}>
					<AlertTitle>{snackbar.title}</AlertTitle>
					{snackbar.message}
					<Link to={snackbar.link01}>{snackbar.linkText01}</Link>
					<Link to={snackbar.link02}>{snackbar.linkText02}</Link>
				</Alert>
			</Snackbar>
		</React.Fragment>
	)
}
