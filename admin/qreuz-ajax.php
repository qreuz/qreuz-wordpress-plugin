<?php

/**
 * Exit if accessed directly
 *
 * */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

//if ( is_admin() ) {

$qreuz_ajax = new Qreuz_Ajax();

/**
 * Define available ajax actions.
 *
 */
add_action( 'wp_ajax_qreuz_get_user_data', array( $qreuz_ajax, 'get_user_data' ), 10 );
add_action( 'wp_ajax_qreuz_update_user_data', array( $qreuz_ajax, 'update_user_data' ), 10 );
add_action( 'wp_ajax_qreuz_getstarted', array( $qreuz_ajax, 'getstarted' ), 10 );
add_action( 'wp_ajax_qreuz_logout', array( $qreuz_ajax, 'logout' ), 10 );

add_action( 'wp_ajax_qreuz_get_wp_options', array( $qreuz_ajax, 'get_wp_options' ), 10 );
add_action( 'wp_ajax_qreuz_update_wp_options', array( $qreuz_ajax, 'update_wp_options' ), 10 );

// add_action( 'wp_ajax_qreuz_toolbox_woocommerce', array( $qreuz_ajax, 'qreuz_toolbox_woocommerce' ), 10 );
//}

/**
 * Class to handle ajax requests for Qreuz plugin.
 *
 */
class Qreuz_Ajax {


	private $ajax_url = 'https://auth.qreuz.com';

	/**
	 * Function for wp_ajax_qreuz_get_user_data.
	 *
	 * Gets remote user data for user account.
	 *
	 * @param void
	 * @return void
	 */
	public function get_user_data() {
		if ( ! check_ajax_referer( 'do-ajax-qreuz-admin', '_wpnonce', true ) || ! current_user_can( 'manage_options' ) ) {
			/**
			 *  No valid ajax request or user not allowed to access.
			 */
			$response = array(
				'success' => false,
				'user'    => false,
			);
			wp_die( wp_json_encode( $response ) );
		} else {
			/**
			 * Valid ajax request and user allowed to access.
			 */
			if ( false === get_option( 'qreuz_user_data_auth_status' ) || '0' === get_option( 'qreuz_user_data_auth_status' ) || '' === get_option( 'qreuz_user_data_auth_status' ) || false === get_option( 'qreuz_user_data_toqen' ) || false === get_option( 'qreuz_user_data_email' ) ) {
				/**
				 * User is not authenticated with the service
				 */
				$response = array(
					'success' => false,
					'user'    => false,
				);
			} else {
				/**
				 * User authenticated with the service according to the WordPress setting.
				 */
				$action             = sanitize_text_field( $_POST['action'] );
				$form               = sanitize_text_field( $_POST['form'] );
				$qreuz_current_time = sanitize_text_field( $_POST['qreuz_current_time'] );

				$postdata = array(
					'action'             => $action,
					'form'               => $form,
					'qreuz_current_time' => $qreuz_current_time,
					'toqen'              => get_option( 'qreuz_user_data_toqen' ),
					'qkey'               => get_option( 'qreuz_user_data_qkey' ),
					'email'              => get_option( 'qreuz_user_data_email' ),
					'url'                => Qreuz_Tracking_Datapoints::qreuz_tdp_url( 'pure' ),
				);

				$endpoint = '/user/get';

				$response = $this->prepare_ajax( $postdata, $endpoint );

				$response['user'] = true;
			}

			wp_die( wp_json_encode( $response ) );
		}
	}

	/**
	 * Function to update the user's data.
	 *
	 * @param void
	 * @return string success | error
	 */
	public function update_user_data() {
		if ( ! check_ajax_referer( 'do-ajax-qreuz-admin', '_wpnonce', true ) || ! current_user_can( 'manage_options' ) ) {
			/**
			 *  No valid ajax request or user not allowed to access.
			 */
			$response = array(
				'success' => false,
			);
			wp_die( wp_json_encode( $response ) );
		} else {
			/**
			 * Valid ajax request and user allowed to access.
			 */
			if ( false === get_option( 'qreuz_user_data_auth_status' ) || '0' === get_option( 'qreuz_user_data_auth_status' ) || '' === get_option( 'qreuz_user_data_auth_status' ) || false === get_option( 'qreuz_user_data_toqen' ) || false === get_option( 'qreuz_user_data_email' ) ) {
				/**
				 * User is not authenticated with the service
				 */
				$response = array(
					'success' => false,
					'user'    => false,
				);
			} else {
				/**
				 * User authenticated with the service according to the WordPress setting.
				 */
				$action             = sanitize_text_field( $_POST['action'] );
				$form               = sanitize_text_field( $_POST['form'] );
				$qreuz_current_time = sanitize_text_field( $_POST['qreuz_current_time'] );

				$data = ( isset( $_POST['data'] ) ? sanitize_text_field( $_POST['data'] ) : null );

				$postdata = array(
					'action'             => $action,
					'form'               => $form,
					'qreuz_current_time' => $qreuz_current_time,
					'toqen'              => get_option( 'qreuz_user_data_toqen' ),
					'qkey'               => get_option( 'qreuz_user_data_qkey' ),
					'email'              => get_option( 'qreuz_user_data_email' ),
					'url'                => Qreuz_Tracking_Datapoints::qreuz_tdp_url( 'pure' ),
				);
				if ( null !== $data ) {
					$postdata['data'] = json_decode( stripslashes( $data ), true );
				}

				$endpoint = '/user/update';

				$response = $this->prepare_ajax( $postdata );
			}

			wp_die( wp_json_encode( $response ) );
		}
	}

