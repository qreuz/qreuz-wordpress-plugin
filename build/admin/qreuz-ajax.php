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

	add_action( 'wp_ajax_qreuz_toolbox_woocommerce', array( $qreuz_ajax, 'qreuz_toolbox_woocommerce' ), 10 );
//}

/**
 * Class to handle ajax requests for Qreuz plugin.
 * 
 */
class Qreuz_Ajax {

	private $ajax_url = "https://auth.qreuz.com";

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
			$response = json_encode( array(
				'response' => [
					'error' => 'error',
					'user' => 'false',
				],
			) );
			wp_die( $response );

		} else {
			/**
			 * Valid ajax request and user allowed to access.
			 */
			if ( false === get_option( 'qreuz_user_data_auth_status' ) || false === get_option( 'qreuz_user_data_token' ) || false === get_option( 'qreuz_user_data_email' ) ) {
				/**
				 * User is not authenticated with the service
				 */
				$response = json_encode( array(
					'response' => [
						'user' => 'false',
					],
				) );
			} else {
				/**
				 * User authenticated with the service according to the WordPress setting.
				 */
				$action             = sanitize_text_field( $_POST['action'] );
				$form               = sanitize_text_field( $_POST['form'] );
				$qreuz_current_time = sanitize_text_field( $_POST['qreuz_current_time'] );

				$postdata = [
					'action'             => $action,
					'form'               => $form,
					'qreuz_current_time' => $qreuz_current_time,
					'token'              => get_option( 'qreuz_user_data_token' ),
					'email'              => get_option( 'qreuz_user_data_email' ),
					'user_email'         => get_option( 'qreuz_user_data_email' ),
					'url'                => Qreuz_Tracking_Datapoints::qreuz_tdp_url( true ),
				];

				$response = $this->prepare_ajax( $postdata );
			}

			wp_die( $response );
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
			$response = json_encode( array(
				'response' => [
					'error' => 'error',
				],
			) );
			wp_die( $response );

		} else {
			/**
			 * Valid ajax request and user allowed to access.
			 */
			if ( false === get_option( 'qreuz_user_data_auth_status' ) || false === get_option( 'qreuz_user_data_token' ) || false === get_option( 'qreuz_user_data_email' ) ) {
				/**
				 * User is not authenticated with the service
				 */
				$response = json_encode( array(
					'response' => [
						'user'  => 'false',
						'error' => 'error',
					],
				) );
			} else {
				/**
				 * User authenticated with the service according to the WordPress setting.
				 */
				$action             = sanitize_text_field( $_POST['action'] );
				$form               = sanitize_text_field( $_POST['form'] );
				$qreuz_current_time = sanitize_text_field( $_POST['qreuz_current_time'] );
				
				$data        = ( isset( $_POST['data'] ) ? sanitize_text_field( $_POST['data'] ) : null );

				$postdata = [
					'action'     => $action,
					'form'     => $form,
					'qreuz_current_time' => $qreuz_current_time,
					'token' => get_option( 'qreuz_user_data_token' ),
					'email' => get_option( 'qreuz_user_data_email' ),
					'url' => Qreuz_Tracking_Datapoints::qreuz_tdp_url( true ),
				];
				if ( null !== $data ) {
					$postdata['data'] = json_decode( stripslashes( $data ), true );
				}

				$response = $this->prepare_ajax( $postdata );
			}

			wp_die( $response );
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
			$response = json_encode( array(
				'response' => [
					'error' => 'error',
				],
			) );
			wp_die( $response );

		} else {
			/**
			 * Valid ajax request and user allowed to access.
			 */
			if ( '1' === get_option( 'qreuz_user_data_auth_status' ) ) {
				/**
				 * User is already authenticated with the service.
				 */
				$response = json_encode( array(
					'response' => [
						'user'  => 'true',
						'error' => 'error',
					],
				) );
				
				$form = false;
			} else {
				/**
				 * User not authenticated, start getstarted process.
				 */
				$action             = sanitize_text_field( $_POST['action'] );
				$form               = sanitize_text_field( $_POST['form'] );
				$qreuz_current_time = sanitize_text_field( $_POST['qreuz_current_time'] );
				
				$data        = ( isset( $_POST['data'] ) ? sanitize_text_field( $_POST['data'] ) : null );

				$postdata = [
					'action'     => $action,
					'form'     => $form,
					'qreuz_current_time' => $qreuz_current_time,
					'url' => Qreuz_Tracking_Datapoints::qreuz_tdp_url( true ),
				];
				if ( null !== $data ) {
					$postdata['data'] = json_decode( stripslashes( $data ), true );
				}

				$response = $this->prepare_ajax( $postdata );
			}

			/**
			 * If current request is for 'Login' or 'Activate' and it was successful, set the corresponding WP options.
			 */
			if ( 'activate' === $form || 'login' === $form ) {
				$response_arr = json_decode( $response, true );
				if ( 'true' === $response_arr['response']['success'] ) {
					/**
					 * Response was ok. Update settings.
					 */
					if ( false === $this->update_wp_settings( $response_arr ) ) {
						$response = json_encode( array(
							'response' => [
								'success'  => 'true',
								'error' => 'true',
								'message' => 'An error occured when we tried to update your WordPress settings.',
							],
						) );
					}
				} else {
					/**
					 * Response was not ok. Don't update settings.
					 */
					$response = json_encode( array(
						'response' => [
							'success'  => 'false',
							'error' => 'true',
							'message' => 'An error occured during signup.',
						],
					) );
				}
			}

			wp_die( $response );
		}
	}

	/**
	 * Set the relevant WP options if required.
	 * 
	 * @param array $response_arr - the JSON decoded array response which holds the required information about the options update
	 * @return bool true | false
	 */
	private function update_wp_settings( $response_arr ) {

		if (isset( $response_arr['response']['token'] ) && isset( $response_arr['response']['qkey'] ) && isset( $response_arr['response']['user_email'] ) ) {
			/**
			 * Update options if the required data is present and correct
			 */
			$option_updated = update_option( 'qreuz_user_data_token', $response_arr['response']['token'] );
			$option_updated = ( $option_updated ? update_option( 'qreuz_user_data_qkey', $response_arr['response']['qkey'] ) : false );
			$option_updated = ( $option_updated ? update_option( 'qreuz_user_data_email', $response_arr['response']['user_email'] ) : false );
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
			$response = json_encode( array(
				'response' => [
					'error' => 'error',
				],
			) );
			wp_die( $response );

		} else {

			$option_updated = false;

			$option_updated = update_option( 'qreuz_user_data_token', '' );
			$option_updated = ( $option_updated ? update_option( 'qreuz_user_data_qkey', '' ) : false );
			$option_updated = ( $option_updated ? update_option( 'qreuz_user_data_email', '' ) : false );
			$option_updated = ( $option_updated ? update_option( 'qreuz_user_data_auth_status', false ) : false );

			$response = json_encode( array( 
				'response' => [
					'success' => 'true',
					'message' => 'Logged out successfully.',
				],
			) );
			
			wp_die( $response );
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
			$response = json_encode( array(
				'response' => [
					'error' => 'error',
				],
			) );
			wp_die( $response );

		} else {

			/**
			 * Get options for tracking settings.
			 */
			$tracking = [
				'qreuz_tracking_visitor_tracking' => get_option( 'qreuz_tracking_visitor_tracking' ),
				'qreuz_tracking_low_budget_tracking' => get_option( 'qreuz_tracking_low_budget_tracking' ),
			];

			/**
			 * Get options for pricing settings.
			 */
			$pricing = [
				'qreuz_smart_pricing_premium_category' => get_option( 'qreuz_smart_pricing_premium_category' ),
				'qreuz_smart_pricing_premium_percent' => get_option( 'qreuz_smart_pricing_premium_percent' ),
				'qreuz_smart_pricing_sale_category' => get_option( 'qreuz_smart_pricing_sale_category' ),
				'qreuz_smart_pricing_sale_percent' => get_option( 'qreuz_smart_pricing_sale_percent' ),
				'qreuz_smart_pricing_price_scheme' => get_option( 'qreuz_smart_pricing_price_scheme' ),
			];

			/**
			 * Get all product categories from WooCommerce.
			 */
			$product_categories = get_terms(
				[
					'taxonomy' => 'product_cat',
					'hide_empty' => false,
				]
			);

			/**
			 * Build product categories array if no WP_Error is thrown.
			 */
			if ( ! is_wp_error( $product_categories ) ) {

				$product_categories_array = [];

				foreach ( $product_categories as $product_category_obj ) {
					$db_row = Qreuz_Database::get_row( 'smart_pricing_prices', 'cat_id', $product_category_obj->term_id ) ?: false;
					$product_categories_array[] = [
						'slug' => $product_category_obj->slug,
						'name' => $product_category_obj->name,
						'term_id' => $product_category_obj->term_id,
						'price' => ( $db_row && '0.00' !== $db_row->price  ? $db_row->price : '' ),
					];
				}
			} else {

				$product_categories_array = false;
			}
	
			$response = json_encode( array(
				'response' => [
					'success'  => true,
					'tracking' => $tracking,
					'pricing'  => $pricing,
					'data' => [
						//
					],
					'static_data' => [
						'woocommerce_currency'    => esc_attr( get_woocommerce_currency() ),
					],
					'qreuz_data' => [
						'woocommerce_product_categories' => $product_categories_array,
					],
				],
			) );

			wp_die( $response );
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
			$response = json_encode( array(
				'response' => [
					'error' => 'error',
				],
			) );
			wp_die( $response );

		} else {

			$data = ( isset( $_POST['data'] ) ? sanitize_text_field( $_POST['data'] ) : null );

			if ( null !== $data ) {
				$postdata['data'] = json_decode( stripslashes( $data ), true );
			}

			$option_updated = [];

			foreach ( $postdata['data']['tracking'] as $option => $value ) {
				$value = ( $value === true ? true : false );
				$option_updated[$option] = update_option( $option, $value );
			}
			foreach ( $postdata['data']['pricing'] as $option => $value ) {
				$value = ( isset($value) ? $value : false );
				$option_updated[$option] = update_option( $option, $value );
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

			$response = json_encode( array(
				'response' => [
					'success'  => true,
					'option_updated'  => $option_updated,
				],
			) );

			wp_die( $response );
		}
	}

	/**
	 * Prepares the AJAX request to be posted.
	 * 
	 * @param array $postdata
	 * @return string JSON response from do_ajax()
	 */
	private function prepare_ajax( $postdata ) {

		$ajax_data = [
			"ua"   => $this->get_user_agent(),
			"body" => $postdata,
		];

		$return = $this->do_ajax( $ajax_data );

		return $return;
	}

	/**
	 * Execute the AJAX request.
	 * 
	 * @param array $ajax_data
	 * @return string JSON format response
	 */
	private function do_ajax( $ajax_data ) {

		$ajax_response = wp_remote_post(
			$this->ajax_url,
			array(
				'method'       => 'POST',
				'timeout'      => 10,
				'httpdversion' => '1.0',
				'blocking'     => true,
				'headers'      => array(
					'cache-control: no-cache',
					'User-Agent: ' . $ajax_data['ua'],
				),
				'body'         => $ajax_data['body'],
			)
		);

		if ( is_wp_error( $ajax_response ) ) {

			$response = json_encode( array(
				'response' => [
					'error' => $ajax_response->get_error_message(),
				],
			) );
		} else {

			$response = wp_remote_retrieve_body( $ajax_response );
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
			$response = json_encode( array(
				'response' => [
					'error' => 'error',
				],
			) );
			wp_die( $response );

		} else {

			$tool = sanitize_text_field( $_POST['form']);
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
				
				$response = json_encode( array(
					'response' => [
						'error' => 'error',
					],
				) ); 
			}

			wp_die( $response );		
		}
	}
	// End class.
}
