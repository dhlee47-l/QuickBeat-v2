package com.lec.spring.service;

import com.lec.spring.domain.Track;

import java.util.List;

public interface TrackService {

    String saveTracks(List<Track> tracks);

    List<Track> getTracksByAnswerId(String answerId);

}