	/**
	 * Function to handle the getstarted process.
	 *
	 * @param void
	 * @return string success | error
	 */
	public function getstarted() {
		if ( ! check_ajax_referer( 'do-ajax-qreuz-admin', '_wpnonce', true ) || ! current_user_can( 'manage_options' ) ) {
			/**
			 *  No valid ajax request or user not allowed to access.
			 */
			$response = array(
				'success' => false,
			);
			wp_die( wp_json_encode( $response ) );
		} else {
			/**
			 * Valid ajax request and user allowed to access.
			 */
			if ( '1' === get_option( 'qreuz_user_data_auth_status' ) ) {
				/**
				 * User is already authenticated with the service.
				 */
				$response = array(
					'success' => true,
					'user'    => true,
				);

				$form = false;
			} else {
				/**
				 * User not authenticated, start getstarted process.
				 */
				$action             = sanitize_text_field( $_POST['action'] );
				$form               = sanitize_text_field( $_POST['form'] );
				$qreuz_current_time = sanitize_text_field( $_POST['qreuz_current_time'] );

				$data = ( isset( $_POST['data'] ) ? sanitize_text_field( rawurldecode( $_POST['data'] ) ) : null );

				if ( null !== $data ) {
					$data = json_decode( stripslashes( $data ), true );

					$postdata = array(
						'action'             => $action,
						'form'               => $form,
						'email'              => $data['user_email'],
						'qreuz_current_time' => $qreuz_current_time,
						'url'                => Qreuz_Tracking_Datapoints::qreuz_tdp_url( 'pure' ),
					);

					switch ( $form ) {
						case 'getstarted':
							$endpoint = '/signup/initial';
							break;
						case 'activate':
							$postdata['auth_key'] = rawurldecode( $data['auth_key'] );
							/** Get peppered password to avoid sending the full password */
							$pass_peppered        = hash_hmac( 'sha512', $data['user_password'], 'qreuz_pepper' );
							$postdata['password'] = $pass_peppered;
							$endpoint             = '/signup/final';
							break;
						case 'wp_plugin_check_auth_key':
							$postdata['auth_key'] = rawurldecode( $data['auth_key'] );
							$endpoint             = '/authkey';
							break;
						case 'login':
							/** Get peppered password to avoid sending the full password */
							$pass_peppered        = hash_hmac( 'sha512', $data['user_password'], 'qreuz_pepper' );
							$postdata['password'] = $pass_peppered;
							$endpoint             = '/login';
							break;
						default:
							$endpoint = false;
							break;
					}

					if ( false !== $endpoint ) {
						$response = $this->prepare_ajax( $postdata, $endpoint );
					} else {
						$response = array(
							'success' => false,
						);
					}
				} else {
					$response = array(
						'success' => false,
					);
				}
			}

			/**
			 * If current request is for 'Login' or 'Activate' and it was successful, set the corresponding WP options.
			 */
			if ( 'activate' === $form || 'login' === $form ) {

				if ( true === $response['success'] ) {
					/**
					 * Response was ok. Update settings.
					 */
					if ( false === $this->update_wp_settings( $response ) ) {
						$response['success'] = false;
						$response['msg']     = 'An error occured when we tried to update your WordPress settings.';
					}
				} else {
					/**
					 * Response was not ok. Don't update settings.
					 */
					$response['success'] = false;
					$response['msg']     = 'An error occured during signin.';
				}
			}

			wp_die( wp_json_encode( $response ) );
		}
	}

