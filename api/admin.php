<?php
if(!isset($_SESSION)) session_start(); 

require_once __DIR__ . './lib/router.php';
require_once __DIR__ . './lib/db.php';
require_once __DIR__ . './lib/auth.php';

function checkLogin() {
	if (!isAdmin()) {
		sendResponse(array('message' => 'Ban chua dang nhap'), 401);
		exit;
	}
}

// Default index page
router('POST', '^/api/admin/login$', function() {
    $data = getRequestData();
    sendResponse(['result' => adminLogin($data['password'])]);
});


// Lay danh sach chien dich
router('GET', '^/api/admin/chiendich$', function() {
	global $db;
	checkLogin();

	$data = $db->select('chien_dich', '*');
	sendResponse($data);
});

// Tao 1 chien dich
router('POST', '^/api/admin/chiendich$', function() {
	global $db;
	checkLogin();

	$data = getRequestData();

	$db->insert('chien_dich', $data);
	$res = $db->get('chien_dich', '*', ['id' => $db->id()]);

	sendResponse($res);
});

// Cap nhat 1 chien dich
router('POST', '^/api/admin/chiendich/(?<id>\d+)$', function($params) {
	global $db;
	checkLogin();

	$data = getRequestData();

	$db->update('chien_dich', $data, ['id' => $params['id']]);
	
	$res = $db->get('chien_dich', '*', ['id' => $params['id']]);
	sendResponse($res);
});

// Lay chi tiet 1 chien dich
router('GET', '^/api/admin/chiendich/(?<id>\d+)$', function($params) {
	global $db;
	checkLogin();

	$res = $db->get('chien_dich', '*', ['id' => $params['id']]);
	sendResponse($res);
});

// Xoa 1 chien dich

// Lay danh sach doi choi
router('GET', '^/api/admin/chiendich/(?<id>\d+)/team$', function($params) {
	global $db;
	checkLogin();

	$res = $db->select('doi_choi', '*', ['chien_dich_id' => $params['id']]);

	sendResponse($res);
});

// Tao 1 doi choi
router('POST', '^/api/admin/chiendich/(?<id>\d+)/team$', function($params) {
	global $db;
	checkLogin();

	$data = getRequestData();
	$data['chien_dich_id'] = $params['id'];
	
	$db->insert('doi_choi', $data);
	$res = $db->get('doi_choi', '*', ['id' => $db->id()]);

	sendResponse($res);
});
// Cap nhat 1 doi choi

// Xoa 1 doi choi
