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

class Qreuz_Integrations {

	/** @var bool plugin environment variable: WooCommerce */
	public $woocommerce;

	/** @var bool plugin environment variable: WooCommerce Product Feeds */
	public $woocommerce_google_product_feeds;

	public function __construct() {

		$this->qreuz_integrations_woocommerce();
		$this->qreuz_integrations_woocommerce_product_feeds();

	}

	/**
	 * Integration for the plugin: WooCommerce
	 * @param void
	 * @return void
	 * @sets: $woocommerce
	 */
	private function qreuz_integrations_woocommerce() {

		if ( in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) {

			$this->woocommerce = true;

			require QREUZ_PLUGINPATH . '/inc/tracker/woocommerce/woocommerce-tracking.php';

			$qreuz_woocommerce_tracking = new Qreuz_WooCommerce_Tracking();

			add_action( 'woocommerce_add_to_cart', array( $qreuz_woocommerce_tracking, 'qreuz_track_woocommerce_atc' ), 10, 3 );

			add_action( 'woocommerce_thankyou', array( $qreuz_woocommerce_tracking, 'qreuz_track_woocommerce_thankyou' ), 10, 1 );

		} else {

			$this->woocommerce = false;

		}

	}

	/**
	 * Integration for the plugin: WooCommerce Product Feeds
	 * @param void
	 * @return void
	 * @sets: $woocommerce_google_product_feeds
	 */
	private function qreuz_integrations_woocommerce_product_feeds() {

		if ( in_array( 'woocommerce-product-feeds/woocommerce-gpf.php.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) {

			$this->woocommerce_google_product_feeds = true;	

		} else {

			$this->woocommerce_google_product_feeds = false;

		}
	}

}
