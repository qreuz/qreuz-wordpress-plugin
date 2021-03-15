import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

/** Material UI imports */
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

/**
 * Import custom components.
 * */
import { LocalContext } from './../../components/qreuz-state-provider/context';
import { QSettingsAccordion } from '../../components/qreuz-settings-components';
import { TextFieldAutosave } from './../../components/react-hook-form-components';

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
const validationSchema = yup.object().shape({
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
 * Component for: Pricing / Category Prices
 */
export default function CategoryPrices(props) {

	/**
	 * Load resources
	 */
		/** Load styles */
		const classes = useStyles();

	/**
	 * Map categories.
	 */
	const LoadCategories = () => {

		/** Load context */
		const { localStore } = React.useContext(
			LocalContext
		);	

		const [qreuzData, setQreuzData] = React.useState({
			woocommerce_product_categories: localStore.qreuz_data.woocommerce_product_categories,
			woocommerce: {
				woocommerce_currency: localStore.woocommerce.woocommerce_currency,
			},
		});

		/** react-hook-form */
		const {errors} = useForm({
			resolver: yupResolver(validationSchema)
		});

		var productCategories = ( undefined === qreuzData.woocommerce_product_categories ? [] : qreuzData.woocommerce_product_categories );

		var productCategoriesMap = Object.keys(productCategories).map((product_category, index) => {
			return(
				<TextFieldAutosave
					name={productCategories[product_category].name}
					id={"qreuz_smart_price_cat_" + productCategories[product_category].term_id}
					error={errors["qreuz_smart_price_cat_" + productCategories[product_category].term_id]}
					defaultValue={(false === productCategories[product_category].price ? '' : productCategories[product_category].price)}
					endAdornment={qreuzData.woocommerce.woocommerce_currency}
					required={false}
					helperText={errors["qreuz_smart_price_cat_" + productCategories[product_category].term_id] ? errors["qreuz_smart_price_cat_" + productCategories[product_category].term_id].message : ' '}
					localStoreData={{section:'qreuz_data.woocommerce_product_categories.' + productCategories[product_category].term_id, data:'price'}}
					/>
			)
		});

		return productCategoriesMap;
	}

	/**
	 * Return for CategoryPrices
	 */
	return (
		<React.Fragment>
			<Grid container spacing={0}>
				<Grid item xs={12} sm={12} md={12}>
					<QSettingsAccordion
						name="categoryPrices"
						title="Category prices"
						subtitle="Price levels per product category"
						helpText={"Set your a price level per category. These prices will be used as base prices before any additional premium, budget, or sale price modification."}
						learnMoreLink="https://qreuz.com/documentation"
						>
						<LoadCategories />
					</QSettingsAccordion>
				</Grid>
			</Grid>					
		</React.Fragment>
	)
}
