package com.lec.spring.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Track {
    private String id;
    private String trackId;
    private String name;
    private String artist;
    private String albumImage;
    private String uri;
    private String answerId;
}