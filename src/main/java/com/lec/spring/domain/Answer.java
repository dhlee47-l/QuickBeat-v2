package com.lec.spring.domain;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Answer {
    private String id;
    private LocalDateTime createdAt;
    private List<Track> tracks;
}
