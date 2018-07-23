<?php

if(!isset($_SESSION)) session_start(); 

require_once __DIR__ . './lib/db.php';
require_once __DIR__ . './lib/router.php';

require_once __DIR__ . './admin/php';

//////////////// 404 ///////////////////
header("HTTP/1.0 404 Not Found");
echo '404 Not Found';