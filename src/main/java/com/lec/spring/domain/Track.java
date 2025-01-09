package com.lec.spring.domain;

import lombok.Data;

@Data
public class Track {
    private String id;
    private String trackId;
    private String name;
    private String artist;
    private String albumImage;
    private String uri;
}