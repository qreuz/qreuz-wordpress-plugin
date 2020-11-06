const { useState } = wp.element;
import { BrowserRouter as Link } from 'react-router-dom';

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";

/** Material UI imports */
import { makeStyles } from '@material-ui/core/styles';

/**
 * Material UI imports.
 */
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert, AlertTitle } from '@material-ui/lab';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputAdornment from '@material-ui/core/InputAdornment';
import Divider from '@material-ui/core/Divider';

/**
 * Import custom components.
 * */
import { GenericContext, LocalContext } from './../../components/qreuz-state-provider/context';
const CategoryPrices = React.lazy(() => import('./category-prices.js'));

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
	const { wpSettingsPricing, setWpSettingsPricing, setNavigationPosition, qreuzData } = React.useContext(
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

		setWpSettingsPricing({
			...wpSettingsPricing,
			qreuz_smart_pricing_premium_category: (null === data.qreuz_smart_pricing_premium_category ? false : data.qreuz_smart_pricing_premium_category),
			qreuz_smart_pricing_premium_percent: (null === data.qreuz_smart_pricing_premium_percent ? false : data.qreuz_smart_pricing_premium_percent),
			qreuz_smart_pricing_sale_category: (null === data.qreuz_smart_pricing_sale_category ? false : data.qreuz_smart_pricing_sale_category),
			qreuz_smart_pricing_sale_percent: (null === data.qreuz_smart_pricing_sale_percent ? false : data.qreuz_smart_pricing_sale_percent),
			qreuz_smart_pricing_price_scheme: (null === data.qreuz_smart_pricing_price_scheme ? false : data.qreuz_smart_pricing_price_scheme)
		});

		setSuccess(true);
		setLoading(false);
	}

	/**
	 * useEffect on initial load.
	 * */
	React.useEffect(() => {

		setNavigationPosition('pricing');
		document.title = "Shop pricing - Qreuz";

	}, []);

	/**
	 * Build select options
	 */
	const SelectPremiumCategory = () => {

		let productCategoriesOptions = {
			//0: false,
		};

		var productCategories = ( undefined === qreuzData.woocommerce_product_categories ? [] : qreuzData.woocommerce_product_categories );

		let productCategoriesMap = productCategories.map((product_category) => (
			productCategoriesOptions[product_category.term_id] = product_category.name
		));

		var productCategoriesOutput = Object.keys(productCategoriesOptions).map((key) => {
			return(
				<MenuItem value={key}>{productCategoriesOptions[key]}</MenuItem>
				)
		});

		return (
			<React.Fragment>
				<FormControl className={classes.formControl}>
					<InputLabel id='qreuz_smart_pricing_premium_category-label'>Premium category</InputLabel>
					<Controller
							control={control}
							name='qreuz_smart_pricing_premium_category'
							id='qreuz_smart_pricing_premium_category'
							defaultValue={(false === wpSettingsPricing.qreuz_smart_pricing_premium_category ? '' : wpSettingsPricing.qreuz_smart_pricing_premium_category)}
							inputRef={register}
							as={<Select
								labelId="qreuz_smart_pricing_premium_category-label"
								id="qreuz_smart_pricing_premium_category"
								name="qreuz_smart_pricing_premium_category"
								inputProps={{
									name: 'qreuz_smart_pricing_premium_category',
								}}
								error={errors.qreuz_smart_pricing_premium_category}
								>
								{productCategoriesOutput}
							</Select>}/>
					<FormHelperText><span>{errors.qreuz_smart_pricing_premium_category}&nbsp;</span></FormHelperText>
				</FormControl>
			</React.Fragment>
		);
	}
	const SelectSaleCategory = () => {

		let productCategoriesOptions = {
			//0: false,
		};

		var productCategories = ( undefined === qreuzData.woocommerce_product_categories ? [] : qreuzData.woocommerce_product_categories );

		let productCategoriesMap = productCategories.map((product_category) => (
			productCategoriesOptions[product_category.term_id] = product_category.name
		));

		var productCategoriesOutput = Object.keys(productCategoriesOptions).map((key) => {
			return(
				<MenuItem value={key}>{productCategoriesOptions[key]}</MenuItem>
				)
		});

		return (
			<React.Fragment>
				<FormControl className={classes.formControl}>
					<InputLabel id='qreuz_smart_pricing_sale_category-label'>Sale category</InputLabel>
					<Controller
							control={control}
							name='qreuz_smart_pricing_sale_category'
							id='qreuz_smart_pricing_sale_category'
							defaultValue={(false === wpSettingsPricing.qreuz_smart_pricing_sale_category ? '' : wpSettingsPricing.qreuz_smart_pricing_sale_category)}
							inputRef={register}
							as={<Select
								labelId="qreuz_smart_pricing_sale_category-label"
								id="qreuz_smart_pricing_sale_category"
								name="qreuz_smart_pricing_sale_category"
								inputProps={{
									name: 'qreuz_smart_pricing_sale_category',
								}}
								error={errors.qreuz_smart_pricing_sale_category}
								>
								{productCategoriesOutput}
							</Select>}/>
					<FormHelperText><span>{errors.qreuz_smart_pricing_sale_category}&nbsp;</span></FormHelperText>
				</FormControl>
			</React.Fragment>
		);
	}
	const SelectPricingScheme = () => {


		const pricingSchemes = [
			'0.99',
			'0.98',
			'0.95',
			'0.90',
			'0.50',
			'0.00'
		];

		var pricingSchemesOutput = pricingSchemes.map((scheme) => {
			return(
				<MenuItem value={scheme}>{scheme}</MenuItem>
				)
		});

		return (
			<React.Fragment>
				<FormControl className={classes.formControl}>
					<InputLabel id='qreuz_smart_pricing_price_scheme-label'>Pricing scheme</InputLabel>
					<Controller
							control={control}
							name='qreuz_smart_pricing_price_scheme'
							id='qreuz_smart_pricing_price_scheme'
							defaultValue={(false === wpSettingsPricing.qreuz_smart_pricing_price_scheme ? '' : wpSettingsPricing.qreuz_smart_pricing_price_scheme)}
							inputRef={register}
							as={<Select
								labelId="qreuz_smart_pricing_price_scheme-label"
								id="qreuz_smart_pricing_price_scheme"
								name="qreuz_smart_pricing_price_scheme"
								inputProps={{
									name: 'qreuz_smart_pricing_price_scheme',
								}}
								error={errors.qreuz_smart_pricing_price_scheme}
								>
								{pricingSchemesOutput}
							</Select>}/>
					<FormHelperText><span>{errors.qreuz_smart_pricing_price_scheme}&nbsp;</span></FormHelperText>
				</FormControl>
			</React.Fragment>
		);
	}

	return (
		<div
			id={`qreuz-admin-page-pricing`}
			aria-labelledby={`qreuz-plugin-navigation-pricing`}
			>
			<Grid container spacing={0}>
				<Grid item xs={12} sm={12} md={12}>
					<form 
						id="qreuz-admin-page-pricing-settings"
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
										<Typography variant="h3" className={classes.settingsHeading}>Shop pricing</Typography>
									</Grid>
									<Grid item xs={8} sm={8} md={8} className={classes.column}>
										<Typography variant="h4" className={classes.settingsSecondaryHeading}>General settings</Typography>
									</Grid>
								</Grid>
							</AccordionSummary>
							<AccordionDetails className={classes.details}>
								<Grid container spacing={2}>
									<Grid item xs={8}>
										<SelectPremiumCategory />
										<TextField 
											inputRef={register({required:false})}
											name="qreuz_smart_pricing_premium_percent"
											id="qreuz_smart_pricing_premium_percent"
											type="text"
											label="Premium percent"
											error={errors.qreuz_smart_pricing_premium_percent}
											defaultValue={(false === wpSettingsPricing.qreuz_smart_pricing_premium_percent ? '' : wpSettingsPricing.qreuz_smart_pricing_premium_percent)}
											InputProps={{
												endAdornment:<InputAdornment position="end">%</InputAdornment>,
											}}
											disabled={loading}
											helperText={errors.qreuz_smart_pricing_premium_percent ? errors.qreuz_smart_pricing_premium_percent.message : ' '}
											/>
										<SelectSaleCategory />
										<TextField 
											inputRef={register({required:false})}
											name="qreuz_smart_pricing_sale_percent"
											id="qreuz_smart_pricing_sale_percent"
											type="text"
											label="Sale percent"
											error={errors.qreuz_smart_pricing_sale_percent}
											defaultValue={(false === wpSettingsPricing.qreuz_smart_pricing_sale_percent ? '' : wpSettingsPricing.qreuz_smart_pricing_sale_percent)}
											disabled={loading}
											InputProps={{
												endAdornment:<InputAdornment position="end">%</InputAdornment>,
											}}
											helperText={errors.qreuz_smart_pricing_sale_percent ? errors.qreuz_smart_pricing_sale_percent.message : ' '}
											/>
										<SelectPricingScheme />
									</Grid>
									<Grid item xs={4} className={classes.helper}>
									<Typography variant="caption">
										Set your premium and sale category to apply an automatic percentage based <u>increase</u> or <u>decrease</u> of product prices in that category.
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
				<Grid item xs={12} sm={12} md={12}>
					<CategoryPrices />
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


			
		</div>
	)
}
