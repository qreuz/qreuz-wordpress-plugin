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

/** adding actions */
$qreuz_admin_tabs = new Qreuz_Admin_Tabs();
add_action( 'admin_post_' . $qreuz_admin_tabs->qreuz_wp_admin_page, array( $qreuz_admin_tabs, 'process_form' ) );

$obj_qreuz_smart_pricing = new Qreuz_Smart_Pricing();
add_action( 'wp_ajax_qreuz_do_synchronize_prices', array( $obj_qreuz_smart_pricing, 'qreuz_update_prices_init' ), 10 );

$obj_qreuz_authentification = new Qreuz_Authentification();
add_action( 'wp_ajax_qreuz_do_authentification_start', array( $obj_qreuz_authentification, 'auth_start' ), 10 );
add_action( 'wp_ajax_qreuz_do_authentification_toqen', array( $obj_qreuz_authentification, 'auth_toqen' ), 10 );
add_action( 'wp_ajax_qreuz_authentification_toqen_successful', array( $obj_qreuz_authentification, 'auth_success' ), 10 );
add_action( 'wp_ajax_qreuz_do_logout', array( $obj_qreuz_authentification, 'logout' ), 10 );

$obj_qreuz_smart_tracking = new Qreuz_Admin_Smart_Tracking();
add_action( 'wp_ajax_qreuz_do_update_integration_settings', array( $obj_qreuz_smart_tracking, 'update_integration_settings' ), 10 );

class Qreuz_Admin_Tabs {

	public $qreuz_wp_admin_page = 'qreuz_smart_pricing';

	/**
	 * Qreuz admin pages content
	 * @param void
	 * @return void
	 * */
	public function qreuz_wp_admin_pages() {

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die();
		}

		$page     = sanitize_text_field( $_GET['page'] );

		global $qreuz_integrations;
		$this->load_pageblock_preheader();
		echo '<h1 style="visibility:hidden;display:none;"></h1>';
		$this->load_pageblock_header( $page );

