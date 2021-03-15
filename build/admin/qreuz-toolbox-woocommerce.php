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
 * Qreuz_Toolbox_Woocommerce
 * 
 * Set of helper tools for WooCommerce.
 */
class Qreuz_Toolbox_Woocommerce {

	/**
	 * [BETA] Sync all existing orders with all existing user accounts.
	 * 
	 * Synchronization is based on the email address (billing email address and user account email address).
	 * 
	 * @param none
	 * @return string JSON 
	 */
	public static function sync_customer_orders() {

		if ( ! current_user_can( 'manage_options' ) ) {

			$response = array(
				'success' => false,
				'msg'     => 'Error',
			);

			return $response;
		} else {

			$customers = get_users(
				array(
					'role__in' => array( 'customer' ),
					'fields'   => array( 'ID', 'user_email' ),
				),
			);

			foreach ( $customers as $customer ) {
				wc_update_new_customer_past_orders( $customer->ID );
			}
		}

		/**
		 * TODO:
		 * Implement proper feedback mechanism.
		 */
		$response = array(
			'success' => true,
			'msg'     => 'Orders updated.',
		);

		return $response;
	}
}
