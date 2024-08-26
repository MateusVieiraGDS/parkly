<?php


namespace App\Helpers;

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