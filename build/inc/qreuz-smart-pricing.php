<?php
/** Qreuz plugin for WordPress.

Copyright (C) 2020 by Qreuz GmbH <https://qreuz.com/legal-notice>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
**/

/** Exit if accessed directly */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * QREUZ SMART PRICING CLASS
 */
class Qreuz_Smart_Pricing {

	private $smart_price_categories;
	private $forbidden_categories;
	private $sale_category;
	private $premium_category;
	private $sale_percent;
	private $premium_percent;
	private $price_scheme;

	private $current_site_url;

	public function __construct() {

		$this->current_site_url = get_site_url();

		/** niu */
		$this->forbidden_categories = array();
		$this->forbidden_categories[0] = '';

		$this->sale_category    = (int) get_option( 'qreuz_smart_pricing_sale_category' );
		$this->sale_percent     = (int) get_option( 'qreuz_smart_pricing_sale_percent' );
		$this->premium_category = (int) get_option( 'qreuz_smart_pricing_premium_category' );
		$this->premium_percent  = (int) get_option( 'qreuz_smart_pricing_premium_percent' );
		$this->price_scheme     = (float) get_option( 'qreuz_smart_pricing_price_scheme' );
	}

	/**
	 * Updates prices in database.
	 * 
	 * @param $prices
	 * @return void
	 */
	public function update_prices_in_db( $product_categories ) {
		if ( ! current_user_can( 'manage_options' ) ) {
			/**
			 *  User not allowed to access.
			 */
			$response = json_encode( array(
				'response' => [
					'error' => 'error',
				],
			) );

			wp_die( $response );
		} else {
			/**
			 * User ok. Proceed.
			 */
			$price_array = array();


			foreach ( $product_categories as $product_category => $array ) {
					
				$value = sanitize_text_field( $array['price'] );

				$price_array[ $array['term_id'] ] = '' !== $value ? $value : null;
			}
			
			/** store updated prices to database */
			Qreuz_Database::insert_data_2col( 'smart_pricing_prices', $price_array, 'cat_id', 'price' );
		}
	}

	/**
	 * initializes the update prices logic
	 * @param void
	 * @return void
	 */
	public function qreuz_update_prices_init() {

		if ( ! check_ajax_referer( 'qreuz-sync-prices' ) || ! current_user_can( 'manage_options' ) ) {

			/**
			 *  No valid ajax request or user not allowed to access.
			 */
			$response = json_encode( array(
				'response' => [
					'error' => 'error',
				],
			) );
			wp_die( $response );
			
		} else {

			/**
			 * Get array of simple product IDs and loop over them
			 * DOC: https://github.com/woocommerce/woocommerce/wiki/wc_get_products-and-WC_Product_Query
			 */
			$simple_products_query = new WC_Product_query(
				array(
					'limit'   => -1,
					'status'  => 'publish',
					'type'    => 'simple',
					'return'  => 'ids',
					'exclude' => '',
					'orderby' => 'ID',
					'order'   => 'ASC',
				)
			);
			$simple_products_array = $simple_products_query->get_products();

			foreach ( $simple_products_array as $simple_product_id ) {

				if ( $this->is_category_allowed( $simple_product_id ) ) {

					$this->do_update_prices( $simple_product_id, 'simple' );

				}
			}

			/**
			 * Get array of variable product IDs and loop over them
			 * DOC: https://github.com/woocommerce/woocommerce/wiki/wc_get_products-and-WC_Product_Query
			 */
			$variable_products_query = new WC_Product_query(
				array(
					'limit'   => -1,
					'status'  => 'publish',
					'type'    => 'variable',
					'return'  => 'ids',
					'exclude' => '',
					'orderby' => 'ID',
					'order'   => 'ASC',
				)
			);
			$variable_products_array = $variable_products_query->get_products();

			foreach ( $variable_products_array as $variable_product_id ) {

				if ( $this->is_category_allowed( $variable_product_id ) ) {

					/** get variation IDs */
					$variations = get_posts(
						array(
							'post_parent'    => $variable_product_id,
							'posts_per_page' => -1,
							'post_type'      => 'product_variation',
							'fields'         => 'ids',
							'post_status'    => array( 'publish', 'private' ),
						)
					);

					$this->do_update_prices( $variations, 'variable', $variable_product_id );
					echo 'qreuz-price-update-successful';
				}
			}

			wp_die();
		}
	}

