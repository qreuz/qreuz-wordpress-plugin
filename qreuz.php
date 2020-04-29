<?php
/*
 * Plugin Name: Qreuz
 * Plugin URI: https://qreuz.com/qreuz-wordpress-plugin/
 * Description: Qreuz enables tracking, analytics, and marketing automation on your WordPress website. Helping you to grow and sustain.
 * Version: 1.1.0
 * Author: Qreuz GmbH
 * Author URI:  https://qreuz.com
 * License: GPL v3 or later
 * Copyright: Qreuz GmbH <https://qreuz.com>
 */

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
 * define constants
 */
define( 'QREUZ_PLUGINVERSION', '1.1.0' );
define( 'QREUZ_PLUGINPATH', plugin_dir_path( __FILE__ ) );
define( 'QREUZ_PLUGINURL', plugin_dir_url( __FILE__ ) );
define( 'QREUZ_PLUGINFILE', __FILE__ );

/**
 * load plugin files
 */
require QREUZ_PLUGINPATH . '/inc/functions.php';
