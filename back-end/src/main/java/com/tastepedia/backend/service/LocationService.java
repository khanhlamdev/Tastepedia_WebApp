package com.tastepedia.backend.service;

import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
public class LocationService {

    /**
     * Gọi Nominatim (OpenStreetMap) để convert địa chỉ → [latitude, longitude].
     * Trả về [0.0, 0.0] nếu không tìm thấy (không blocking).
     */
    public double[] geocodeAddress(String address) {
        try {
            String encoded = URLEncoder.encode(address, StandardCharsets.UTF_8);
            String url = "https://nominatim.openstreetmap.org/search?q=" + encoded + "&format=json&limit=1";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    // Nominatim yêu cầu User-Agent để tránh bị block
                    .header("User-Agent", "Tastepedia/1.0 (tastepediaverified@gmail.com)")
                    .GET()
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            String body2 = response.body();
            // Parse JSON thủ công (tránh thêm dependency)
            // Format: [{"lat":"10.77","lon":"106.70",...}]
            if (body2.contains("\"lat\":")) {
                int latIdx = body2.indexOf("\"lat\":") + 7;
                int latEnd = body2.indexOf("\"", latIdx);
                int lonIdx = body2.indexOf("\"lon\":") + 7;
                int lonEnd = body2.indexOf("\"", lonIdx);

                String latStr = body2.substring(latIdx, latEnd);
                String lonStr = body2.substring(lonIdx, lonEnd);

                return new double[]{ Double.parseDouble(latStr), Double.parseDouble(lonStr) };
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new double[]{ 0.0, 0.0 };
    }

    /**
     * Tính khoảng cách Haversine giữa 2 toạ độ (trả về km).
     */
    public double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        if (lat1 == 0.0 || lon1 == 0.0 || lat2 == 0.0 || lon2 == 0.0) {
            return 0.0; // Avoid impossible calculations if one location failed to geocode
        }
        
        final int R = 6371; // Bán kính trái đất (km)

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Khoảng cách theo km
    }
}
