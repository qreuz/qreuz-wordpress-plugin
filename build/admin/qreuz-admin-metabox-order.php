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
 * Qreuz_Admin_Metabox_Order
 */
class Qreuz_Admin_Metabox_Order {

	/**
	 * build the metabox on the order view
	 * @param string $order
	 * @return void
	 */
	public function qreuz_admin_metabox_order_constructor( $order ) {

		if ( ! current_user_can( 'manage_options' ) ) {

			return;
			
		} else {

			echo '<div class="qreuz">';

			$customer_email = $order->get_billing_email();

			if ( isset( $customer_email ) && '' !== $customer_email ) {
				$customer_orders = $this->get_order_by_email( $customer_email );
			} else {
				$customer_orders = null;
			}

			

			/**
			 * get customer order count
			 */
			$customer_order_count = count( $customer_orders );

			/**
			 * get customer total revenue and count completed orders
			 */
			$customer_total_revenue = 0;
			$customer_order_count_completed = 0;

			foreach ( $customer_orders as $customer_order ) {
				if ( 'wc-completed' === $customer_order->post_status ) {

					$new_order = wc_get_order( $customer_order->ID );

					$customer_total_revenue += $new_order->get_total();

					$customer_order_count_completed++;

				}
			}

			/**
			 * Section: customer insights
			 */
			echo '<h4>Customer insights';
			//Qreuz_Admin::load_helptip( 'Customer insights data is based on all orders in your store made with the same email address.', 'thin' );
			echo '</h4>';
			echo '<p class="qreuz_admin_metabox_customerinsights">';

			echo '<span>';
			echo 'Customer: <b>' . sanitize_email( $customer_email ) . '</b>';
			echo '</span>';

			echo '<span>';
			echo 'Orders placed: ' . esc_html( $customer_order_count );
			// Qreuz_Admin::load_helptip( 'Only counting WooCommerce orders with status "completed".', 'thin' );
			echo '</span>';

			echo '<span>';
			echo 'Orders completed: ' . esc_html( $customer_order_count_completed );
			// Qreuz_Admin::load_helptip( 'Only counting WooCommerce orders with status "completed".', 'thin' );
			echo '</span>';

			if ( 0 < $customer_total_revenue ) {
				echo '<span>';
				$customer_total_revenue = number_format( (float) $customer_total_revenue, 2, wc_get_price_decimal_separator(), '' );
				echo 'Total revenue: ' . esc_html( $customer_total_revenue ) . esc_attr( get_woocommerce_currency_symbol() );
				// Qreuz_Admin::load_helptip( 'Only counting WooCommerce orders with status "completed".', 'thin' );
				echo '</span>';
			}

			echo '</p>'; // closing qreuz_admin_metabox_customerinsights
			echo '</div>'; // closing the .qreuz element
		}
	}

	/**
	 * get orders of same email address
	 * @param string $customer_email
	 * @return array 
	 */
	private function get_order_by_email( $customer_email ) {

		$customer_orders = get_posts(
			array(
				'numberposts' => -1,
				'meta_key'    => '_billing_email',
				'meta_value'  => $customer_email,
				'post_type'   => wc_get_order_types(),
				'post_status' => array_keys( wc_get_order_statuses() ),
			)
		);

		// $customer_orders_count = count( $customer_orders );

		return $customer_orders;
	}
}
