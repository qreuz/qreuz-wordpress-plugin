import * as yup from "yup";

/** Material UI imports */
import { makeStyles } from '@material-ui/core/styles';

/**
 * Material UI imports.
 */
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

/**
 * Import custom components.
 * */
const CategoryPrices = React.lazy(() => import('./category-prices.js'));
const ShopPricing = React.lazy(() => import('./shop-pricing.js'));

/**
 * Define local styles.
 */
const useStyles = makeStyles((theme) => ({

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
	 * Load resources
	 */
		/** Load styles */
		const classes = useStyles();


	/**
	 * useEffect on initial load.
	 * */
	React.useEffect(() => {
		document.title = "Pricing settings - Qreuz";
	},[]);

	return (
		<div
			id={`qreuz-admin-page-pricing`}
			aria-labelledby={`qreuz-plugin-navigation-pricing`}
			>
			<Grid container spacing={0}>
				<Grid item xs={12} sm={12} md={12}>
					<Typography variant="h2" gutterBottom>
						Pricing (WooCommerce)
					</Typography>
					<Typography variant="body1" gutterBottom>
						On this page, you can configure your pricing across your WooCommerce store.
					</Typography>
				</Grid>
				<Grid item xs={12} sm={12} md={12}>
					<ShopPricing />
				</Grid>
				<Grid item xs={12} sm={12} md={12}>
					<CategoryPrices />
				</Grid>
			</Grid>					
		</div>
	)
}
