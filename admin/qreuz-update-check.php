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
 * doing update checks
 */
Qreuz_Update_Check::check_db_version();


/**
 * class Qreuz_Update_Check
 */
class Qreuz_Update_Check {

	/**
	 * checks if the current DB version is up to date
	 * @param void
	 * @return void
	 */
	public static function check_db_version() {

		if ( is_admin() && current_user_can( 'manage_options' ) ) {

			if ( get_site_option( 'qreuz_db_version' ) !== QREUZ_PLUGINVERSION ) {
				Qreuz_Database::init_dbs();
			}

		}
	}
}
