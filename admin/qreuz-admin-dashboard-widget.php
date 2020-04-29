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
 * adding actions
 */
add_action( 'wp_dashboard_setup', array( 'Qreuz_Admin_Dashboard_Widget', 'load_qreuz_admin_dashboard_widget' ), 10 );

/**
 * Qreuz Admin Dashboard Widget
 */
class Qreuz_Admin_Dashboard_Widget {

	/**
	 * load the admin dashboard widget
	 * @param void
	 * @return void
	 */
	public static function load_qreuz_admin_dashboard_widget() {

		global $wp_meta_boxes;

		if ( current_user_can('manage_options') ) {

			wp_add_dashboard_widget( 'qreuz_admin_widget', 'Qreuz', array( 'Qreuz_Admin_Dashboard_Widget', 'qreuz_admin_dashboard_widget_content' ) );
		
		}
	}

	/**
	 * echoes the content for the pricing dashboard widget
	 * @param void
	 * @return void
	 */
	public static function qreuz_admin_dashboard_widget_content() {
		
		echo '
			<div class="qreuz_admin_dashboard_widget">
				<p>Questions about how to get the most out of Qreuz? Check out our website at <a href="https://qreuz.com" target="_blank">https://qreuz.com</a></p>
				<p>We value your feedback. Please let us know if you have any problems or if you have an idea what feature we could add to our service. Get in contact at <b>hello@qreuz.com</b></p>
				<p>You are currently using the Qreuz WordPress plugin in version ' . QREUZ_PLUGINVERSION . '.</p>';
		
				if ( '1' === get_option( 'qreuz_userdata_authentification' ) ) {
					self::get_newsfeed();
				}
				
		echo '
			</div>';

		echo '
			<div class="qreuz_admin_dashboard_widget_footer">
			<ul>
				<li>
				<a href="https://qreuz.com" target="_blank">Qreuz.com<span aria-hidden="true" class="dashicons dashicons-external"></span></a>
				</li>
				<li>
				<a href="https://qreuz.com/privacy" target="_blank">Privacy policy<span aria-hidden="true" class="dashicons dashicons-external"></span></a>
				</li>
			</ul>
			</div>';
	}

	private static function get_newsfeed() {

		$feed_url = 'https://qreuz.com/feed/updates/';

		$feed_data = json_decode( wp_remote_retrieve_body( wp_remote_get( $feed_url ) ), true);

		echo '<div id="qreuz_admin_dashboard_news"><h3>Qreuz News</h3>';

		foreach ( $feed_data as $element => $data ) {

			if ( ! isset( $data['url'] ) || '' === $data['url'] ) {
				$data['url'] = '#';
			}

			echo '<h4>';
			
			if ( isset( $data['tag'] ) && '' !== $data['tag'] ) {
				echo '<span class="qreuz_admin_tag">' . $data['tag'] . '</span>';
			}
			
			echo '<a href="' . $data['url'] . '" target="_blank">' . $data['title'] . '</a></h4>';

			echo '<small>' . $data['date'] . '</small>';

			echo '<p>' . $data['content'] . '</p>';
			
		}

		echo '</div>';
	}

}
