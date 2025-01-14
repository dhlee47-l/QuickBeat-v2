package com.lec.spring.controller;

import com.lec.spring.domain.Track;
import com.lec.spring.service.TrackService;  // TrackService 인터페이스 사용
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracks")
@RequiredArgsConstructor
public class TrackController {
    private final TrackService trackService;  // 구현체가 아닌 인터페이스 주입

    @PostMapping
    public ResponseEntity<String> saveTracks(@RequestBody List<Track> tracks) {
        String answerId = trackService.saveTracks(tracks);
        return ResponseEntity.ok(answerId);
    }

    @GetMapping("/{answerId}")
    public ResponseEntity<List<Track>> getTracksByAnswerId(@PathVariable String answerId) {
        List<Track> tracks = trackService.getTracksByAnswerId(answerId);
        if (tracks == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tracks);
    }
}