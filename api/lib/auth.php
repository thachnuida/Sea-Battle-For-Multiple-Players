<?php

require_once __DIR__ . '/../../config.php';

function isLogin() {
	return isset($_SESSION['doi_choi']);
}

function isAdmin() {
	return isset($_SESSION['is_admin']) && $_SESSION['is_admin'];
}

function login($doichoiID) {
	$_SESSION['doi_choi'] = $doichoiID;
}

function adminLogin($password) {
	global $ADMIN;
	$result = $password == $ADMIN['pass'];
	$_SESSION['is_admin'] = $result;
	return $result;
}