		$redirect = rawurlencode( remove_query_arg( 'notice', $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] ) );

		switch ( $page ) {
			case 'qreuz_menu_smart_pricing':
				if ( $qreuz_integrations->qreuz_envv_wpp_woocommerce ) {
					$this->load_page_smart_pricing( $redirect );
				} else {
					$this->load_page_missing_integration( 'WooCommerce' );
				}
				break;
			case 'qreuz_menu_smart_tracking':
				$this->load_page_smart_tracking( $redirect );
				break;
			default:
				$page = 'qreuz';
				$this->load_page_start();
		}

		$this->load_pageblock_sidebar( $page );

		$this->load_pageblock_footer();

	}

	/**
	 * loading the page content 'missing integration' if accessed without plugin installed
	 * @param string $plugin
	 * @return void
	 */
	private function load_page_missing_integration( $plugin ) {
		$this->load_pageblock_description(
			'This feature of our plugin has been designed to work with <b>' . $plugin . '</b><br />
			Please activate ' . $plugin . ' and come back to use this feature.'
		);
	}

	/**
	 * loading the default page
	 * @param void
	 * @return void
	 */
	private function load_page_start() {
		
		/**
		 * Field: Email
		 */

		echo '<div class="qreuz_admin_section qreuz_admin_section_login">';
		echo '<h2>Login / Signup</h2>';

		/** row: already logged in */

		if ( is_email( get_option( 'qreuz_userdata_email' ) ) && '1' === get_option( 'qreuz_userdata_authentification' ) ) {

			$email = get_option( 'qreuz_userdata_email' );
			
			echo '<p id="qreuz_logged_in_info">';
			echo '<b>' . $email . '</b>';
			echo '</p>';

		}

		echo '<form action="" method="POST" enctype="multipart/form-data" id="qreuz_authentification_email">';

		echo '<input type="hidden" name="form" id="form" value="auth_email" />';
		wp_nonce_field( 'qreuz_authentification_email' );

		echo '<table>';

		echo '<tr>';
		echo '<td id="qreuz_login_preinfo">';
		echo '<p>';
		echo 'Enter your email address and request your access toqen to login or to create a <b>free</b> account.';
		echo '</p>';
		echo '<p id="qreuz_privacy_email">';
		echo 'Your email address entered here will be used to send you a single email with instructions to get your access toqen.';
		echo '</p>';
		echo '</td>';
		echo '</tr>';

		/** row: email */
		echo '<tr>';
		echo '<td>';
		echo '<input type="text" name="qreuz_userdata_email" value="' . esc_attr( get_option( 'qreuz_userdata_email' ) ) . '" placeholder="Enter your email" />';
		submit_button( __( 'Request Toqen', 'qreuz' ) );
		echo '<p id="success" class="hidden"></p>';
		echo '</td></tr>';

		echo '</table>';
		
		echo '</form>';

		/**
		 * Field: Toqen
		 */

		$toqen_disabled_class = ( get_option( 'qreuz_userdata_email' ) ? '' : 'disabled' );

		echo '<form action="" method="POST" enctype="multipart/form-data" id="qreuz_authentification_toqen" class="' . $toqen_disabled_class . '">';

		echo '<input type="hidden" name="form" id="form" value="auth_toqen" />';
		wp_nonce_field( 'qreuz_authentification_toqen' ); 

		echo '<table>';

		/** row: toqen */
		echo '<tr>';
		echo '<td>';
		echo '<input type="text" name="qreuz_userdata_toqen" value="' . esc_attr( get_option( 'qreuz_userdata_toqen' ) ) . '" placeholder="Enter your toqen" />';
		submit_button( __( 'Save Toqen', 'qreuz' ) );
		echo '<p id="success" class="hidden"></p>';
		echo '</td></tr>';

		echo '</table>';

		echo '</form>';
		echo '</div>'; // close qreuz_admin_section

	}

	/**
	 * loading the page smart pricing
	 * @param string $redirect
	 * @return void
	 */
	private function load_page_smart_pricing( $redirect ) {

		$product_cats = get_terms(
			[
				'taxonomy' => 'product_cat',
				'hide_empty' => false,
			]
		);

		// $this->load_pageblock_description('');

		/**
		 * Section: Synchronize
		 */
		echo '<div class="qreuz_admin_section">';
		echo '<h2>Synchronize prices</h2>';

		echo '<form action="" method="POST" enctype="multipart/form-data" id="qreuz_smart_pricing_synchronize">';
		wp_nonce_field( 'qreuz-sync-prices' );
		echo '<input type="submit" value="Synchronize prices" class="button button-primary qreuz_synchronize">';

		Qreuz_Admin::load_helptip(
			'Use this to synchronize the prices across your WooCommerce store with the pricing logic you have defined below. Depending on the number of products in your WooCommerce database, this may take some time.'
		);

		echo '</form>';
		echo '</div>'; // close qreuz_admin_section

		/**
		 * Section: Settings
		 */
		echo '<div class="qreuz_admin_section">';
		echo '<h2>Settings</h2>';
		echo '<form method="post" action="options.php">';
		settings_fields( 'qreuz_smart_pricing' );
		do_settings_sections( 'qreuz_smart_pricing' );
		echo '<table class="form-table qreuz_admin_smart_pricing">';
		echo '<tbody>';

		/**
		 * row for: premium category
		 */
		echo '<tr>';
		echo '<th scope="row">Premium category</th>';
		echo '<td>';
		Qreuz_Admin::load_helptip(
			'Set a category to be defined as "premium". The prices of products in this category will be increased by the percentage specified below.'
		);
		echo '<select name="qreuz_smart_pricing_premium_category">';
		echo '<option value="">' . esc_attr( __( '- none', 'qreuz' ) ) . '</option>';
			foreach ( $product_cats as $product_cat ) {

				$selected = get_option( 'qreuz_smart_pricing_premium_category' ) == $product_cat->term_id ? 'selected' : '';

				echo '<option value="' . esc_attr( $product_cat->term_id ) . '" ' . esc_attr( $selected ) . '>' . esc_attr( $product_cat->name ) . '</option>';
			}
		echo '</td></tr>';

		/**
		 * row for: premium percent
		 */
		echo '<tr>';
		echo '<th scope="row">Premium percent</th>';
		echo '<td>';
		Qreuz_Admin::load_helptip(
			'Set a percentage that will be added to the price of products in the premium category.'
		);
		echo '<input type="text" name="qreuz_smart_pricing_premium_percent" value="' . esc_attr( get_option( 'qreuz_smart_pricing_premium_percent' ) ) . '" />';
		echo '<span class="qreuz_admin_unit">%</span>';
		echo '</td></tr>';

		/**
		 * row for: sale category
		 */
		echo '<tr>';
		echo '<th scope="row">Sale category</th>';
		echo '<td>';
		Qreuz_Admin::load_helptip(
			'Set a category that will be used to put products on sale. Products with this category will automatically have their prices set on sale based on the percentage specified below.'
		);
		echo '<select name="qreuz_smart_pricing_sale_category">';
		echo '<option value="">' . esc_attr( __( '- none', 'qreuz' ) ) . '</option>';
			foreach ( $product_cats as $product_cat ) {

				$selected = get_option( 'qreuz_smart_pricing_sale_category' ) == $product_cat->term_id ? 'selected' : '';

				echo '<option value="' . esc_attr( $product_cat->term_id ) . '" ' . esc_attr( $selected ) . '>' . esc_attr( $product_cat->name ) . '</option>';
			}
		echo '</td></tr>';

		/**
		 * row for: sale percent
		 */
		echo '<tr>';
		echo '<th scope="row">Sale percent</th>';
		echo '<td>';
		Qreuz_Admin::load_helptip(
			'Set a discount percentage that will be used to calculate the sale price for products in the sale category.'
		);
		echo '<input type="text" name="qreuz_smart_pricing_sale_percent" value="' . esc_attr( get_option( 'qreuz_smart_pricing_sale_percent' ) ) . '" />';
		echo '<span class="qreuz_admin_unit">%</span>';
		echo '</td></tr>';

		/**
		 * row for: price scheme
		 */
		$price_schemes =
			array(
				'0.99',
				'0.98',
				'0.95',
				'0.90',
				'0.50',
				'0.00',
			);
		echo '<tr>';
		echo '<th scope="row">Price scheme</th>';
		echo '<td>';
		Qreuz_Admin::load_helptip(
			'Define a store wide price scheme that will be used for all prices in your shop. This setting will override prices specified elsewhere and round up to match the scheme.'
		);
		echo '<select name="qreuz_smart_pricing_price_scheme">';
		echo '<option value="">' . esc_attr( __( '- none', 'qreuz' ) ) . '</option>';
			foreach ( $price_schemes as $price_scheme ) {

				$selected = get_option( 'qreuz_smart_pricing_price_scheme' ) === $price_scheme ? 'selected' : '';

				echo '<option value="' . esc_attr( $price_scheme ) . '" ' . esc_attr( $selected ) . '>' . esc_attr( $price_scheme ) . '</option>';
			}
		echo '</td></tr>';

		echo '</table>';

		submit_button();
		echo '</form>';
		echo '</div>'; // close qreuz_admin_section

		/**
		 * Section: Set prices per WooCommerce product category
		 */
		echo '<div class="qreuz_admin_section">';
		echo '<h2>Set prices per WooCommerce product category';
		Qreuz_Admin::load_helptip(
			'In this section, you can set prices per WooCommerce product category. Prices set here will be applied to all products in the selected category.'
		);
		echo '</h2>';
		echo '<form method="post" action="' . esc_attr( admin_url( 'admin-post.php' ) ) . '">';
		echo '<input type="hidden" name="action" value="' . esc_attr( $this->qreuz_wp_admin_page ) . '">';
		echo '<input type="hidden" name="' . esc_attr( $this->qreuz_wp_admin_page ) . '" value="true">';
		wp_nonce_field( $this->qreuz_wp_admin_page, $this->qreuz_wp_admin_page . '_nonce', false );
		echo '<input type="hidden" name="_wp_http_referer" value="' . esc_attr( $redirect ) . '">';		
		echo '<table class="form-table qreuz_admin_smart_pricing">';
		echo '<tbody>';
		foreach ( $product_cats as $cats_obj ) {
			$db_row = Qreuz_Database::get_row( 'smart_pricing_prices', 'cat_id', $cats_obj->term_id ) ?: false;

			if ( $db_row && '0.00' !== $db_row->price ) {
				$price = $db_row->price;
			} else {
				$price = '';
			}

			echo '<tr><th scope="row">
				<label for="qreuz_smart_price_cat_' . esc_attr( $cats_obj->slug ) . '">' . esc_attr( $cats_obj->name ) . '</label>
			<td data-title="' . esc_attr( $cats_obj->name ) . '">
				<input id="qreuz_smart_price_cat_' . esc_attr( $cats_obj->term_id ) . '" name="qreuz_smart_price_cat_' . esc_attr( $cats_obj->term_id ) . '" class="regular-text" type="text" value="' . $price . '"></input>
				<span class="qreuz_form_currency_symbol">' . esc_attr( get_woocommerce_currency_symbol() ) . '</span>
				</td>
				</tr>';
		}

		echo '</table>';
		submit_button();
		echo '</form>';
		echo '</div>'; // close qreuz_admin_section

	}

	/**
	 * loading the page smart tracking
	 * @param string $redirect
	 * @return void 
	 */
	private function load_page_smart_tracking( $redirect ) {

		/**
		 * row: login required
		 */
		if ( '1' !== get_option( 'qreuz_userdata_authentification' ) ) {

			$baseurl = remove_query_arg( 'notice', esc_url_raw( $_SERVER['REQUEST_URI'] ) );
			

			echo '<p id="qreuz_logged_in_required">';
			echo '<a href="' . esc_attr( add_query_arg( 'page', 'qreuz', $baseurl ) ) . '" class="qreuz_to_login">Create a free account and login now!</a>';
			echo '</p>';

		}

		echo '<div class="qreuz_admin_section" id="qreuz_smart_tracking">';

		/**
		 * Tracking settings
		 */
		echo '<h2>Tracking settings</h2>';

		echo '<form method="post" action="options.php" class="qreuz_smart_tracking_form">';
		settings_fields( 'qreuz_smart_tracking' );
		do_settings_sections( 'qreuz_smart_tracking' );
		echo '<table class="form-table qreuz_admin_smart_tracking">';
		echo '<tbody>';

		echo '<tr>';
		echo '<th scope="row">Activate tracking</th>';
		echo '<td>';
		Qreuz_Admin::load_helptip(
			'Activate tracking with Qreuz.'
		);
		
		echo '<input type="checkbox" name="qreuz_smart_tracking_active" ' . ( 'on' === get_option( 'qreuz_smart_tracking_active' ) ? 'checked' : '' ) . ' />';
		echo '</td></tr>';

		echo '<tr>';
		echo '<th scope="row">Low budget tracking</th>';
		echo '<td>';
		Qreuz_Admin::load_helptip(
			'We do not recommend this feature for most users. Activate this if you are on a low performance server. This feature will reduce server load and implement tracking on the front end.'
		);
		
		echo '<input type="checkbox" name="qreuz_smart_tracking_low_performance" ' . ( 'on' === get_option( 'qreuz_smart_tracking_low_performance' ) ? 'checked' : '' ) . ' />';
		echo '</td></tr>';

		echo '</table>';

		submit_button();
		echo '</form>';

		/**
		 * Integration settings
		 */
		echo '<h2>Integration settings</h2>';
		echo '<form method="POST" action="" enctype="multipart/form-data" id="qreuz_smart_tracking_integrations" class="qreuz_smart_tracking_form">';
		
		echo '<input type="hidden" name="form" id="form" value="update_settings_integrations" />';
		wp_nonce_field( 'qreuz_smart_tracking_integrations' );

		echo '<table class="form-table qreuz_admin_settings_table">';
		echo '<tbody>';

		/**
		 * row for: GA Property ID
		 */
		echo '<tr>';
		echo '<th scope="row">Google Analytics Property ID</th>';
		echo '<td>';
		Qreuz_Admin::load_helptip(
			'Enter your Google Analytics property ID to activate the integration with Google Analytics.'
		);
		echo '<input type="text" name="qreuz_ti_ga_property_id" value="' . esc_attr( get_option( 'qreuz_ti_ga_property_id' ) ) . '" />';
		echo '</td></tr>';

		/**
		 * row for: Facebook Pixel ID
		 */
		echo '<tr>';
		echo '<th scope="row">Facebook Pixel ID</th>';
		echo '<td>';
		Qreuz_Admin::load_helptip(
			'Enter your Facebook Pixel ID to activate the integration with Facebook Ads.'
		);
		echo '<input type="text" name="qreuz_ti_fb_pixel_id" value="' . esc_attr( get_option( 'qreuz_ti_fb_pixel_id' ) ) . '" />';
		echo '</td></tr>';

		/**
		 * row for: Bing UET ID
		 */
		echo '<tr>';
		echo '<th scope="row">Bing Ads UET Tag ID</th>';
		echo '<td>';
		Qreuz_Admin::load_helptip(
			'Enter your Bing Ads UET tag ID to activate the integration with Bing Ads.'
		);
		echo '<input type="text" name="qreuz_ti_bing_uet_id" value="' . esc_attr( get_option( 'qreuz_ti_bing_uet_id' ) ) . '" />';
		echo '</td></tr>';

		/**
		 * row for: Google Merchant Center ID
		 */
		echo '<tr>';
		echo '<th scope="row">Google Merchant Center ID</th>';
		echo '<td>';
		Qreuz_Admin::load_helptip(
			'Enter your Googlel Merchant Center ID to activate the integration with Google Merchant Center.'
		);
		echo '<input type="text" name="qreuz_ti_gmerch_id" value="' . esc_attr( get_option( 'qreuz_ti_gmerch_id' ) ) . '" />';
		echo '</td></tr>';

		echo '</table>';

		submit_button();
		
		echo '<p id="success" class="hidden"></p>';

		echo '</form>';
		echo '</div>'; // close qreuz_admin_section

	}

	/**
	 * loading the preheader
	 * @param void
	 * @return void
	 */
	public function load_pageblock_preheader() {

		echo "<div class='wrap qreuz-wrapper qreuz'>";

	}

	/**
	 * loading the page header
	 * @param string $page
	 * @return void
	 */
	private function load_pageblock_header( $page ) {

		$baseurl = remove_query_arg( 'notice', esc_url_raw( $_SERVER['REQUEST_URI'] ) );

		echo '<div class="qreuz_admin_header">';

		echo '<h1><img src="' . esc_attr( plugins_url( 'qreuz/assets/img/qreuz-full-white.svg' ) ) . '" alt="Qreuz" /></h1>';

		echo '<div class="qreuz_admin_navigation nav-tab-wrapper">';

		$nav_items = [
			'qreuz'                     => ( '1' === get_option( 'qreuz_userdata_authentification' ) ? 'Account' : 'Login' ),
			'qreuz_menu_smart_tracking' => 'Tracking',
			'qreuz_menu_smart_pricing'  => 'Smart pricing',
		];

		foreach ( $nav_items as $nav_slug => $nav_title ) {

			$nav_tab_is_active = $nav_slug === $page ? 'nav-tab-active' : '';
			echo '<span><a href="' . esc_attr( add_query_arg( 'page', $nav_slug, $baseurl ) ) . '" class="nav-tab ' . esc_attr( $nav_tab_is_active ) . '">' . esc_html( $nav_title ) . '</a></span>';

		}

		echo '</div>';

		echo '<h2><span>' . esc_attr( get_admin_page_title() ) . '</span></h2>';

		echo '</div>';

		echo '<div class="qreuz_admin_left">';

	}

	/**
	 * loading the description block
	 * @param string $text
	 * @return void
	 */
	private function load_pageblock_description( $text ) {

		if ( $text ) {

			echo '<div class="qreuz_admin_pb_description">';
			echo '<p>';

			echo $text;

			echo '</p>';
			echo '</div>';

		}

	}

	/**
	 * loading the page footer
	 * @param void
	 * @return void
	 */
	private function load_pageblock_footer() {

		echo '<div class="qreuz_admin_footer">';
		echo '<p>';
		echo '<a href="https://qreuz.com" target="_blank" style="text-decoration:none;">Qreuz</a>. Made with passion in Berlin.';
		echo '</p>';
		echo '</div>';

		echo '</div>'; // close wrapper div

	}

	/**
	 * loading the sidebar
	 * @param string $page
	 * @return void
	 */
	private function load_pageblock_sidebar( $page ) {

		echo '</div>'; // closing qreuz_admin_left

		switch ( $page ) {
			case 'qreuz_menu_smart_pricing':
				$content = '<h3>Qreuz Smart Pricing</h3><p>Qreuz Smart Pricing helps you to optimize your prices across your WooCommerce store.<br />
				The plugin will automatically adjust and override existing prices across your WooCommerce products based on the following settings.<br />
				Leave empty to not set a price for a product category.</p>';
				break;
			case 'qreuz_menu_smart_tracking':
				$content = '<h3>Qreuz Smart Tracking</h3><p>Qreuz Smart Tracking helps you to analyze user behavior on your Wordpress Website.</p>
				<p>This tracking can replace other integrations with tracking providers and works <b>without cookies</b>.</p>
				<p>Enter the IDs of other tracking tools to activate the integration with them. An anonymized copy of your recorded data will then be forwarded to those third-party tracking providers.</p>
				<h3>Features</h3>
				<ul class="qreuz_admin_features">
					
					<li>
					<b>Integration with ad networks</b>
						<ul>
							<li>Connect your data with your favorite tools and platforms</li>
							<li>Integration with Google Analytics</li>
							<li>Integration with Google Ads</li>
							<li>Integration with Google Merchant Center</li>
							<li>Integration with Facebook Ads</li>
							<li>Integration with Bing Ads</li>
						</ul>
					</li>
					
					<li>
					<b>Optimize your page speed</b>
						<ul>
							<li>Replaces your existing tracking integrations</li>
							<li>Lightweight and optimized tracking</li>
							<li>Reduces page load on the frontend</li>
						</ul>
					</li>
					
					<li>
					<b>Integration with WooCommerce</b>
						<ul>
							<li>Activated automatically if you use WooCommerce</li>
							<li>Track your orders</li>
							<li>identify successful campaigns</li>
							<li>understand product performance</li>
						</ul>
					</li>
				</ul>
				';
				break;
			default:
				$content = '<h3>Qreuz</h3>
				<p>Login for access to advanced tracking and automation features of this app.<br />
				Enter your email address below to login with your existing profile or to create a <b>free</b> account
				</p>';
		}

		echo '<div class="qreuz_admin_sidebar">';
		echo '<p>';

		echo $content;

		echo '</p>';
		echo '</div>';

	}

	/**
	 * loading admin notices
	 * @param void
	 * @return void
	 */
	public function admin_notice_construct() {

		if ( isset( $_GET['notice'] ) ) {
			switch ( sanitize_text_field( $_GET['notice'] ) ) {
				case ( 'saved' ):
					$notice = 'Saved';
					$type   = 'notice-success';
					break;
				case ( 'deleted' ):
					$notice = 'Deleted';
					$type   = 'notice-warning';
					break;
				case ( 'failed' ):
					$notice = 'Failed';
					$type   = 'notice-error';
					break;
				case ( 'info' ):
					$notice = 'INFO';
					$type   = 'notice-info';
					break;
				default:
					$notice = false;
			}
		} elseif ( isset( $_GET['settings-updated'] ) ) {
			switch ( sanitize_text_field( $_GET['settings-updated'] ) ) {
				case ( 'true' ):
					$notice = 'Saved';
					$type   = 'notice-success';
					break;
				default:
					$notice = false;
			}
		} else {
			return;
		}

		if ( $notice ) {
			add_action(
				'all_admin_notices',
				function() use ( $notice, $type ) {
					$this->admin_notice_render( $notice, $type );
				},
				10
			);
		}
	}

	/**
	 * rendering admin notices
	 * @param string $notice
	 * @param string $type
	 * @return void
	 */
	private function admin_notice_render( $notice, $type ) {

		echo '<div class="notice ' . esc_attr( $type ) . ' is-dismissible qreuz-notice">
		<p>' . esc_html( $notice ) . '</p></div>';

	}

	/**
	 * processing forms on the backend
	 * @param void
	 * @return void
	 */
	public function process_form() {
		
		if ( ! wp_verify_nonce( sanitize_text_field( $_POST[ $this->qreuz_wp_admin_page . '_nonce' ] ), $this->qreuz_wp_admin_page ) || ! current_user_can( 'manage_options' ) ) {
			wp_die();
		}

		if ( isset( $_POST[ $this->qreuz_wp_admin_page ] ) ) {

			$price_array = array();

			$input_class = 'qreuz_smart_price_cat_';
			$input_class_len = strlen( $input_class );
			foreach ( $_POST as $name => $value ) {
				if ( substr( $name, 0, $input_class_len ) === $input_class ) {
					$cat_id = substr( $name, $input_class_len, strlen( $name ) - $input_class_len );
					
					$value = sanitize_text_field( $value );

					$price_array[ $cat_id ] = '' !== $value ? $value : null;
				}
			}
			
			/** store updated prices to database */
			Qreuz_Database::insert_data_2col( 'smart_pricing_prices', $price_array, 'cat_id', 'price' );
			
			$notice = 'saved';

		} else {
			$notice = 'failed';
		}

		if ( ! isset( $_POST['_wp_http_referer'] ) ) {
			wp_die( 'I am feeling puzzled. Missing redirect target?!' );
		}

		$url = add_query_arg( 'notice', $notice, urldecode( esc_url_raw( $_POST['_wp_http_referer'] ) ) );

		wp_safe_redirect( $url );

		exit;
	}
}
