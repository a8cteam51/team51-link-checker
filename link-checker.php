<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://automattic.com
 * @since             1.0.0
 * @package           Link_Checker
 *
 * @wordpress-plugin
 * Plugin Name:       Link Checker
 * Plugin URI:        https://github.com/a8cteam51/wordpress-importer-fixers/tree/cli/link-checker
 * Description:       Identify issues with links (400, 404, etc.) and surface linked domains like staging or development.
 * Version:           1.0.1
 * Author:            Automattic
 * Author URI:        https://automattic.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       link-checker
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

require plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';
require_once dirname( __FILE__ ) . '/includes/class-link-checker.php';

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'LINK_CHECKER_VERSION', '1.0.1' );
define( 'LINK_CHECKER_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-link-checker-activator.php
 */
function activate_link_checker() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-link-checker-activator.php';
	Link_Checker_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-link-checker-deactivator.php
 */
function deactivate_link_checker() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-link-checker-deactivator.php';
	Link_Checker_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_link_checker' );
register_deactivation_hook( __FILE__, 'deactivate_link_checker' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
//require plugin_dir_path( __FILE__ ) . 'includes/class-link-checker.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_link_checker() {

	$plugin = new Link_Checker();
	$plugin->run();

}
run_link_checker();
