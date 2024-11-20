<?php

use chums\ui\WebUI2;
use chums\user\Groups;
use chums\ui\CSSOptions;

/**
 * @package Chums
 * @subpackage ProjectedDemands
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2013, steve
 */

require_once ("autoload.inc.php");

$ui = new webUI2([
    'bodyClassName' => 'container-fluid',
    'contentFile' => 'body.inc.php',
    'requiredRoles' => [Groups::WEB_ADMIN],
]);
$ui->addCSS('public/styles.css', CSSOptions::parse(['useTimestampVersion' => true]))
    ->addManifestJSON('public/js/manifest.json')
    ->render();
