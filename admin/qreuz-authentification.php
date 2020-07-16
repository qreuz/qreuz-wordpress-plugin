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


class Qreuz_Authentification {

	/**
	 * Starts authentification with Qreuz service and echoes the cURL response
	 * @param void
	 * @return void
	 */
	public function auth_start() {
		
		
		if ( ! wp_verify_nonce( sanitize_text_field( $_POST['_wpnonce'] ), 'qreuz_authentification_email' ) || ! current_user_can( 'manage_options' ) ) {

			wp_die();
			
		} else {

			$email        = sanitize_email( $_POST['qreuz_userdata_email'] );
			$current_time = sanitize_text_field( $_POST['qreuz_current_time'] );
			$form         = sanitize_text_field( $_POST['form'] );

			$email_verification_response = $this->verify_email( $email );

			if ( true === $email_verification_response[0] ) {

				$requester_data = new Qreuz_Tracking_Datapoints();

				$auth_requester_data = array();

				$auth_requester_data['form']      = $form;
				$auth_requester_data['email']     = $email;
				$auth_requester_data['ua']        = $requester_data->qreuz_tdp_user_agent();
				$auth_requester_data['ip']        = $requester_data->qreuz_tdp_server_ip();
				$auth_requester_data['url']       = $requester_data->qreuz_tdp_url( 'pure' );
				$auth_requester_data['timestamp'] = $current_time;

				if ( 'new' === $email_verification_response[2] ) {
					$auth_requester_data['new'] = 'true';
					update_option( 'qreuz_userdata_email', $email );
				} elseif ( 'existing' === $email_verification_response[2] ) {
					$auth_requester_data['new'] = 'false';
				} else {
					echo esc_html( 'an error occured.' );
					wp_die();
				}

				$response = (string) $this->do_auth_request( 'https://auth.qreuz.com', $auth_requester_data );

				echo esc_html( $response );

				wp_die();

			} else {

				echo esc_html( $email_verification_response[1] );
				wp_die();

			}
		}
	}

	/**
	 * Authentificates with the provided toqen, echoes cURL response
	 * @param void
	 * @return void
	 */
	public function auth_toqen() {

		if ( ! wp_verify_nonce( sanitize_text_field( $_POST['_wpnonce'] ), 'qreuz_authentification_toqen' ) || ! current_user_can( 'manage_options' ) ) {
			
			wp_die();
			
		} else {

			$token        = sanitize_text_field( $_POST['qreuz_userdata_toqen'] );
			$current_time = sanitize_text_field( $_POST['qreuz_current_time'] );
			$form         = sanitize_text_field( $_POST['form'] );

			$requester_data = new Qreuz_Tracking_Datapoints();

			$auth_requester_data = array();

			$auth_requester_data['form']      = $form;
			$auth_requester_data['toqen']     = $token;
			$auth_requester_data['ua']        = $requester_data->qreuz_tdp_user_agent();
			$auth_requester_data['ip']        = $requester_data->qreuz_tdp_server_ip();
			$auth_requester_data['url']       = $requester_data->qreuz_tdp_url( 'pure' );
			$auth_requester_data['timestamp'] = $current_time;
			$auth_requester_data['new']       = '';

			$response = (string) $this->do_auth_request( 'https://auth.qreuz.com', $auth_requester_data );

			$response = json_decode( $response, true );

			if ( $response[ 'success' ] ) {
				update_option( 'qreuz_userdata_toqen', $token );
				update_option( 'qreuz_userdata_authentification', '1' );
				update_option( 'qreuz_userdata_qkey', $response[ 'qkey' ] );
				update_option( 'qreuz_smart_tracking_active', 'on' );

				wp_die( json_encode( $response ) );
			}

			/** push integration settings if present 

			$integrations['ga_property_id'] = ( false === get_option( 'qreuz_ti_ga_property_id' ) ? '' :  get_option( 'qreuz_ti_ga_property_id' ) );
			$integrations['fb_pixel_id'] = ( false === get_option( 'qreuz_ti_fb_pixel_id' ) ? '' :  get_option( 'qreuz_ti_fb_pixel_id' ) );
			$integrations['bing_uet_id'] = ( false === get_option( 'qreuz_ti_bing_uet_id' ) ? '' :  get_option( 'qreuz_ti_bing_uet_id' ) );
			$integrations['gmerch_id'] = ( false === get_option( 'qreuz_ti_gmerch_id' ) ? '' :  get_option( 'qreuz_ti_gmerch_id' ) );

			$settings_response = $this->update_settings( 'update_settings_integrations', $integrations, $current_time );
			*/
			if ( 'userdata-updated' === $settings_response ) {

				echo esc_html( $response );
				wp_die();

			} else {

				echo esc_html('error');
				wp_die();

			}
		}
	}

