package com.tastepedia.backend.service;

import com.tastepedia.backend.payload.SignupRequest;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpCacheService {

    // Cache for User Registration
    private final Map<String, PendingUser> pendingUsers = new ConcurrentHashMap<>();

    // Cache for Store Registration
    private final Map<String, PendingStore> pendingStores = new ConcurrentHashMap<>();

    public void savePendingUser(String email, SignupRequest request, String otp) {
        pendingUsers.put(email, new PendingUser(request, otp));
    }

    public PendingUser getPendingUser(String email) {
        return pendingUsers.get(email);
    }

    public void removePendingUser(String email) {
        pendingUsers.remove(email);
    }

    public void savePendingStore(String email, Map<String, String> request, String otp, double lat, double lng) {
        pendingStores.put(email, new PendingStore(request, otp, lat, lng));
    }

    public PendingStore getPendingStore(String email) {
        return pendingStores.get(email);
    }

    public void removePendingStore(String email) {
        pendingStores.remove(email);
    }

    public static class PendingUser {
        public SignupRequest request;
        public String otp;

        public PendingUser(SignupRequest request, String otp) {
            this.request = request;
            this.otp = otp;
        }
    }

    public static class PendingStore {
        public Map<String, String> request;
        public String otp;
        public double lat;
        public double lng;

        public PendingStore(Map<String, String> request, String otp, double lat, double lng) {
            this.request = request;
            this.otp = otp;
            this.lat = lat;
            this.lng = lng;
        }
    }
}
