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

class Qreuz_Tracker_Events {
	public function __construct() {
		/** */
	}

	public function qreuz_track_event( $event_action, $event_label = null, $event_value = null, $product_data = null ) {
		$qreuz_tracker_instance                      = new Qreuz_Tracker();
		$qreuz_tracker_instance->tracking_parameters = array();

		$qreuz_tracker_instance->tracking_parameters['qtt'] = 'ev';
		//$qreuz_tracker_instance->tracking_parameters['ec'] = $event_category;
		$qreuz_tracker_instance->tracking_parameters['qea'] = $event_action;
		//$qreuz_tracker_instance->tracking_parameters['el'] = $event_label;
		$qreuz_tracker_instance->tracking_parameters['qev'] = $event_value;
		$qreuz_tracker_instance->tracking_parameters['qev'] = $event_value;

		foreach ( $product_data as $product_data_key => $product_data_data ) {
			$qreuz_tracker_instance->tracking_parameters[ $product_data_key ] = $product_data_data;
		}

		$qreuz_tracker_instance->qreuz_prepare_request();

		$qreuz_tracker_instance->qreuz_tracker_push( $qreuz_tracker_instance->tracking_parameters );
		$qreuz_tracker_instance->tracking_parameters = array();

		return;
	}

	public function qreuz_track_transaction( $transaction_data ) {
		$qreuz_tracker_instance                      = new Qreuz_Tracker();
		$qreuz_tracker_instance->tracking_parameters = array();

		$qreuz_tracker_instance->tracking_parameters['qtt'] = 'tr';
		//$qreuz_tracker_instance->tracking_parameters['ec'] = $event_category;
		// $qreuz_tracker_instance->tracking_parameters['qea'] = 'purchase';
		//$qreuz_tracker_instance->tracking_parameters['el'] = $event_label;
		//$qreuz_tracker_instance->tracking_parameters['qev'] = $event_value;

		foreach ( $transaction_data as $transaction_data_key => $transaction_data_data ) {
			$qreuz_tracker_instance->tracking_parameters[ $transaction_data_key ] = $transaction_data_data;
		}

		$qreuz_tracker_instance->qreuz_prepare_request();

		$qreuz_tracker_instance->qreuz_tracker_push( $qreuz_tracker_instance->tracking_parameters );
		$qreuz_tracker_instance->tracking_parameters = array();

		return;
	}

}
