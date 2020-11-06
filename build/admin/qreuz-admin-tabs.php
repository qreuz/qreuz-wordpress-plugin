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
 * adding AJAX actions
 */

$obj_qreuz_smart_pricing = new Qreuz_Smart_Pricing();
add_action( 'wp_ajax_qreuz_do_synchronize_prices', array( $obj_qreuz_smart_pricing, 'qreuz_update_prices_init' ), 10 );

/**
 * Class for Qreuz plugin admin tab content
 * 
 */
class Qreuz_Admin_Tabs {

	/**
	 * Load Qreuz admin pages content
	 * 
	 * @param void
	 * @return void
	 * */
	public function qreuz_wp_admin_pages() {

		if ( ! current_user_can( 'manage_options' ) ) {

			wp_die();
		}

		$page = sanitize_text_field( $_GET['page'] );

		global $qreuz_integrations;

		/**
		 * Load pageblock: preheader (wrapper)
		 * */
		$this->load_pageblock_preheader();
		echo '<h1 style="visibility:hidden;display:none;"></h1>'; // load hidden h1 element to fix spacing

		/**
		 * Load pageblock: header
		 * */
		$this->load_pageblock_header( $page );

		$redirect = rawurlencode( remove_query_arg( 'notice', $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] ) );

		/**
		 * Load pageblock: content
		 * */
		$this->load_pageblock_content();

		/**
		 * Load pageblock: footer
		 * */
		$this->load_pageblock_footer();
	}

	/**
	 * Loading the preheader (wrapper).
	 * 
	 * @param void
	 * @return void
	 */
	private function load_pageblock_preheader() {

		echo "<div class='wrap qreuz-wrapper qreuz'>";
	}

	/**
	 * Loading the page header.
	 * 
	 * @param string $page
	 * @return void
	 */
	private function load_pageblock_header( $page ) {

		$baseurl = remove_query_arg( 'notice', esc_url_raw( $_SERVER['REQUEST_URI'] ) );

		echo '<div class="qreuz_admin_header">';

		echo '<h1><img src="' . esc_attr( plugins_url( 'qreuz/assets/img/qreuz-full-white.svg' ) ) . '" alt="Qreuz" /></h1>';
	}

	/**
	 * Loading the description block.
	 * 
	 * @param string $text
	 * @return void
	 */
	private function load_pageblock_description( $text ) {

		if ( $text ) {

			echo '<div class="qreuz_admin_pb_description">';
			echo '<p>';

			echo $text;

			echo '</p>';
			echo '</div>';
		}
	}

	/**
	 * Loading the main content block.
	 * 
	 * @param void
	 * @return void
	 */
	private function load_pageblock_content() {

		echo '<div id="qreuz_admin_pb_content"></div>';
	}

	/**
	 * Loading the page footer.
	 * 
	 * @param void
	 * @return void
	 */
	private function load_pageblock_footer() {

		echo '<div class="qreuz_admin_footer">';
		echo '<p>';
		echo '<a href="https://qreuz.com" target="_blank" style="text-decoration:none;">Qreuz</a>. Made with passion in Berlin.';
		echo '</p>';
		echo '</div>';

		echo '</div>'; // close wrapper div

	}

	/**
	 * Loading admin notices.
	 * 
	 * @param void
	 * @return void
	 */
	public function admin_notice_construct() {

		if ( ! current_user_can( 'manage_options' ) ) {

			return;
			
		} else {
			
			if ( isset( $_GET['notice'] ) ) {
				switch ( sanitize_text_field( $_GET['notice'] ) ) {
					case ( 'saved' ):
						$notice = 'Saved';
						$type   = 'notice-success';
						break;
					case ( 'deleted' ):
						$notice = 'Deleted';
						$type   = 'notice-warning';
						break;
					case ( 'failed' ):
						$notice = 'Failed';
						$type   = 'notice-error';
						break;
					case ( 'info' ):
						$notice = 'INFO';
						$type   = 'notice-info';
						break;
					default:
						$notice = false;
				}
			} elseif ( isset( $_GET['settings-updated'] ) ) {
				switch ( sanitize_text_field( $_GET['settings-updated'] ) ) {
					case ( 'true' ):
						$notice = 'Saved';
						$type   = 'notice-success';
						break;
					default:
						$notice = false;
				}
			} else {
				return;
			}
	
			if ( $notice ) {
				add_action(
					'all_admin_notices',
					function() use ( $notice, $type ) {
						$this->admin_notice_render( $notice, $type );
					},
					10
				);
			}
		}
	}

	/**
	 * Rendering admin notices.
	 * 
	 * @param string $notice
	 * @param string $type
	 * @return void
	 */
	private function admin_notice_render( $notice, $type ) {

		echo '<div class="notice ' . esc_attr( $type ) . ' is-dismissible qreuz-notice">
		<p>' . esc_html( $notice ) . '</p></div>';

	}

	// End class.
}
