package com.lec.spring.domain;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Playlist{
    private String id;
    private List<Track> tracks;
}
