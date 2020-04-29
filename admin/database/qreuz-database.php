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
 * Database functions for the Qreuz plugin
 */
class Qreuz_Database {

	/**
	 * initialize the database action
	 * @param void
	 * @return void
	 */
	public static function init_dbs() {

		/**
		 * initialize DB for:
		 * Qreuz Smart Prices
		 */
		self::setup_db(
			'smart_pricing_prices',
			array(
				//'id'     => "mediumint(9) NOT NULL AUTO_INCREMENT",
				'cat_id' => "mediumint(9) NOT NULL",
				'price'  => "decimal(6,2) NULL",
			),
			'cat_id',
			QREUZ_PLUGINVERSION
		);
	}

	/**
	 * retrieves a row from the database
	 * @param string $db_name
	 * @param string $search_col
	 * @param string $search_val
	 * @return array
	 */
	public static function get_row( $db_name, $search_col, $search_val ) {

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die();
		}

		global $wpdb;

		$table_name = $wpdb->prefix . 'qreuz_' . $db_name;

		$row = $wpdb->get_row( "SELECT * FROM $table_name WHERE $search_col=$search_val" );

		return $row;
	}

	/**
	 * retrieves results from database
	 * @param string $db_name
	 * @param string $result
	 * @param string $search_col
	 * @param string $search_condition
	 * @param string $search_val
	 * @return array
	 */
	public static function get_results( $db_name, $result, $search_col = null, $search_condition = null, $search_val = null ) {

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die();
		}

		global $wpdb;

		$table_name = $wpdb->prefix . 'qreuz_' . $db_name;

		if ( isset( $search_col ) && 'isnot' === $search_condition ) {
			$query = "SELECT * FROM $table_name WHERE $search_col NOT IN ( $search_val )";
		} elseif ( isset( $search_col ) && 'is' === $search_condition ) {
			$query = "SELECT * FROM $table_name WHERE $search_col LIKE ( $search_val )";
		} else {
			$query = "SELECT * FROM $table_name";
		}

		$results = $wpdb->get_results( $query );

		return $results;
	}

	/**
	 * insert data to a column in the database
	 * @param string $db_name
	 * @param array $data
	 * @param string $col01
	 * @param string $col02
	 * @return void
	 */
	public static function insert_data_2col( $db_name, $data, $col01, $col02 = null ) {

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die();
		}

		global $wpdb;

		$table_name = $wpdb->prefix . 'qreuz_' . $db_name;

		foreach ( $data as $key => $value ) {

			$sql = "INSERT INTO $table_name ($col01, $col02) VALUES (%d, %s) ON DUPLICATE KEY UPDATE $col02 = %s";

			$wpdb->query(
				$wpdb->prepare( $sql, $key, $value, $value )
			);

		}
	}

	/**
	 * setup the database for the Qreuz plugin
	 * @param string $db_name
	 * @param array $fields
	 * @param string $primary_key
	 * @param string $version
	 * @return void
	 */
	private static function setup_db( $db_name, $fields, $primary_key, $version ) {

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die();
		}

		global $wpdb;

		$current_db_version = get_option( 'qreuz_db_version' );

		$table_name = $wpdb->prefix . 'qreuz_' . $db_name;

		if ( $version !== $current_db_version || self::does_table_exist( $table_name ) ) {

			$charset_collate = $wpdb->get_charset_collate();

			$db_setup_query = '';
			foreach ( $fields as $key => $value ) {
				$db_setup_query .= $key . ' ' . $value . ',';
			}

			$sql = "CREATE TABLE $table_name (
				$db_setup_query
				PRIMARY KEY  ($primary_key)
				) $charset_collate;";

			require_once ABSPATH . 'wp-admin/includes/upgrade.php';
			dbDelta( $sql );

		}

		/**
		 * check if table has really been created
		 */
		if ( self::does_table_exist( $table_name ) ) {
			update_option( 'qreuz_db_version', $version );
		} else {
			update_option( 'qreuz_db_version', 'FAILED' );
		}

	}

	/**
	 * checks if the table already exists
	 * @param string $table_name
	 * @return bool
	 */
	private static function does_table_exist( $table_name ) {

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die();
		}

		global $wpdb;

		$does_table_exist = $wpdb->get_var( "SHOW TABLES LIKE '$table_name'" ) === $table_name ? true : false;

		return $does_table_exist;
	}
}
