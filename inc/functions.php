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
 * load plugin files
 */
require QREUZ_PLUGINPATH . '/inc/tracker/tracker.php';
require QREUZ_PLUGINPATH . '/inc/tracker/tracker-events.php';
require QREUZ_PLUGINPATH . '/inc/tracker/datapoints/tracking-datapoints.php';
require QREUZ_PLUGINPATH . '/inc/integrations.php';

require QREUZ_PLUGINPATH . '/admin/database/qreuz-database.php';
require QREUZ_PLUGINPATH . '/inc/qreuz-smart-pricing.php';
require QREUZ_PLUGINPATH . '/admin/qreuz-admin.php';
//require QREUZ_PLUGINPATH . '/admin/qreuz-toolbox-woocommerce.php';


/** table name handling for multisite */
if ( ! function_exists( 'qreuz_get_custom_table_name' ) ) {
	function qreuz_get_custom_table_name( $table_name ) {
		global $wpdb;
		if ( is_multisite() ) {
			$full_table_name = $wpdb->prefix . $table_name;
		} else {
			$full_table_name = $wpdb->prefix . $table_name;
		}
		return $full_table_name;
	}
}

$visitor_tracking = array(
	'active'          => get_option( 'qreuz_user_data_auth_status' ),
	'tracking_method' => get_option( 'qreuz_tracking_method' ),
);

/**
 * Initiate visitor tracking
 */
if ( 'frontend' === $visitor_tracking['tracking_method'] && '1' === $visitor_tracking['active'] ) {
	/**
	 * Load low budget tracker if selected.
	 */

	/** load low performance tracker instance */
	add_action( 'wp_footer', 'qreuz_v2' );

	function qreuz_v2() {

		$qkey = get_option( 'qreuz_user_data_qkey' );
		echo "<img src=\"\" id=\"qreuz-v2\" />
		<script>
		document.getElementById('qreuz-v2').src = 'https://ping.qreuz.com/v2/hit?qkey=" . $qkey . "&qtref=' + encodeURIComponent(document.referrer);
		</script>
	";

	}
} elseif ( 'enhanced' === $visitor_tracking['tracking_method'] && '1' === $visitor_tracking['active'] ) {
	/**
	 * Load regular tracker.
	 */

	/** load standard tracker instance */
	add_action( 'wp_enqueue_scripts', 'qreuz_main_js_load', 10 );

	function qreuz_main_js_load() {

		wp_enqueue_script(
			'qreuz_main_js',
			QREUZ_PLUGINURL . 'dist/qreuz.min.js',
			array(
				'wp-element',
			),
			QREUZ_PLUGINVERSION,
			true
		);

		wp_localize_script(
			'qreuz_main_js',
			'qreuzEnv',
			array(
				'_wp_ajax_url'     => admin_url( 'admin-ajax.php' ),
				'_wpnonce'         => wp_create_nonce( 'do-ajax-qtpv' ),
				'_wp_http_referer' => wp_get_referer(),
				'baseurl'          => get_bloginfo( 'wpurl' ),
				'basepath'         => parse_url( get_bloginfo( 'wpurl' ), PHP_URL_PATH ),
				'public_path'      => QREUZ_PLUGINURL . '/dist/',
			)
		);

	}
}

if ( is_admin() ) {
	$obj_qreuz_tracker_instance = new Qreuz_Tracker();
	add_action( 'wp_ajax_nopriv_qreuz_track_pageview', array( $obj_qreuz_tracker_instance, 'qreuz_track_pageview' ), 10 );
	add_action( 'wp_ajax_qreuz_track_pageview', array( $obj_qreuz_tracker_instance, 'qreuz_track_pageview' ), 10 );
}

/**
 * initiate integrations with plugins
 * */
global $qreuz_integrations;
$qreuz_integrations = new Qreuz_Integrations();
