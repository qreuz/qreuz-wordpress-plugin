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

		echo '<h1><svg version="1.1" style="width:100px;height:50px;margin:0 0 0 1em;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"width="2529.497px" height="590.599px" viewBox="448.818 1122.05 2529.497 590.599"enable-background="new 448.818 1122.05 2529.497 590.599" xml:space="preserve"><g id="Layer_1"><path fill="#FFFFFF" d="M2282.472,1712.6c-127.787-0.156-231.34-103.709-231.496-231.496v-344.881c0-7.828,6.346-14.174,14.173-14.174h94.488c7.828,0,14.174,6.346,14.174,14.174v344.881c0,60.013,48.648,108.662,108.661,108.662c60.012,0,108.661-48.649,108.661-108.662v-344.881c0-7.828,6.346-14.174,14.174-14.174h94.488c7.827,0,14.172,6.346,14.172,14.174v344.881C2513.811,1608.891,2410.258,1712.444,2282.472,1712.6z"/><path fill="#FFFFFF" d="M1596.33,1712.6c-7.828,0-14.173-6.345-14.173-14.173v-562.204c0-7.828,6.345-14.174,14.173-14.174h387.401c7.827,0,14.173,6.346,14.173,14.174v94.487c0,7.828-6.346,14.174-14.173,14.174h-278.739v111.023h278.739c7.827,0,14.173,6.346,14.173,14.173v94.488c0,7.828-6.346,14.174-14.173,14.174h-278.739v111.023h278.739c7.827,0,14.173,6.346,14.173,14.173v94.488c0,7.828-6.346,14.173-14.173,14.173H1596.33z"/><path fill="#FFFFFF" d="M820.252,1712.6c-5.252-0.006-10.069-2.914-12.52-7.559L684.33,1472.129c-3.652-6.924-1.002-15.497,5.922-19.149c2.033-1.073,4.298-1.636,6.598-1.639h106.3c5.241-0.003,10.056,2.886,12.52,7.512l33.496,62.646c16.212-24.613,24.853-53.44,24.851-82.914v-42.52c0-83.495-67.687-151.181-151.182-151.181s-151.181,67.686-151.181,151.181v42.52c0.169,59.107,34.645,112.738,88.347,137.434c2.836,1.308,5.162,3.517,6.613,6.283l57.496,109.229c3.653,6.923,1.002,15.496-5.921,19.149c-2.034,1.073-4.299,1.635-6.599,1.638h-0.614c-146.726-6.015-262.483-126.883-262.157-273.732v-42.52c0-151.335,122.682-274.016,274.016-274.016c151.335,0,274.016,122.681,274.016,274.016v42.52c-0.072,75.487-31.283,147.602-86.268,199.323l28.347,53.905c3.653,6.923,1.002,15.497-5.921,19.149c-2.049,1.081-4.33,1.644-6.646,1.638H820.252z"/><path fill="#FFFFFF" d="M1408.819,1712.6c-5.252-0.006-10.069-2.914-12.52-7.559l-119.103-226.299h-114.142v219.685c0,7.828-6.346,14.173-14.174,14.173h-94.488c-7.827,0-14.173-6.345-14.173-14.173v-562.204c0-7.828,6.346-14.174,14.173-14.174h270.473c98.473-0.085,178.368,79.674,178.453,178.146c0.058,67.189-37.662,128.707-97.571,159.129l122.362,232.535c3.653,6.924,1.002,15.497-5.921,19.15c-2.034,1.073-4.299,1.635-6.599,1.638L1408.819,1712.6z M1324.865,1355.908c30.658,0,55.512-24.854,55.512-55.512s-24.854-55.512-55.512-55.512h-161.811v111.023H1324.865z"/><path fill="#FFFFFF" d="M2964.141,1122.05h-383.764c-7.828,0-14.174,6.346-14.174,14.174v94.487c0,7.828,6.346,14.174,14.174,14.174h241.37l-252.851,347.669c-1.751,2.419-2.693,5.329-2.693,8.315v97.559c0,7.828,6.346,14.173,14.174,14.173h201.768v-122.834h-59.326l252.803-347.622c1.751-2.419,2.693-5.329,2.693-8.315v-97.605C2978.315,1128.395,2971.969,1122.05,2964.141,1122.05z"/><path fill="#FFFFFF" d="M2869.653,1589.721h94.488c7.828,0,14.174,6.348,14.174,14.177v94.523c0,7.831-6.346,14.179-14.174,14.179h-94.488c-7.828,0-14.174-6.348-14.174-14.179v-94.523C2855.479,1596.069,2861.824,1589.721,2869.653,1589.721z"/><path fill="#FFFFFF" d="M2698.653,1589.721h94.488c7.828,0,14.174,6.348,14.174,14.177v94.523c0,7.831-6.346,14.179-14.174,14.179h-94.488c-7.828,0-14.174-6.348-14.174-14.179v-94.523C2684.479,1596.069,2690.824,1589.721,2698.653,1589.721z"/></g></svg></h1>';
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
		echo '<a href="https://qreuz.com" target="_blank" style="text-decoration:none;">Qreuz</a>. Data your business.';
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
