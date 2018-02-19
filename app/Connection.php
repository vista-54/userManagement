<?php
namespace app;

class Connection
{
    private $_db;
    static $_instance;

    private function __construct()
    {
        $this->_db = new \PDO('mysql:host=localhost:8889;dbname=testappdb', 'root', 'root');
        $this->_db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    }


    public static function getInstance()
    {
        if (!(self::$_instance instanceof self)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    function __destruct()
    {
        unset($this->_db);
    }

    public function query($sql)
    {
        return $this->_db->query($sql);
    }

    public function prepare($sql)
    {
        return $this->_db->prepare($sql);
    }

}