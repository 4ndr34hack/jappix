<?php

/*

Jappix - An open social platform
The SVG loader for Jappix statistics

~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

License: AGPL
Authors: Valérian Saliou
Contact: http://project.jappix.com/contact
Last revision: 28/10/10

*/

// Get the functions
require_once('./functions.php');

// Get the configuration
define('PHP_BASE', '..');
require_once('./read-main.php');
require_once('./read-hosts.php');

// Get the libs
require_once('./drawsvgchart.php');
require_once('./gettext.php');

// Optimize the page rendering
hideErrors();
gzipThis();

// Start the session
session_start();

// Check if the user is authorized
$is_admin = false;

if((isset($_SESSION['jappix_user']) && !empty($_SESSION['jappix_user'])) && (isset($_SESSION['jappix_password']) && !empty($_SESSION['jappix_password']))) {
	// Get the session values
	$user = $_SESSION['jappix_user'];
	$password = $_SESSION['jappix_password'];
	
	// Checks the user is admin
	$is_admin = isAdmin($user, $password);
}

// Not admin? Stop the script!
if(!$is_admin)
	exit;

// Get the graph type
if((isset($_GET['g']) && !empty($_GET['g'])))
	$graph = $_GET['g'];
else
	$graph = 'others';

// Get the locale
if((isset($_GET['l']) && !empty($_GET['l'])))
	$locale = $_GET['l'];
else
	$locale = 'en';

// Include the translations
includeTranslation($locale, 'main', PHP_BASE);

$drawsvgchart = new DrawSVGChart;

// Generation vars
$link = FALSE;
$evolution = FALSE;

// Access graph?
if($graph == 'access') {
	// Values
	$elements = getMonthlyVisits();
	$legend = array(array('#5276A9', T_("Visits")));
	$evolution = TRUE;
}

// Share graph?
else if($graph == 'share') {
	// Values
	$elements = largestShare(shareStats(), 8);
	$legend = array(array('#5276A9', T_("Size")));
}

// Others graph?
else if($graph == 'others') {
	// Values
	$elements = otherStats();
	$legend = array(array('#5276A9', T_("Size")));
}

// Generate the chart
$svgchart = $drawsvgchart->createChart($elements, $legend, $link, $evolution, $graph);

// No error?
if(!$drawsvgchart->has_errors()) {
	header('Content-Type: image/svg+xml; charset=utf-8');
	echo $drawsvgchart->getXMLOutput();
}

?>
