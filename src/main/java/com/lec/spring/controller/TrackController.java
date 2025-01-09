//package com.lec.spring.controller;
//
//import com.lec.spring.domain.Track;
//import com.lec.spring.repository.TrackMapper;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@Controller
//@RequestMapping("/api/tracks")
//public class TrackController {
//
//    private final TrackMapper trackMapper;
//
//    public TrackController(TrackMapper trackMapper) {
//        this.trackMapper = trackMapper;
//    }
//
//    @PostMapping("/selected")
//    @ResponseBody
//    public ResponseEntity<String> saveSelectedTracks(@RequestBody List<Track> tracks) {
//        // 기존 데이터 삭제 후 새로운 데이터 저장
//        trackMapper.deleteSelectedTracks();
//        int result = trackMapper.insertTracks(tracks);
//
//        if (result > 0) {
//            return ResponseEntity.ok("Tracks saved successfully");
//        } else {
//            return ResponseEntity.badRequest().body("Failed to save tracks");
//        }
//    }
//
//    @GetMapping("/selected")
//    @ResponseBody
//    public ResponseEntity<List<Track>> getSelectedTracks() {
//        List<Track> tracks = trackMapper.getSelectedTracks();
//        if (tracks == null || tracks.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(tracks);
//    }
//}
