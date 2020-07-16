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

/** loading admin plugin files */
require QREUZ_PLUGINPATH . '/admin/activate-function.php';

require QREUZ_PLUGINPATH . '/admin/qreuz-authentification.php';
require QREUZ_PLUGINPATH . '/admin/qreuz-admin-smart-tracking.php';
require QREUZ_PLUGINPATH . '/admin/qreuz-admin-tabs.php';
require QREUZ_PLUGINPATH . '/admin/qreuz-admin-dashboard-widget.php';

/** adding actions */
add_action( 'admin_enqueue_scripts', array( 'Qreuz_Admin', 'qreuz_admin_load_css' ), 10 );
add_action( 'admin_enqueue_scripts', array( 'Qreuz_Admin', 'qreuz_admin_load_js' ), 10 );
add_action( 'admin_menu', array( 'Qreuz_Admin', 'add_menu_page' ), 10 );
add_action( 'add_meta_boxes', array( 'Qreuz_Admin', 'qreuz_metabox_wc_order' ), 10 );
// add_action( 'add_meta_boxes', array( 'Qreuz_Admin', 'qreuz_metabox_wc_product' ), 10 );
add_action( 'admin_enqueue_scripts', array( 'Qreuz_Admin', 'register_qreuz_settings' ), 10 );
add_action( 'admin_enqueue_scripts', array( 'Qreuz_Admin', 'qreuz_db_update_check' ), 10 );
/**
 * QREUZ ADMIN CLASS
 */
class Qreuz_Admin {

	/**
	 * check if the database version is current
	 * @param void
	 * @return void
	 */
	public static function qreuz_db_update_check() {

		if ( ! current_user_can( 'manage_options' ) ) {

			return;
			
		} else {

			require QREUZ_PLUGINPATH . '/admin/qreuz-update-check.php';
			
		}
	}
	
	/**
	 * load css for admin / backend view
	 * @param void
	 * @return void
	 */
	public static function qreuz_admin_load_css() {

		/**
		 * load Qreuz admin CSS
		 * include file version
		 */

		if ( ! current_user_can( 'manage_options' ) ) {

			return;

		} else {

			$css_url  = QREUZ_PLUGINURL . 'assets/css/qreuz-admin.css';

			wp_enqueue_style(
				'qreuz_admin_css',
				$css_url,
				'',
				QREUZ_PLUGINVERSION
			);
		}

	}

	/**
	 * load js for admin / backend view
	 * @param void
	 * @return void
	 */
	public static function qreuz_admin_load_js() {
		/**
		 * load Qreuz admin JS
		 * include file version
		 */

		if ( ! current_user_can( 'manage_options' ) ) {

			return;
			
		} else {

			$js_url  = QREUZ_PLUGINURL . 'assets/js/qreuz-admin.js';

			wp_enqueue_script(
				'qreuz_admin_js',
				$js_url,
				[
					'jquery',
					'jquery-ui-tooltip',
				],
				QREUZ_PLUGINVERSION,
				true
			);

		}
	}

	/**
	 * register plugin menu page
	 * @param void
	 * @return void
	 * */
	public static function add_menu_page() {

		if ( ! current_user_can( 'manage_options' ) ) {

			return;
			
		} else {

			$qreuz_admin_tabs = new Qreuz_Admin_Tabs();

			$loggedin_in_title = ( '1' === get_option( 'qreuz_userdata_authentification' ) ? 'Account' : 'Login' );

			/** load main menu content */
			$menu_page = add_menu_page(
				__( 'Qreuz', 'qreuz' ),
				'Qreuz',
				'manage_options',
				'qreuz',
				array( $qreuz_admin_tabs, 'qreuz_wp_admin_pages' ),
				plugins_url( 'qreuz/assets/img/qreuz-white.svg' ),
				null
			);
			add_action( "load-$menu_page", array( $qreuz_admin_tabs, 'admin_notice_construct' ) );

			$submenu_page[1] = add_submenu_page(
				'qreuz',
				$loggedin_in_title,
				$loggedin_in_title,
				'manage_options',
				'qreuz',
				array( $qreuz_admin_tabs, 'qreuz_wp_admin_pages' ),
				1
			);
			add_action( "load-$submenu_page[1]", array( $qreuz_admin_tabs, 'admin_notice_construct' ) );

			$submenu_page[2] = add_submenu_page(
				'qreuz',
				__( 'Qreuz Smart Tracking', 'qreuz' ),
				'Tracking',
				'manage_options',
				'qreuz_menu_smart_tracking',
				array( $qreuz_admin_tabs, 'qreuz_wp_admin_pages' ),
				2
			);
			add_action( "load-$submenu_page[2]", array( $qreuz_admin_tabs, 'admin_notice_construct' ) );

			$submenu_page[3] = add_submenu_page(
				'qreuz',
				__( 'Smart Pricing', 'qreuz' ),
				'Smart pricing',
				'manage_options',
				'qreuz_menu_smart_pricing',
				array( $qreuz_admin_tabs, 'qreuz_wp_admin_pages' ),
				3
			);
			add_action( "load-$submenu_page[3]", array( $qreuz_admin_tabs, 'admin_notice_construct' ) );

		}
	}

