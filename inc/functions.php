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

/** initiate page view tracking */
if ( 'on' === get_option( 'qreuz_smart_tracking_low_performance' ) ) {

	/** load low performance tracker instance */
	add_action( 'wp_footer', 'qreuz_v2' );

	function qreuz_v2() {

		echo "<img src=\"https://ping.qreuz.com/?v=2\" id=\"qreuz-v2\" />
		<script>
		var qreuzQueryString = location.search;
		while( qreuzQueryString.charAt(0) === '?' ) {
			qreuzQueryString.substr(1);
		}
		document.getElementById('qreuz-v2').src += '&qtref=' + encodeURIComponent(document.referrer) + qreuzQueryString;
		</script>
	";

	}

} else {

	/** load standard tracker instance */
	add_action( 'wp_enqueue_scripts', 'qreuz_main_js_load', 10 );

	function qreuz_main_js_load() {

		wp_enqueue_script(
			'qreuz_main_js',
			QREUZ_PLUGINURL . 'assets/js/main.js',
			[
				'jquery',
			],
			QREUZ_PLUGINVERSION,
			true
		);

		wp_localize_script(
			'qreuz_main_js',
			'QreuzAjax',
			array(
				'ajaxurl'    => admin_url( 'admin-ajax.php' ),
				'qreuznonce' => wp_create_nonce( 'do-ajax-qtpv' ),
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
