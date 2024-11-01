<?php


namespace App\Helpers;

use DateTime;
use Exception;

 if (!function_exists('onlyNumber')) {
    /**
     * Remove caracteres não numéricos de uma string.
     *
     * Esta função utiliza expressões regulares para manter apenas os números de uma string.
     *
     * @param string $string A string da qual os números serão mantidos.
     * @return string A string resultante contendo apenas os números.
     */
    function onlyNumber($value)
    {
        return preg_replace('/[^0-9]/', '', (string) $value);
    }
}


if (!function_exists('toSqlDate')) {
    /**
     * Converte uma data no formato 'd/m/Y' para o formato 'Y-m-d' usado pelo MySQL.
     *
     * @param string $date A data no formato 'd/m/Y'.
     * @return string A data no formato 'Y-m-d'.
     * @throws Exception Se a data não puder ser formatada corretamente.
     */
    function toSqlDate($date)
    {
        $date = DateTime::createFromFormat('d/m/Y', $date);
        if ($date === false)
            throw new Exception('Erro ao formatar a data.');
        $dataMySQL = $date->format('Y-m-d');
        return $dataMySQL;
    }
}