	/**
	 *  Load Qreuz meta box on WooCommerce order pages
	 * @param void
	 * @return void
	 * */
	public static function qreuz_metabox_wc_order() {

		if ( ! current_user_can( 'manage_options' ) ) {

			return;
			
		} else {

			add_meta_box(
				'qreuz_meta_box',
				'Qreuz',
				array( 'Qreuz_Admin', 'qreuz_metabox_wc_order_callback' ),
				'shop_order',
				'side',
				'core'
			);
		}
	}

	/**
	 * Qreuz meta box callback for: WooCommerce orders
	 * @param string $post
	 * @return void
	 * */
	public static function qreuz_metabox_wc_order_callback( $post ) {

		require QREUZ_PLUGINPATH . '/admin/qreuz-admin-metabox-order.php';

		global $post;
		$order = new WC_Order( $post->ID );

		$metabox_order = new Qreuz_Admin_Metabox_Order();

		$metabox_order->qreuz_admin_metabox_order_constructor( $order );

	}

	/**
	 * Qreuz meta box on WooCommerce product pages
	 * @param void
	 * @return void
	 * */
	public static function qreuz_metabox_wc_product() {
		add_meta_box(
			'qreuz_meta_box_product',
			'Qreuz',
			array( 'Qreuz_Admin', 'qreuz_metabox_wc_product_callback' ),
			'product',
			'side',
			'core'
		);
	}

	/**
	 * Qreuz meta box callback for: WooCommerce products
	 * @param string $post
	 * @return void
	 * */
	public static function qreuz_metabox_wc_product_callback( $post ) {

		echo "placeholder";
	}

	/**
	 * register all Qreuz settings
	 * @param void
	 * @return void
	 */
	public static function register_qreuz_settings() {

		if ( ! current_user_can( 'manage_options' ) ) {

			return;
			
		} else {
			/** settings for smart pricing */
			register_setting( 'qreuz_smart_pricing', 'qreuz_smart_pricing_premium_category' );
			register_setting( 'qreuz_smart_pricing', 'qreuz_smart_pricing_premium_percent' );
			register_setting( 'qreuz_smart_pricing', 'qreuz_smart_pricing_sale_category' );
			register_setting( 'qreuz_smart_pricing', 'qreuz_smart_pricing_sale_percent' );
			register_setting( 'qreuz_smart_pricing', 'qreuz_smart_pricing_price_scheme' );
			/** settings for tracking */
			register_setting( 'qreuz_smart_tracking', 'qreuz_smart_tracking_active' );
			register_setting( 'qreuz_smart_tracking', 'qreuz_smart_tracking_low_performance' );
			/** settings for tracking integrations */
			register_setting( 'qreuz_tracking_integrations', 'qreuz_ti_ga_property_id' );
			register_setting( 'qreuz_tracking_integrations', 'qreuz_ti_fb_pixel_id' );
			register_setting( 'qreuz_tracking_integrations', 'qreuz_ti_bing_uet_id' );
			register_setting( 'qreuz_tracking_integrations', 'qreuz_ti_gmerch_id' );
			/** settings for userdata */
			register_setting( 'qreuz_userdata', 'qreuz_userdata_toqen' );
			register_setting( 'qreuz_userdata', 'qreuz_userdata_qkey' );
			register_setting( 'qreuz_userdata', 'qreuz_userdata_email' );
			register_setting( 'qreuz_userdata', 'qreuz_userdata_authentification' );
		}
	}

	/**
	 * Offers a method to add tooltips in the backend
	 * @param string $text
	 * @param string $alt - define the version of the helptip
	 * @param string $html - defines if the output shall be echoed or returned
	 * @return string
	 */
	public static function load_helptip( $text, $alt = null, $html = null ) {
		if ( $text && null === $html ) {
			echo '<span class="qreuz_admin_helptip" title="' . esc_attr( $text ) . '">';

			if ( 'thin' === $alt ) {
				echo ' [ <b>?</b> ] ';
			} else {
				echo '<span class="dashicons dashicons-editor-help"></span>';
			}
			echo '</span>';

			return;
			
		} elseif ( $text && 'html' === $html ) {
			$helptip_output = '<span class="qreuz_admin_helptip" title="' . esc_attr( $text ) . '">';

			if ( 'thin' === $alt ) {
				$helptip_output .= ' [ <b>?</b> ] ';
			} else {
				$helptip_output .= '<span class="dashicons dashicons-editor-help"></span>';
			}

			$helptip_output .= '</span>';

			return $helptip_output;

		}
	}

}
