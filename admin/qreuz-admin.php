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
if (!defined('ABSPATH')) {
	exit;
}

/** loading admin plugin files */
require QREUZ_PLUGINPATH . '/admin/activate-function.php';
require QREUZ_PLUGINPATH . '/admin/qreuz-admin-tabs.php';
require QREUZ_PLUGINPATH . '/admin/qreuz-admin-dashboard-widget.php';
require QREUZ_PLUGINPATH . './admin/qreuz-ajax.php';

/** adding actions */
add_action('admin_enqueue_scripts', array('Qreuz_Admin', 'qreuz_admin_load_css'), 10);
add_action('admin_enqueue_scripts', array('Qreuz_Admin', 'qreuz_admin_load_js'), 10);
add_action('admin_menu', array('Qreuz_Admin', 'add_menu_page'), 10);
add_action('add_meta_boxes', array('Qreuz_Admin', 'qreuz_metabox_wc_order'), 10);
// add_action( 'add_meta_boxes', array( 'Qreuz_Admin', 'qreuz_metabox_wc_product' ), 10 );
add_action('admin_enqueue_scripts', array('Qreuz_Admin', 'register_qreuz_settings'), 10);
add_action('admin_enqueue_scripts', array('Qreuz_Admin', 'qreuz_db_update_check'), 10);
/**
 * QREUZ ADMIN CLASS
 */
class Qreuz_Admin
{

	/**
	 * check if the database version is current
	 * @param void
	 * @return void
	 */
	public static function qreuz_db_update_check()
	{

		if (!current_user_can('manage_options')) {

			return;
		} else {

			require QREUZ_PLUGINPATH . '/admin/qreuz-update-check.php';
		}
	}

	/**
	 * load CSS for admin (dashboard) view
	 * 
	 * @param void
	 * @return void
	 */
	public static function qreuz_admin_load_css()
	{

		if (!current_user_can('manage_options')) {

			return;
		} else {

			$css_url  = QREUZ_PLUGINURL . 'dist/qreuz.admin.css';

			wp_enqueue_style(
				'qreuz_admin_css',
				$css_url,
				'',
				QREUZ_PLUGINVERSION
			);
		}
	}

	/**
	 * load JS for admin (dashboard) view
	 * 
	 * @param void
	 * @return void
	 */
	public static function qreuz_admin_load_js()
	{

		if (!current_user_can('manage_options')) {

			return;
		} else {

			$js_url  = QREUZ_PLUGINURL . 'dist/qreuz.admin.min.js';

			global $qreuz_integrations;

			wp_enqueue_script(
				'qreuz_admin_js',
				$js_url,
				array(
					'wp-element',
				),
				QREUZ_PLUGINVERSION,
				true
			);

			wp_localize_script(
				'qreuz_admin_js',
				'qreuzEnv',
				array(
					'_wp_ajax_url'     => admin_url('admin-ajax.php'),
					'_wpnonce'         => wp_create_nonce('do-ajax-qreuz-admin'),
					'_wp_http_referer' => wp_get_referer(),
					'baseurl'          => get_bloginfo('wpurl'),
					'basepath'         => parse_url(get_bloginfo('wpurl'), PHP_URL_PATH),
					'public_path'      => QREUZ_PLUGINURL . '/dist/',
					'integrations'     => $qreuz_integrations,
				)
			);
		}
	}