	/**
	 * Set the relevant WP options if required.
	 *
	 * @param array $response_arr - the JSON decoded array response which holds the required information about the options update
	 * @return bool true | false
	 */
	private function update_wp_settings( $response_arr ) {

		/**
		 * Compatibility with previous version.
		 */
		if ( ! isset( $response_arr['toqen'] ) ) {
			if ( isset( $response_arr['token'] ) ) {
				$response_arr['toqen'] = $response_arr['token'];
			}
		}

		if ( isset( $response_arr['toqen'] ) && isset( $response_arr['qkey'] ) && isset( $response_arr['email'] ) ) {
			/**
			 * Update options if the required data is present and correct
			 */
			delete_option( 'qreuz_user_data_toqen' );
			delete_option( 'qreuz_user_data_qkey' );
			delete_option( 'qreuz_user_data_email' );
			delete_option( 'qreuz_user_data_auth_status' );

			$option_updated = update_option( 'qreuz_user_data_toqen', $response_arr['toqen'] );
			$option_updated = ( $option_updated ? update_option( 'qreuz_user_data_qkey', $response_arr['qkey'] ) : false );
			$option_updated = ( $option_updated ? update_option( 'qreuz_user_data_email', $response_arr['email'] ) : false );
			$option_updated = ( $option_updated ? update_option( 'qreuz_user_data_auth_status', true ) : false );
		} else {
			/**
			 * Required data was not present.
			 */

			$option_updated = false;
		}

		return $option_updated;
	}

	/**
	 * Set the relevant WP options to log out from service.
	 *
	 * @param void
	 * @return void wp_die()
	 */
	public function logout() {
		if ( ! check_ajax_referer( 'do-ajax-qreuz-admin', '_wpnonce', true ) || ! current_user_can( 'manage_options' ) ) {
			/**
			 *  No valid ajax request or user not allowed to access.
			 */
			$response = array(
				'success' => false,
			);
			wp_die( wp_json_encode( $response ) );
		} else {

			$option_updated = false;

			$option_updated = update_option( 'qreuz_user_data_toqen', '' );
			$option_updated = ( $option_updated ? update_option( 'qreuz_user_data_qkey', '' ) : false );
			$option_updated = ( $option_updated ? update_option( 'qreuz_user_data_email', '' ) : false );
			$option_updated = ( $option_updated ? update_option( 'qreuz_user_data_auth_status', false ) : false );

			$response = array(
				'success' => true,
				'msg'     => 'Logged out successfully.',
			);

			wp_die( wp_json_encode( $response ) );
		}
	}

	/**
	 * Get the local WordPress options.
	 *
	 * @param void
	 * @return void wp_die()
	 */
	public function get_wp_options() {
		if ( ! check_ajax_referer( 'do-ajax-qreuz-admin', '_wpnonce', true ) || ! current_user_can( 'manage_options' ) ) {
			/**
			 *  No valid ajax request or user not allowed to access.
			 */
			$response = array(
				'success' => false,
			);
			wp_die( wp_json_encode( $response ) );
		} else {

			/**
			 * Get options for tracking settings.
			 */
			$tracking = array(
				'qreuz_tracking_method' => get_option( 'qreuz_tracking_method' ),
			);

			/**
			 * Get options for pricing settings.
			 */
			$pricing = array(
				'qreuz_smart_pricing_premium_category' => get_option( 'qreuz_smart_pricing_premium_category' ),
				'qreuz_smart_pricing_premium_percent'  => get_option( 'qreuz_smart_pricing_premium_percent' ),
				'qreuz_smart_pricing_sale_category'    => get_option( 'qreuz_smart_pricing_sale_category' ),
				'qreuz_smart_pricing_sale_percent'     => get_option( 'qreuz_smart_pricing_sale_percent' ),
				'qreuz_smart_pricing_price_scheme'     => get_option( 'qreuz_smart_pricing_price_scheme' ),
			);

			/**
			 * Get all product categories from WooCommerce.
			 */
			$product_categories = get_terms(
				array(
					'taxonomy'   => 'product_cat',
					'hide_empty' => false,
				)
			);

			/**
			 * Build product categories array if no WP_Error is thrown.
			 */
			if ( ! is_wp_error( $product_categories ) ) {

				$product_categories_array = array();

				foreach ( $product_categories as $product_category_obj ) {

					$db_row = Qreuz_Database::get_row( 'smart_pricing_prices', 'cat_id', $product_category_obj->term_id ) ?: false;

					$product_categories_array[ $product_category_obj->term_id ] = array(
						'slug'    => $product_category_obj->slug,
						'name'    => $product_category_obj->name,
						'term_id' => $product_category_obj->term_id,
						'price'   => ( $db_row && '0.00' !== $db_row->price ? $db_row->price : '' ),
					);
				}
			} else {

				$product_categories_array = false;
			}

			$response = array(
				'success'     => true,
				'tracking'    => $tracking,
				'pricing'     => $pricing,
				'data'        => array(),
				'woocommerce' => array(
					'woocommerce_currency' => ( function_exists( 'get_woocommerce_currency' ) ? esc_attr( get_woocommerce_currency() ) : '' ),
				),
				'qreuz_data'  => array(
					'woocommerce_product_categories' => $product_categories_array,
				),
			);

			wp_die( wp_json_encode( $response ) );
		}
	}