	/**
	 * updates options if authentification was successful
	 * @param void
	 * @return void
	 */
	public function auth_success() {

		if ( ! wp_verify_nonce( sanitize_text_field( $_POST['_wpnonce'] ), 'qreuz_authentification_toqen' ) || ! current_user_can( 'manage_options' ) ) {
			wp_die();
			
		} else {

			

			$response = 'success';
			echo esc_html( $response );

			wp_die();
		}
	}

	/**
	 * helper function to logout from Qreuz
	 * @param void
	 * @return void
	 */
	public function logout() {

		if ( ! wp_verify_nonce( sanitize_text_field( $_POST['_wpnonce'] ), 'qreuz_authentification_toqen' ) || ! current_user_can( 'manage_options' ) ) {
			wp_die();
			
		} else {

			delete_option( 'qreuz_userdata_email' );
			delete_option( 'qreuz_userdata_toqen' );
			delete_option( 'qreuz_userdata_authentification' );
			delete_option( 'qreuz_smart_tracking_active' );

			echo "logged-out";

			wp_die();

		}
	}

	/**
	 * updates and synchronizes settings
	 * @param string $form
	 * @param array $data
	 * @param string $current_time
	 * @return string
	 */
	public function update_settings( $form, $data, $current_time = 'unset' ) {

		$requester_data = new Qreuz_Tracking_Datapoints();

		$update_settings_data = array();
	
		$update_settings_data['form']      = $form;
		$update_settings_data['email']     = get_option( 'qreuz_userdata_email' );
		$update_settings_data['toqen']     = get_option( 'qreuz_userdata_toqen' );
		$update_settings_data['ua']        = $requester_data->qreuz_tdp_user_agent();
		$update_settings_data['ip']        = $requester_data->qreuz_tdp_server_ip();
		$update_settings_data['url']       = $requester_data->qreuz_tdp_url( true );
		$update_settings_data['timestamp'] = $current_time;

		foreach ( $data as $key => $value ) {

			$update_settings_data[$key] = $value;

		}

		$response = (string) $this->do_update_settings_request( 'https://auth.qreuz.com', $update_settings_data );

		return $response;

	}

	/**
	 * updates new settings on the Qreuz account settings
	 * @param string $url
	 * @param array $update_settings_data
	 */
	private function do_update_settings_request( $url, $update_settings_data ) {

		$response = wp_remote_request(
			$url,
			array(
				'method'       => 'POST',
				'timeout'      => 45,
				'httpdversion' => '1.0',
				'headers'      => array(
					'cache-control: no-cache',
					'User-Agent: ' . $update_settings_data['ua'],
				),
				'body'          => $update_settings_data,
			)
		);

		if ( is_wp_error( $response ) ) {
			$error_message = $response->get_error_message();
			echo esc_html( $error_message );
			wp_die();
		} else {
			return wp_remote_retrieve_body( $response );
		}

	}

	/**
	 * actually do the auth request
	 * @param string $url
	 * @param array $auth_requester_data
	 */
	private function do_auth_request( $url, $auth_requester_data ) {
		$response = wp_remote_request(
			$url,
			array(
				'method'       => 'POST',
				'timeout'      => 45,
				'httpdversion' => '1.0',
				'headers'      => array(
					'cache-control: no-cache',
					'User-Agent: ' . $auth_requester_data['ua'],
				),
				'body'          => array(
					'form'      => $auth_requester_data['form'],
					'email'     => $auth_requester_data['email'],
					'ip'        => $auth_requester_data['ip'],
					'url'       => $auth_requester_data['url'],
					'new'       => $auth_requester_data['new'],
					'timestamp' => $auth_requester_data['timestamp'],
					'toqen'     => $auth_requester_data['toqen'],
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			$error_message = $response->get_error_message();
			echo esc_html( $error_message );
			wp_die();
		} else {
			return wp_remote_retrieve_body( $response );
		}
	}

	/**
	 * verifies if the provided string is an email and returns a string with an error message
	 * @param string $email
	 * @return array [ bool, string error_message, $email ]
	 */
	private function verify_email( $email ) {

		if ( empty( $email ) ) {
			$email_verification = [
				false,
				__( 'Email is required', 'qreuz' ),
				null,
			];
		} else {
			$email = $this->format_input( $email );
			if ( ! filter_var( $email, FILTER_VALIDATE_EMAIL ) ) {
				$email_verification = [
					false,
					__( 'This does not seem to be a valid email address.', 'qreuz' ),
					null,
				];
			} else {
				if ( get_option( 'qreuz_userdata_email' ) === $email ) {
					$email_verification = [
						true,
						__( 'Success.', 'qreuz' ),
						'existing',
						$email,
					];
				} else {
					$email_verification = [
						true,
						__( 'Success.', 'qreuz' ),
						'new',
						$email,
					];
				}
			}
		}

		return $email_verification;
	}

	/**
	 * formats input
	 * @param string @data
	 * @return string
	 */
	private function format_input( $data ) {
		$data = trim( $data );
		$data = stripslashes( $data );
		$data = htmlspecialchars( $data );
		return $data;
	}
}
