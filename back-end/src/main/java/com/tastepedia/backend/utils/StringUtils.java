package com.tastepedia.backend.utils;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class StringUtils {
    public static String removeAccent(String s) {
        if (s == null) return "";
        String temp = Normalizer.normalize(s, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(temp).replaceAll("").replace('đ','d').replace('Đ','D');
    }
}
