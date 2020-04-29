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
class Qreuz_Admin_Smart_Tracking {

	/**
	 * updating settings for the integrations
	 * @param void
	 * @return void
	 */
	public function update_integration_settings() {

		if ( ! wp_verify_nonce( sanitize_text_field( $_POST['_wpnonce'] ), 'qreuz_smart_tracking_integrations' ) || ! current_user_can( 'manage_options' ) ) {

			wp_die();
			
		} else {
			
			$integrations['ga_property_id'] = ( isset( $_POST['qreuz_ti_ga_property_id'] ) ? sanitize_text_field( $_POST['qreuz_ti_ga_property_id'] ) : false );
			$integrations['fb_pixel_id']    = ( isset( $_POST['qreuz_ti_fb_pixel_id'] ) ? sanitize_text_field( $_POST['qreuz_ti_fb_pixel_id'] ) : false );
			$integrations['bing_uet_id']    = ( isset( $_POST['qreuz_ti_bing_uet_id'] ) ? sanitize_text_field( $_POST['qreuz_ti_bing_uet_id'] ) : false );
			$integrations['gmerch_id']      = ( isset( $_POST['qreuz_ti_gmerch_id'] ) ? sanitize_text_field( $_POST['qreuz_ti_gmerch_id'] ) : false );

			foreach ( $integrations as $key => $integration ) {
				if (false !== $integration ) {
					update_option( 'qreuz_ti_' . $key, $integration );
				}
			}

			$form         = sanitize_text_field( $_POST['form'] );
			$current_time = sanitize_text_field( $_POST['qreuz_current_time'] );

			$do_update = new Qreuz_Authentification();
			$response = $do_update->update_settings( $form, $integrations, $current_time );

			if ( 'userdata-updated' === $response ) {
				echo esc_html( $response );
				wp_die();
			} else {
				echo esc_html('error');
				wp_die();
			}
		}
	}

}
