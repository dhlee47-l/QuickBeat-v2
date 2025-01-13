package com.lec.spring.repository;

import com.lec.spring.domain.Track;

import java.util.List;

public interface TrackRepository {
    int save(Track track);

    int saveAll(List<Track> tracks);

    List<Track> findByAnswerId(String answerId);

    Track findById(String id);

    List<Track> findAll();

    int deleteByAnswerId(String answerId);
}