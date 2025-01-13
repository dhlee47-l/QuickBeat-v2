package com.lec.spring.controller;

import com.lec.spring.domain.Track;
import com.lec.spring.service.TrackServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracks")
@RequiredArgsConstructor
public class TrackController {
    private final TrackServiceImpl trackService;

    @PostMapping
    public ResponseEntity<String> saveTracks(@RequestBody List<Track> tracks) {
        String answerId = trackService.saveTracks(tracks);
        System.out.println(answerId);
        return ResponseEntity.ok(answerId);
    }

    @GetMapping("/{answerId}")
    public ResponseEntity<List<Track>> getTracksByAnswerId(@PathVariable String answerId) {
        List<Track> tracks = trackService.getTracksByAnswerId(answerId);
        return ResponseEntity.ok(tracks);
    }
}