	/**
	 * register plugin menu page
	 * 
	 * @param void
	 * @return void
	 * */
	public static function add_menu_page()
	{

		if (!current_user_can('manage_options')) {

			return;
		} else {

			$qreuz_admin_tabs = new Qreuz_Admin_Tabs();

			$loggedin_in_title = ('1' === get_option('qreuz_user_data_auth_status') ? 'Account' : 'Get started');

			/** load main menu content */
			$menu_page = add_menu_page(
				__('Qreuz', 'qreuz'),
				'Qreuz',
				'manage_options',
				'qreuz',
				array($qreuz_admin_tabs, 'qreuz_wp_admin_pages'),
				'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iRWJlbmVfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAzMiAzMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIgMzI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNGRkZGRkY7fQ0KPC9zdHlsZT4NCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMC40LDI5LjRjLTAuMiwwLTAuNS0wLjEtMC42LTAuNGwtNS43LTEwLjhjLTAuMi0wLjMtMC4xLTAuNywwLjMtMC45YzAuMSwwLDAuMi0wLjEsMC4zLTAuMWg0LjkNCgljMC4yLDAsMC41LDAuMSwwLjYsMC40bDEuNSwyLjljMC44LTEuMSwxLjEtMi41LDEuMS0zLjh2LTJjMC0zLjktMy4xLTctNy03cy03LDMuMS03LDd2MmMwLDIuNywxLjYsNS4yLDQuMSw2LjQNCgljMC4xLDAuMSwwLjIsMC4yLDAuMywwLjNsMi43LDUuMWMwLjIsMC4zLDAuMSwwLjctMC4zLDAuOWMtMC4xLDAtMC4yLDAuMS0wLjMsMC4xaDBDOC41LDI5LjEsMy4yLDIzLjUsMy4yLDE2Ljd2LTINCglDMy4yLDcuNyw4LjksMiwxNS45LDJzMTIuNyw1LjcsMTIuNywxMi43djJjMCwzLjUtMS41LDYuOC00LDkuMmwxLjMsMi41YzAuMiwwLjMsMCwwLjctMC4zLDAuOWMtMC4xLDAtMC4yLDAuMS0wLjMsMC4xTDIwLjQsMjkuNA0KCUwyMC40LDI5LjR6Ii8+DQo8L3N2Zz4NCg==',
				null
			);
			add_action("load-$menu_page", array($qreuz_admin_tabs, 'admin_notice_construct'));

			$submenu_page[1] = add_submenu_page(
				'qreuz',
				$loggedin_in_title,
				$loggedin_in_title,
				'manage_options',
				'qreuz',
				array($qreuz_admin_tabs, 'qreuz_wp_admin_pages'),
				1
			);
			add_action("load-$submenu_page[1]", array($qreuz_admin_tabs, 'admin_notice_construct'));

			$submenu_page[2] = add_submenu_page(
				'qreuz',
				__('Tracking', 'qreuz'),
				'User tracking',
				'manage_options',
				'qreuz&subpage=tracking',
				array($qreuz_admin_tabs, 'qreuz_wp_admin_pages'),
				2
			);
			add_action("load-$submenu_page[2]", array($qreuz_admin_tabs, 'admin_notice_construct'));
		}
	}

	/**
	 *  Load Qreuz meta box on WooCommerce order pages
	 * 
	 * @param void
	 * @return void
	 * */
	public static function qreuz_metabox_wc_order()
	{

		if (!current_user_can('manage_options')) {

			return;
		} else {

			add_meta_box(
				'qreuz_meta_box',
				'Qreuz',
				array('Qreuz_Admin', 'qreuz_metabox_wc_order_callback'),
				'shop_order',
				'side',
				'core'
			);
		}
	}

	/**
	 * Qreuz meta box callback for: WooCommerce orders
	 * 
	 * @param string $post
	 * @return void
	 * */
	public static function qreuz_metabox_wc_order_callback($post)
	{

		require QREUZ_PLUGINPATH . '/admin/qreuz-admin-metabox-order.php';

		global $post;
		$order = new WC_Order($post->ID);

		$metabox_order = new Qreuz_Admin_Metabox_Order();

		$metabox_order->qreuz_admin_metabox_order_constructor($order);
	}

	/**
	 * Qreuz meta box on WooCommerce product pages
	 * 
	 * @param void
	 * @return void
	 * */
	public static function qreuz_metabox_wc_product()
	{
		add_meta_box(
			'qreuz_meta_box_product',
			'Qreuz',
			array('Qreuz_Admin', 'qreuz_metabox_wc_product_callback'),
			'product',
			'side',
			'core'
		);
	}

	/**
	 * Qreuz meta box callback for: WooCommerce products
	 * 
	 * @param string $post
	 * @return void
	 * */
	public static function qreuz_metabox_wc_product_callback($post)
	{

		echo "placeholder";
	}

	/**
	 * register all Qreuz plugin settings
	 * 
	 * @param void
	 * @return void
	 */
	public static function register_qreuz_settings()
	{

		if (!current_user_can('manage_options')) {

			return;
		} else {
			/** settings for smart pricing */
			register_setting('qreuz_smart_pricing', 'qreuz_smart_pricing_premium_category');
			register_setting('qreuz_smart_pricing', 'qreuz_smart_pricing_premium_percent');
			register_setting('qreuz_smart_pricing', 'qreuz_smart_pricing_sale_category');
			register_setting('qreuz_smart_pricing', 'qreuz_smart_pricing_sale_percent');
			register_setting('qreuz_smart_pricing', 'qreuz_smart_pricing_price_scheme');
			/** settings for user tracking */
			register_setting('qreuz_tracking', 'qreuz_tracking_method');
			/** settings for userdata */
			register_setting('qreuz_user_data', 'qreuz_user_data_toqen');
			register_setting('qreuz_user_data', 'qreuz_user_data_qkey');
			register_setting('qreuz_user_data', 'qreuz_user_data_email');
			register_setting('qreuz_user_data', 'qreuz_user_data_auth_status');
		}
	}

	// End class.
}
