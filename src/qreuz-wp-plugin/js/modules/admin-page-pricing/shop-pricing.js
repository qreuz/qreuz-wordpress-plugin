import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

/** Material UI imports */
import { makeStyles } from '@material-ui/core/styles';

/**
 * Material UI imports.
 */

import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';

/**
 * Import custom components.
 * */
import { LocalContext } from './../../components/qreuz-state-provider/context';
import QSettingsAccordion from '../../components/qreuz-settings-components/q-settings-accordion';
import SelectAutosave from '../../components/react-hook-form-components/select-autosave';
import TextFieldAutosave from '../../components/react-hook-form-components/text-field-autosave';

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
 * Component for: Pricing / ShopPricing
 */
export default function ShopPricing(props) {

	/**
	 * Load resources
	 */
		/** Load styles */
		const classes = useStyles();

		/** react-hook-form */
		const {control, errors} = useForm({
			resolver: yupResolver(validationSchema)
		});

		/** Load context */
		const { localStore } = React.useContext(
			LocalContext
		);
		
		/** Load state */
		const [defaultValue,setDefaultValue] = React.useState({
			qreuz_smart_pricing_premium_category: (false === localStore.pricing.qreuz_smart_pricing_premium_category ? '' : localStore.pricing.qreuz_smart_pricing_premium_category ),
			qreuz_smart_pricing_premium_percent: (false === localStore.pricing.qreuz_smart_pricing_premium_percent ? '' : localStore.pricing.qreuz_smart_pricing_premium_percent),
			qreuz_smart_pricing_sale_category: (false === localStore.pricing.qreuz_smart_pricing_sale_category ? '' : localStore.pricing.qreuz_smart_pricing_sale_category ),
			qreuz_smart_pricing_sale_percent: (false === localStore.pricing.qreuz_smart_pricing_sale_percent ? '' : localStore.pricing.qreuz_smart_pricing_sale_percent),
			qreuz_smart_pricing_price_scheme: (false === localStore.pricing.qreuz_smart_pricing_price_scheme ? '' : localStore.pricing.qreuz_smart_pricing_price_scheme ),
		});
		const [qreuzData, setQreuzData] = React.useState({
			woocommerce_product_categories: localStore.qreuz_data.woocommerce_product_categories,
		});

	/**
	 * Build select options
	 */
		/** Options for SELECT: premium category */
		const selectOptionsPremiumCategoryObj = () => {
			let productCategoriesOptions = {
				//0: false,
			};
			let productCategories = ( undefined === qreuzData.woocommerce_product_categories ? [] : qreuzData.woocommerce_product_categories );
			let productCategoriesMap = Object.keys(productCategories).map((product_category) => (
				productCategoriesOptions[productCategories[product_category].term_id] = productCategories[product_category].name
			));
			return productCategoriesOptions;
		}
		let selectOptionsPremiumCategory = Object.keys(selectOptionsPremiumCategoryObj()).map((key) => {
			return(
				<MenuItem value={key} key={key} role="option">{selectOptionsPremiumCategoryObj()[key]}</MenuItem>
				)
		});

		/** Options for SELECT: sale category */
		const selectOptionsSaleCategoryObj = () => {
			let productCategoriesOptions = {
				//0: false,
			};
			let productCategories = ( undefined === qreuzData.woocommerce_product_categories ? [] : qreuzData.woocommerce_product_categories );
			let productCategoriesMap = Object.keys(productCategories).map((product_category) => (
				productCategoriesOptions[productCategories[product_category].term_id] = productCategories[product_category].name
			));
			return productCategoriesOptions;
		}
		let selectOptionsSaleCategory = Object.keys(selectOptionsSaleCategoryObj()).map((key) => {
			return(
				<MenuItem value={key} key={key} role="option">{selectOptionsSaleCategoryObj()[key]}</MenuItem>
				)
		});
	
		/** Options for SELECT: pricing scheme */
		const pricingSchemes = [
			'0.99',
			'0.98',
			'0.95',
			'0.90',
			'0.50',
			'0.00',
			'Disable price scheme',
		];
		let selectOptionsPricingScheme = pricingSchemes.map((scheme) => {
			return(
				<MenuItem key={scheme} value={scheme} role="option">{scheme}</MenuItem>
				)
		});
	
	/**
	 * Return for ShopPricing
	 */
	return (
		<React.Fragment>
			<Grid container spacing={0}>
				<Grid item xs={12} sm={12} md={12}>
					<QSettingsAccordion
						name="shopPricing"
						title="Shop pricing"
						subtitle="General settings"
						helpText="Set your a price level per category. These prices will be used as base prices before any additional premium, budget, or sale price modification."
						learnMoreLink="https://qreuz.com/documentation"
						>

						{/** SELECT for premium category */}
						<SelectAutosave
							name="qreuz_smart_pricing_premium_category"
							label="Premium category"
							control={control}
							defaultValue={defaultValue.qreuz_smart_pricing_premium_category}
							localStoreData={{section:'pricing', data:'qreuz_smart_pricing_premium_category'}}
							>
							{selectOptionsPremiumCategory}
						</SelectAutosave>
			
						{/** TEXTFIELD for premium percentage */}
						<TextFieldAutosave
							name={"Premium percent"}
							id={"qreuz_smart_pricing_premium_percent"}
							error={errors.qreuz_smart_pricing_premium_percent}
							defaultValue={defaultValue.qreuz_smart_pricing_premium_percent}
							endAdornment={'%'}
							required={false}
							helperText={errors.qreuz_smart_pricing_premium_percent ? errors.qreuz_smart_pricing_premium_percent.message : ' '}
							localStoreData={{section:'pricing', data:'qreuz_smart_pricing_premium_percent'}}
							/>
						
						{/** SELECT for sale category */}
						<SelectAutosave
							name="qreuz_smart_pricing_sale_category"
							label="Sale category"
							control={control}
							defaultValue={defaultValue.qreuz_smart_pricing_sale_category}
							localStoreData={{section:'pricing', data:'qreuz_smart_pricing_sale_category'}}
							>
							{selectOptionsSaleCategory}
						</SelectAutosave>

						{/** TEXTFIELD for sale percentage */}
						<TextFieldAutosave
							name={"Sale percent"}
							id={"qreuz_smart_pricing_sale_percent"}
							error={errors.qreuz_smart_pricing_sale_percent}
							defaultValue={defaultValue.qreuz_smart_pricing_sale_percent}
							endAdornment={'%'}
							required={false}
							helperText={errors.qreuz_smart_pricing_sale_percent ? errors.qreuz_smart_pricing_sale_percent.message : ' '}
							localStoreData={{section:'pricing', data:'qreuz_smart_pricing_sale_percent'}}
							/>

						{/** SELECT for price scheme */}
						<SelectAutosave
							name="qreuz_smart_pricing_price_scheme"
							label="Store price scheme"
							control={control}
							defaultValue={defaultValue.qreuz_smart_pricing_price_scheme}
							localStoreData={{section:'pricing', data:'qreuz_smart_pricing_price_scheme'}}
							>
							{selectOptionsPricingScheme}
						</SelectAutosave>
					</QSettingsAccordion>
				</Grid>
			</Grid>					
		</React.Fragment>
	)
}
