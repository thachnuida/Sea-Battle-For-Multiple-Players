<?php
if(!isset($_SESSION)) session_start(); 

require_once __DIR__ . '/./lib/router.php';
require_once __DIR__ . '/./lib/db.php';
require_once __DIR__ . '/./lib/auth.php';

function checkTeamLogin() {
	if (!isLogin()) {
		sendResponse(array('message' => 'Ban chua dang nhap'), 401);
		exit;
	}
}

// Login
router('POST', '^/api/team/login$', function() {
	global $db;

    $data = getRequestData(); //['chien_dich_id', 'name', 'password']
    if (!isset($data['chien_dich_id']) || !isset($data['name']) || !isset($data['password'])) {
    	$result = false;
    } else {
    	$doiChoi = $db->get('doi_choi', '*', $data);
    	$result = !!$doiChoi;
    	if ($result) {
	    	login($doiChoi);
	    }
    }

    sendResponse(array('result' => $result));
});

// Logout
router('POST', '^/api/team/logout$', function() {
	global $db;

    logout();

    sendResponse(array('result' => true));
});

// Lay danh sach chien dich đang mở
router('GET', '^/api/team/chiendichdangmo$', function() {
	global $db;

	$data = $db->select('chien_dich', '*', ['is_open' => 1]);
	sendResponse($data);
});

// Lay thong tin chien dich cua doi
router('GET', '^/api/team/chiendich$', function() {
	global $db;
	checkTeamLogin();

	$res = $db->get('chien_dich', '*', ['id' => $_SESSION['doi_choi']['chien_dich_id']]);
	unset($res['noi_dung_sau_khi_xong']);
	sendResponse($res);
});

// Cap nhat thong tin may bay
router('POST', '^/api/team/airplane$', function() {
	global $db;
	checkTeamLogin();

	// Kiem tra thong tin chien dich
	$chienDich = $db->get('chien_dich', '*', ['id' => $_SESSION['doi_choi']['chien_dich_id']]);
	if ($chienDich['cho_phep_tan_cong'] || !$chienDich['is_open']) {
		sendResponse(['result' => false, 'message' => 'Thoi gian thiet lap may bay da ket thuc. Hay chuyen sang che do tan cong.'], 400);
		exit;
	}

	$data = getRequestData(); //['hang', 'cot', 'hasAirPlane']
	$hasAirPlane = $data['hasAirPlane'];
	$data = [
		'hang' => $data['hang'],
		'cot' => $data['cot'],
		'doi_choi_id' => $_SESSION['doi_choi']['id'],
		'chien_dich_id' => $_SESSION['doi_choi']['chien_dich_id']
	];

	if ($hasAirPlane) {
		// Kiem tra so luong may bay
		$max = $chienDich['so_may_bay_moi_doi'];
		$count = $db->count('may_bay', ['doi_choi_id' => $_SESSION['doi_choi']['id'], 'chien_dich_id' => $_SESSION['doi_choi']['chien_dich_id']]);

		if ($count >= $max) {
			sendResponse(['result' => false, 'message' => 'Da qua so luong may bay'], 400);
			exit;
		}

		$exist = $db->get('may_bay', $data);
		if (!$exist) $db->insert('may_bay', $data);
	} else {
		$db->delete('may_bay', $data);
	}

	sendResponse(['result' => true]);
});

// Lay may bay cua doi choi
router('GET', '^/api/team/airplane$', function() {
	global $db;
	checkTeamLogin();

	$res = $db->select('may_bay', '*', ['doi_choi_id' => $_SESSION['doi_choi']['id'], 'chien_dich_id' => $_SESSION['doi_choi']['chien_dich_id']]);
	sendResponse($res);
});

// Dat bom
router('POST', '^/api/team/bom$', function() {
	global $db;
	checkTeamLogin();

	// Kiem tra thong tin chien dich
	$chienDich = $db->get('chien_dich', '*', ['id' => $_SESSION['doi_choi']['chien_dich_id']]);
	if (!$chienDich['cho_phep_tan_cong'] || !$chienDich['is_open']) {
		sendResponse(['result' => false, 'message' => 'Thoi gian tan cong da ket thuc.'], 400);
		exit;
	}

	// Kiem tra so luong bom
	$max = $chienDich['so_bom_moi_doi'];
	$count = $db->count('bom', ['doi_choi_id' => $_SESSION['doi_choi']['id'], 'chien_dich_id' => $_SESSION['doi_choi']['chien_dich_id']]);

	if ($count >= $max) {
		sendResponse(['result' => false, 'message' => 'Da qua so luong bom'], 400);
		exit;
	}

	$data = getRequestData(); //['hang', 'cot']
	$data = [
		'hang' => $data['hang'],
		'cot' => $data['cot'],
		'doi_choi_id' => $_SESSION['doi_choi']['id'],
		'chien_dich_id' => $_SESSION['doi_choi']['chien_dich_id']
	];

	$exist = $db->get('bom', $data);
	if (!$exist) {
		// Kiem tra so luong may bay trung bom
		$airplanes = $db->select('may_bay', '*', [
			'hang' => $data['hang'],
			'cot' => $data['cot'],
			'chien_dich_id' => $data['chien_dich_id'],
			'doi_choi_id[!]' => $data['doi_choi_id']
		]);

		$data['so_may_bay_ban_duoc'] = count($airplanes);
		foreach($airplanes as $airplane) {
			$db->update('may_bay', ['bi_tieu_diet' => 1], ['id' => $airplane['id']]);
		}

		$db->insert('bom', $data);
		sendResponse($data);
	} else {
		sendResponse(['result' => false, 'message' => 'Vi tri nay da co bom cua doi ban'], 400);
	}
});

// Lay bom cua doi choi
router('GET', '^/api/team/bom$', function() {
	global $db;
	checkTeamLogin();

	$res = $db->select('bom', '*', ['doi_choi_id' => $_SESSION['doi_choi']['id'], 'chien_dich_id' => $_SESSION['doi_choi']['chien_dich_id']]);
	sendResponse($res);
});

// Lay thong tin hanh trinh
router('GET', '^/api/team/campinfo$', function() {
	global $db;
	checkTeamLogin();

	$chienDich = $db->get('chien_dich', '*', ['id' => $_SESSION['doi_choi']['chien_dich_id']]);
	// Kiem tra so luong bom
	$max = $chienDich['so_bom_moi_doi'];
	$count = $db->count('bom', ['doi_choi_id' => $_SESSION['doi_choi']['id'], 'chien_dich_id' => $_SESSION['doi_choi']['chien_dich_id']]);

	if ($count >= $max) {
		$res = ['message' => $chienDich['noi_dung_sau_khi_xong']];
	} else {
		$res = ['message' => ''];
	}
	sendResponse($res);
});