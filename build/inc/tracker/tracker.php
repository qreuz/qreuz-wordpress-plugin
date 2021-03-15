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
class Qreuz_Tracker {

	public $tracking_parameters;
	private $qsesh;

	public function __construct() {
		$this->tracking_parameters = array();
	}

	public function qreuz_track_pageview() {

		if ( ! check_ajax_referer( 'do-ajax-qtpv', '_wpnonce', false ) ) {

			wp_die( 'nonce_failed' );

		} else {

			$url = esc_url_raw( $_POST['url'] );
			$ref = esc_url_raw( $_POST['ref'] );

			$this->tracking_parameters['qtt'] = 'hit';
			$this->qreuz_prepare_request( $url, $ref );
			$this->qreuz_tracker_push( $this->tracking_parameters );
			$this->tracking_parameters = array();

			return;
		}
	}

	public function qreuz_prepare_request( $url = null, $ref = null ) {

		$this->tracking_parameters['qturl']  = ( isset( $url ) ? $url : Qreuz_Tracking_Datapoints::qreuz_tdp_url() );
		$this->tracking_parameters['qua']    = Qreuz_Tracking_Datapoints::qreuz_tdp_user_agent();

		$uip = Qreuz_Tracking_Datapoints::qreuz_tdp_ip();

		$this->tracking_parameters['quaip']   = $uip['aip'];
		$this->tracking_parameters['quhip']   = $uip['hip'];
		$this->tracking_parameters['aip']    = '1';
		$this->tracking_parameters['qtref']  = ( isset( $ref ) ? $ref : Qreuz_Tracking_Datapoints::qreuz_tdp_referrer() );
		// $this->tracking_parameters     = Qreuz_Tracking_Datapoints::qreuz_tdp_custom_dimensions( $this->tracking_parameters );
		$this->tracking_parameters['z']      = wp_rand();

		/**
		 * collect all URL params and add them to tracking query
		 */
		$query_string = parse_url( $url, PHP_URL_QUERY );

		parse_str( $query_string, $query_params );
		$query_params_keys = array_keys( $query_params );

		foreach ( $query_params as $key => $value ) {
			if ( ! in_array( $key, array_keys( $this->tracking_parameters ), true ) ) {
				$this->tracking_parameters[ $key ] = $value;
			}
		}

	}

	public function qreuz_tracker_push( $tracking_data ) {

		$qkey = get_option( 'qreuz_user_data_qkey' );

		if ( false !== $qkey && 5 < strlen( $qkey ) ) {

			$tracking_data_encoded = $this->parameter_url_encoding( $tracking_data );

			$tracking_request_parameter = '';

			foreach ( $tracking_data_encoded as $parameter => $value ) {
				if ( '' !== $value ) {
					$tracking_request_parameter .= '&' . $parameter . '=' . $value;
				}
			}

			$tracking_url = array( 'https://ping.qreuz.com/?v=1&qkey=' . $qkey );
			foreach ( $tracking_url as $tracker_url ) {
					$this->do_request( $tracker_url . $tracking_request_parameter, $tracking_data_encoded['qua'] );
			}
		}

		return;
	}

	private function do_request( $url, $user_agent_string ) {

		$response = wp_remote_post(
			$url,
			array(
				'method'       => 'GET',
				'timeout'      => 2,
				'httpdversion' => '1.0',
				'blocking'     => false,
				'headers'      => array(
					'cache-control: no-cache',
					'User-Agent: ' . $user_agent_string,
				),
				'body'         => array(),
			)
		);

		if ( is_wp_error( $response ) ) {
			$error_message = $response->get_error_message();
			$this->log_error( 'ERROR: ' . $error_message . ', URL: ' . $this->log_error( $url ) );
		} else {
			return;
		}
	}

	private function parameter_url_encoding( $tracking_data_strings ) {
		/** replaced by new function */
		return Qreuz_Tracking_Datapoints::parameter_url_encoding( $tracking_data_strings );
	}

	private function log_error( $error ) {

		error_log( $error );
		wp_die();
	}

}