	/**
	 * Update the local WordPress options.
	 *
	 * @param void
	 * @return void wp_die()
	 */
	public function update_wp_options() {
		if ( ! check_ajax_referer( 'do-ajax-qreuz-admin', '_wpnonce', true ) || ! current_user_can( 'manage_options' ) ) {
			/**
			 *  No valid ajax request or user not allowed to access.
			 */
			$response = array(
				'success' => false,
			);
			wp_die( wp_json_encode( $response ) );
		} else {

			$data = ( isset( $_POST['data'] ) ? sanitize_text_field( $_POST['data'] ) : null );

			if ( null !== $data ) {
				$postdata['data'] = json_decode( stripslashes( $data ), true );
			}

			$option_updated = array();

			foreach ( $postdata['data']['tracking'] as $option => $value ) {
				$value                     = ( isset( $value ) ? $value : false );
				$option_updated[ $option ] = update_option( $option, $value );
			}
			foreach ( $postdata['data']['pricing'] as $option => $value ) {
				$value                     = ( isset( $value ) ? $value : false );
				$option_updated[ $option ] = update_option( $option, $value );
			}
			foreach ( $postdata['data']['qreuz_data'] as $option => $value ) {
				switch ( $option ) {
					case 'woocommerce_product_categories':
						/**
						 * Update price levels for WooCommerce product categories.
						 */
						$pricing_instance = new Qreuz_Smart_Pricing();
						$pricing_instance->update_prices_in_db( $value );
						break;
				}
			}

			$response = array(
				'success'        => true,
				'option_updated' => $option_updated,
			);

			wp_die( wp_json_encode( $response ) );
		}
	}

	/**
	 * Prepares the AJAX request to be posted.
	 *
	 * @param array $postdata
	 * @param string $endpoint
	 * @return array API response from do_ajax()
	 */
	private function prepare_ajax( $postdata, $endpoint ) {

		$ajax_data = array(
			'ua'   => $this->get_user_agent(),
			'body' => $postdata,
		);

		$return = $this->do_ajax( $ajax_data, $endpoint );

		return $return;
	}

	/**
	 * Execute the AJAX request.
	 *
	 * @param array $ajax_data
	 * @param string $endpoint
	 * @return array API $response
	 */
	private function do_ajax( $ajax_data, $endpoint ) {

		$ajax_response = wp_remote_post(
			$this->ajax_url . $endpoint,
			array(
				'method'       => 'POST',
				'timeout'      => 10,
				'httpdversion' => '1.0',
				'blocking'     => true,
				'headers'      => array(
					'cache-control: no-cache',
					'Content-type: application/x-www-form-urlencoded',
					'User-Agent: ' . $ajax_data['ua'],
				),
				'body'         => $ajax_data['body'],
			)
		);

		if ( is_wp_error( $ajax_response ) ) {

			$response = array(
				'success' => false,
				'msg'     => $ajax_response->get_error_message(),
			);
		} else {

			$json_response = wp_remote_retrieve_body( $ajax_response );
			$response      = json_decode( $json_response, true );
		}

		return $response;
	}

	/**
	 * Get the user agent for the current user.
	 *
	 * @param void
	 * @return string
	 */
	private function get_user_agent() {
		return sanitize_text_field( $_SERVER['HTTP_USER_AGENT'] );
	}

	/**
	 * Ajax init WooCommerce Toolbox functions.
	 *
	 * @param void
	 * @return void wp_die()
	 */
	public function qreuz_toolbox_woocommerce() {
		if ( ! check_ajax_referer( 'do-ajax-qreuz-admin', '_wpnonce', true ) || ! current_user_can( 'manage_options' ) ) {
			/**
			 *  No valid ajax request or user not allowed to access.
			 */
			$response = array(
				'success' => false,
			);
			wp_die( wp_json_encode( $response ) );
		} else {

			$tool = sanitize_text_field( $_POST['form'] );
			$data = ( isset( $_POST['data'] ) ? sanitize_text_field( $_POST['data'] ) : null );

			if ( null !== $data ) {
				$postdata['data'] = json_decode( stripslashes( $data ), true );
			}

			if ( isset( $tool ) && null !== $tool ) {

				switch ( $tool ) {
					case 'woocommerce_sync_customer_orders':
						$response = Qreuz_Toolbox_Woocommerce::sync_customer_orders();
				}
			} else {

				$response = array(
					'success' => false,
				);
			}

			wp_die( wp_json_encode( $response ) );
		}
	}
	// End class.
}
