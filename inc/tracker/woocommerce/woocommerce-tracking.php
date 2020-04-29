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

class Qreuz_WooCommerce_Tracking {

	public $product_data;
	public $transaction_data;

	public function __construct() {
		/** */
		$this->product_data        = array();
		$this->transaction_data    = array();
	}

	public function qreuz_track_woocommerce_atc( $cart_item_key, $product_id, $quantity ) {
		/**
		 * ### TRACK EVENT: WOOCOMMERCE ADD TO CART
		 * ________
		 * get product data from WooCommerce
		 */
		$product = wc_get_product( $product_id );

		$product_name  = $product->get_name();
		$product_sku   = $product->get_sku();
		$product_price = $product->get_price();

		/**
		 * add product data to array for ecommerce tracking
		 */
		$this->product_data['qepr1id'] = $product_sku;
		$this->product_data['qepr1nm'] = $product_name;
		$this->product_data['qepr1pr'] = $product_price;

		/**
		 * call qreuz_track_event()
		 */
		$qreuz_tracker_events = new Qreuz_Tracker_Events();

		$qreuz_tracker_events->qreuz_track_event( 'atc', '', '', $this->product_data );
	}

	public function qreuz_track_woocommerce_thankyou( $order_id ) {
		/**
		 * ### TRACK EVENT: WOOCOMMERCE THANKYOU (PURCHASE)
		 */

		/** verify if order_id exists and get WooCommerce data */
		if ( ! $order_id ) {
			return;
		}

		/** check if thankyou event has already been tracked */
		if ( ! get_post_meta( $order_id, '_qreuz_track_woocommerce_thankyou_done', true ) ) {

			$order = new WC_Order( $order_id );

			$order_number         = $order->get_order_number();
			$order_total          = $order->get_total();
			$order_total_tax      = $order->get_total_tax();
			$order_shipping_total = $order->get_shipping_total();

			/** add transaction data to array for ecommerce tracking */
			$this->transaction_data['qtno'] = $order_number;
			$this->transaction_data['qa']   = get_bloginfo( 'name' );
			$this->transaction_data['qtv']  = $order_total;
			$this->transaction_data['qtx']  = $order_total_tax;
			$this->transaction_data['qts']  = $order_shipping_total;

			/** add line item data to array for ecommerce tracking */
			$order_line_items = $order->get_items();

			$i = 1;
			foreach ( $order_line_items as $item ) {

				$product = $order->get_product_from_item( $item );

				$this->transaction_data[ 'qtpr' . $i . 'id' ] = $product->get_sku();
				$this->transaction_data[ 'qtpr' . $i . 'nm' ] = $product->get_name();
				$this->transaction_data[ 'qtpr' . $i . 'pr' ] = $product->get_price();
				$this->transaction_data[ 'qtpr' . $i . 'qt' ] = $item['qty'];
				$i++;
			}

			$this->transaction_data['qtprc'] = $i-1;

			/** add product data to event action / label / value */
			// $event_label = $order_number;

			/** call qreuz_track_event() */
			$qreuz_tracker_events = new Qreuz_Tracker_Events();
			$qreuz_tracker_events->qreuz_track_transaction( $this->transaction_data );

			/** set order meta to protocol sending of tracking event */
			$order->update_meta_data( '_qreuz_track_woocommerce_thankyou_done', true );
			$order->save();
		}
	}
}
