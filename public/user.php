<?php
/**
 * Created by PhpStorm.
 * User: vista
 * Date: 18.02.18
 * Time: 00:20
 */
require_once '../vendor/autoload.php';


if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'add':
            $result = addUser($_POST);
            break;
        case 'index':
            $result = index($_GET);
            break;
        default:
            $result = 'action is not found';
    }
    echo json_encode($result);
} else {
    echo "Action is missing";
}


function addUser($data)
{
    $db = \app\Connection::getInstance();

    if (isset($data['username']) && $data['username'] != '' && isset($data['email']) && $data['email'] != '' && isset($data['password']) && $data['password'] != '') {
        $stmt = $db->prepare('INSERT INTO USER ( username, email,created_at,updated_at,password_hash )
   VALUES
   (?,?,?,?,?); ');
        return $stmt->execute([$data['username'], $data['email'], time(), time(), md5($data['password'])]);
    } else {
        return "Invalid data";
    }

}

function index($params = null)
{
    $default_limit = 25;
    $default_offset = 0;
    if (isset($params['limit'])) {
        $default_limit = $params['limit'];
    }
    if (isset($params['offset'])) {
        if ($params['offset'] > 0) {
            $default_offset = $params['offset'];
        }
    }
    $db = \app\Connection::getInstance();
    $stmt = $db->query('Select * from USER ORDER BY id DESC LIMIT ' . $default_limit . ' OFFSET ' . $default_offset);
    $stmt->execute();
    $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);

    $stmtCount = $db->query('Select COUNT(*)  as total from USER ');
    $stmtCount->execute();
    $resultCount = $stmtCount->fetchAll(\PDO::FETCH_ASSOC);

    return
        [
            'users' => $result,
            'total' => $resultCount[0]['total']
        ];
}

