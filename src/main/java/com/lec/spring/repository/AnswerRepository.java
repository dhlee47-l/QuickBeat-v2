package com.lec.spring.repository;

import com.lec.spring.domain.Answer;

import java.util.List;

public interface AnswerRepository {
    int save(Answer answer);

    Answer findByAnswerId(String answerId);

    Answer findByAnswerNo(Integer answerNo);

    List<Answer> findAll();

    int deleteByAnswerId(String answerId);

    int deleteByAnswerNo(Integer answerNo);
}