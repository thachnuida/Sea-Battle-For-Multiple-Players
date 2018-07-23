<?php 

require_once __DIR__ . '/../../config.php';
require_once __DIR__ . './medoo.php';

// Using Medoo namespace
use Medoo\Medoo;

$db = new Medoo([
    'database_type' => 'mysql',
    'database_name' => $DB['db'],
    'server' => $DB['host'],
    'username' => $DB['user'],
    'password' => $DB['pass']
]);