	/**
	 * actually updates prices
	 * @param string $product_id
	 * @param string $product_type
	 * @param string $parent_product_id
	 * @return void
	 */
	private function do_update_prices( $product_id, $product_type, $parent_product_id = null ) {		

		if ( 'variable' === $product_type && is_array( $product_id ) ) {
			foreach ( $product_id as $variation_id ) {
				$price = $this->get_product_price( $variation_id, $product_type, $parent_product_id );

				if ( $price ) {
					$variation = wc_get_product( $variation_id );

					$variation->{ 'set_price' }( wc_clean( $price['price'] ) );
					$variation->{ 'set_regular_price' }( wc_clean( $price['regular_price'] ) );
					$variation->{ 'set_sale_price' }( wc_clean( $price['sale_price'] ) );

					$variation->save();
				}
			}
		} elseif ( 'simple' === $product_type ) {
			$price = $this->get_product_price( $product_id, $product_type );

			if ( $price ) {
				$qreuz_product = wc_get_product( $product_id );

				$qreuz_product->{ 'set_price' }( wc_clean( $price['price'] ) );
				$qreuz_product->{ 'set_regular_price' }( wc_clean( $price['regular_price'] ) );
				$qreuz_product->{ 'set_sale_price' }( wc_clean( $price['sale_price'] ) );

				$qreuz_product->save();
			}
		}
	}

	/**
	 * retrieves the price for a product
	 * @param string $product_id
	 * @param string $product_type
	 * @param string $parent_product_id
	 * @return string
	 */
	private function get_product_price( $product_id, $product_type, $parent_product_id = null ) {

		if ( 'simple' === $product_type ) {
			$product_id_cats = wp_get_post_terms( $product_id, 'product_cat' );
		} elseif ( 'variable' === $product_type ) {
			$product_id_cats = wp_get_post_terms( $parent_product_id, 'product_cat' );
		}

		$this->get_smart_price_categories();

		$categories_with_prices = array_keys( $this->smart_price_categories );

		$price = array();

		/** loop over categories of product and set regular price */
		foreach ( $product_id_cats as $product_id_cats_obj ) {

			if ( in_array( $product_id_cats_obj->term_id, $categories_with_prices, true ) ) {
				/**
				 * set regular price if does not exist already
				 * if already set, take higher of two values
				 */
				if ( ! isset( $regular_price ) ) {
					$regular_price = $this->smart_price_categories[ $product_id_cats_obj->term_id ];
				} else {
					$regular_price = max( $regular_price, $this->smart_price_categories[ $product_id_cats_obj->term_id ] );
				}
			}
		}

		/** loop over categories and check if premium category is present */
		foreach ( $product_id_cats as $product_id_cats_obj ) {
			if ( $this->premium_category === $product_id_cats_obj->term_id && isset( $regular_price ) ) {

				$premium_amount = $regular_price / 100 * $this->premium_percent;
				$premium_price  = $regular_price + $premium_amount;

				$regular_price = $premium_price;
			}
		}

		/**
		 * round price to match price scheme
		 * */
		if ( isset( $this->price_scheme ) && isset( $regular_price ) ) {
			$regular_price = round( $regular_price ) + $this->price_scheme;
		}

		if ( isset( $regular_price ) ) {
			$price['regular_price'] = $regular_price;
		}

		/** loop over categories and check if sale category is present */
		foreach ( $product_id_cats as $product_id_cats_obj ) {
			if ( $this->sale_category === $product_id_cats_obj->term_id && isset( $regular_price ) ) {

				$sale_amount = $regular_price / 100 * $this->sale_percent;
				$sale_price  = $regular_price - $sale_amount;

				/**
				 * round sale price to match price scheme
				 */
				if ( isset( $this->price_scheme ) ) {
					$sale_price = round( $sale_price ) + $this->price_scheme;
				}

				$price['sale_price'] = $sale_price;
			}
		}

		if ( null === $price['regular_price'] ) {
			$product = wc_get_product( $product_id );
			$price['regular_price'] = $product->get_regular_price();
		}
		/**
		 * set price (actual price) based on the presence of a sale price
		 */
		if ( null !== $price['sale_price'] ) {
			$price['price'] = $price['sale_price'];
		} else {
			$price['price'] = $price['regular_price'];
		}
		
		return $price;
	}

	/**
	 * gets the categories that have prices set
	 * @param void
	 * @return void
	 */
	private function get_smart_price_categories() {

		$price_obj = Qreuz_Database::get_results( 'smart_pricing_prices', 'OBJECT', 'price', 'isnot', '0.00' );

		$this->smart_price_categories = array();

		foreach ( $price_obj as $cat ) {
			$this->smart_price_categories[ $cat->cat_id ] = $cat->price;
		}
	}

	/**
	 * checks if the current category gets a smart price or not
	 * @param string $product_id
	 * @return bool
	 */
	private function is_category_allowed( $product_id ) {
		/**
		 * check if product has category from allowed array
		 */

		if ( ! has_term( $this->forbidden_categories, 'product_cat', $product_id ) ) {
			return true;
		} else {
			return false;
		}
	}
}
