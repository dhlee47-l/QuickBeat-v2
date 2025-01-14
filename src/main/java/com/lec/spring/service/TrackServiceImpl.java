package com.lec.spring.service;

import com.lec.spring.domain.Answer;
import com.lec.spring.domain.Track;
import com.lec.spring.repository.AnswerRepository;
import com.lec.spring.repository.TrackRepository;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class TrackServiceImpl implements TrackService {
    private final TrackRepository trackRepository;
    private final AnswerRepository answerRepository;

    public TrackServiceImpl(SqlSession sqlSession) {
        this.trackRepository = sqlSession.getMapper(TrackRepository.class);
        this.answerRepository = sqlSession.getMapper(AnswerRepository.class);
    }

    @Override
    @Transactional
    public String saveTracks(List<Track> tracks) {
        // 1. UUID answerId 생성
        String answerId = UUID.randomUUID().toString();

        // 2. Answer 저장
        Answer answer = new Answer();
        answer.setAnswerId(answerId);
        answerRepository.save(answer);
        Integer answerNo = answer.getAnswerNo();

        // 3. Track 각각 저장하고 answer_track 관계도 저장
        for (Track track : tracks) {
            // Track 저장
            trackRepository.save(track);

            // track_id로 track_no 조회 (새로 생성되었거나 이미 존재하는 경우 모두 처리)
            Integer trackNo = trackRepository.findTrackNoByTrackId(track.getTrackId());
            if (trackNo == null) {
                throw new RuntimeException("Failed to get track_no for track_id: " + track.getTrackId());
            }

            // answer_track 관계 저장
            trackRepository.addAnswer(answerNo, trackNo);
        }

        return answerId;
    }

    @Override
    public List<Track> getTracksByAnswerId(String answerId) {

        Answer answer = answerRepository.findByAnswerId(answerId);

        if (answer == null) {
            return null;
        }

        List<Track> tracks = trackRepository.findByAnswerNo(answer.getAnswerNo());

        return tracks;
    }
}