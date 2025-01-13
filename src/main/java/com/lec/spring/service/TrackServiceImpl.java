package com.lec.spring.service;

import com.lec.spring.domain.Track;
import com.lec.spring.repository.TrackRepository;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TrackServiceImpl implements TrackService {

    private final TrackRepository trackRepository;

    public TrackServiceImpl(SqlSession sqlSession) {
        this.trackRepository = sqlSession.getMapper(TrackRepository.class);
    }


    public String saveTracks(List<Track> tracks) {
        String answerId = UUID.randomUUID().toString();
        for (Track track : tracks) {
            track.setAnswerId(answerId);
        }
        trackRepository.saveAll(tracks);
        return answerId;
    }

    public List<Track> getTracksByAnswerId(String answerId) {
        return trackRepository.findByAnswerId(answerId);
    }
}
