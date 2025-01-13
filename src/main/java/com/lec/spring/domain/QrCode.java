package com.lec.spring.domain;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QrCode {
    private Long id;
    private String qrImageUrl;
    private String trackDataJson;
    private LocalDateTime createdAt;
}
