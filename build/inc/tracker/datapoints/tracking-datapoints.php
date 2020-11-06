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
class Qreuz_Tracking_Datapoints {

	/**
	 * Returns the url of the current page view.
	 * 
	 * @param mixed $baseurl
	 * @return string
	 */
	public static function qreuz_tdp_url( $baseurl = false ) {

		if ( true === $baseurl ) {
			$url = esc_url_raw( ( isset( $_SERVER['HTTPS'] ) ? 'https' : 'http' ) . "://$_SERVER[HTTP_HOST]" );
		} elseif ( 'pure' === $baseurl )  {
			$url = esc_url_raw( $_SERVER['HTTP_HOST'] );
		} else {
			$url = esc_url_raw( ( isset( $_SERVER['HTTPS'] ) ? 'https' : 'http' ) . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]" );
		}

		return $url;
	}

	/**
	 * get the user agent for the current user
	 * @param void
	 * @return string
	 */
	public static function qreuz_tdp_user_agent() {

		return sanitize_text_field( $_SERVER['HTTP_USER_AGENT'] );

	}

	/**
	 * get the ip of the server
	 * @param void
	 * @return string
	 */
	public static function qreuz_tdp_server_ip() {

		$ip = esc_url_raw( $_SERVER['SERVER_ADDR'] );

		return $ip;
	}

	/**
	 * get the IP of the user in an anonymized format
	 * @param void
	 * @return array
	 */
	public static function qreuz_tdp_ip() {

		if ( ! empty( $_SERVER['HTTP_CLIENT_IP'] ) ) {
			$ip = esc_url_raw( $_SERVER['HTTP_CLIENT_IP'] );
		} elseif ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
			$ip = esc_url_raw( $_SERVER['HTTP_X_FORWARDED_FOR'] );
		} else {
			$ip = esc_url_raw( $_SERVER['REMOTE_ADDR'] );
		}

		$ip = str_replace( array( 'http://', 'https://' ), '', $ip );

		$return['hip'] = crc32( str_pad( $ip, 32, wp_salt(), STR_PAD_BOTH ) );

		$aip_array = explode( '.', $ip, 4 );
		$aip_array[3] = '0';
		$return['aip'] = implode( '.', $aip_array );

		return $return;
	}

	/**
	 * get the referrer for the current page view
	 * @param void
	 * @return string
	 */
	public static function qreuz_tdp_referrer() {

		$ref = '';
		if ( isset( $_SERVER['HTTP_REFERER'] ) ) {
			$ref = esc_url_raw( $_SERVER['HTTP_REFERER'] );
		}
		return $ref;
	}

	/**
	 * get custom dimensions for the current page view
	 * @param void
	 * @return void
	 */
	public static function qreuz_tdp_custom_dimensions() {

		/**
		* tbd

		return $qreuz_tdp_tracking_data;*/
	}

	/**
	 * prepares elements of an array to be posted in an url
	 * @param array $data
	 * @return array
	 */
	public static function parameter_url_encoding( $data ) {

		$encoded_data_strings = array();

		foreach ( $data as $key => $parameter ) {
			$encoded_data_strings[ $key ] = (string) mb_convert_encoding( $parameter, 'UTF-8', mb_detect_encoding( $parameter ) );
			$encoded_data_strings[ $key ] = rawurlencode( $encoded_data_strings[ $key ] );
		}
		
		return $encoded_data_strings;
	}

}
