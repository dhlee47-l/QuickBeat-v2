package com.lec.spring.repository;

import com.lec.spring.domain.Track;

import java.util.List;

public interface TrackRepository {
    int save(Track track);

    int saveAll(List<Track> tracks);

    Track findByTrackId(String trackId);

    Track findByTrackNo(Integer trackNo);

    List<Track> findByAnswerNo(Integer answerNo);

    List<Track> findAll();

    int deleteByAnswerNo(Integer answerNo);

    int addAnswer(Integer answerNo, Integer trackNo);

    Integer findTrackNoByTrackId(String trackId);  // 추가
}