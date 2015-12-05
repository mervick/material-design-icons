<?php

$path = __DIR__ . '/../vendor/material-design-icons';
$out = __DIR__ . '/../demo/js/data.js';
$codepoints = __DIR__ . '/../fonts/codepoints';

$categories = $icons = [];
$count = $count_cats = 0;

foreach (file($codepoints, FILE_IGNORE_NEW_LINES) as $code) {
    $code = explode(' ', $code, 2);
    $icons[$code[0]] = $code[1];
}

foreach (array_diff(scandir($path), ['.', '..'])  as $dir) {
    if (is_dir("$path/$dir/svg/production")) {
        $count_cats ++;
        $categories[$dir] = [];
        foreach (array_diff(scandir("$path/$dir/svg/production"), ['.', '..']) as $file) {
            if (preg_match('/^ic_(.+?)_\d+px\.svg$/', $file, $match)) {
                if (isset($icons[$match[1]])) {
                    if (!in_array($icons[$match[1]], $categories[$dir])) {
                        $categories[$dir][$match[1]] = $icons[$match[1]];
                        $count ++;
                    }
                }
            }
        }
    }
}

file_put_contents($out, 'window.data = ' . json_encode($categories) . ';');

echo "Found $count icons in $count_cats categories\n";