SET SESSION FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS answer_track;
DROP TABLE IF EXISTS track;
DROP TABLE IF EXISTS answer;

CREATE TABLE track
(
    track_no     INT AUTO_INCREMENT PRIMARY KEY COMMENT '트랙 일련번호',
    track_id     VARCHAR(255) NOT NULL UNIQUE COMMENT '스포티파이 트랙 ID',
    name         VARCHAR(255) NOT NULL COMMENT '트랙명',
    artist       VARCHAR(255) NOT NULL COMMENT '아티스트',
    album_image  VARCHAR(255) COMMENT '앨범 이미지 URL',
    uri          VARCHAR(255) NOT NULL COMMENT '스포티파이 URI'
) COMMENT '트랙';

CREATE TABLE answer
(
    answer_no    INT AUTO_INCREMENT PRIMARY KEY COMMENT '답안 일련번호',
    answer_id    VARCHAR(255) NOT NULL UNIQUE COMMENT 'UUID 답안 ID',
    created_at   DATETIME NULL DEFAULT NOW() COMMENT '생성일시'
) COMMENT '답안';

CREATE TABLE answer_track
(
    answer_no    INT NOT NULL COMMENT '답안 일련번호',
    track_no     INT NOT NULL COMMENT '트랙 일련번호',
    PRIMARY KEY (answer_no, track_no)
) COMMENT '답안-트랙 관계';

ALTER TABLE answer_track
    ADD CONSTRAINT fk_answer_to_answer_track
        FOREIGN KEY (answer_no)
            REFERENCES answer (answer_no)
            ON UPDATE RESTRICT
            ON DELETE CASCADE;

ALTER TABLE answer_track
    ADD CONSTRAINT fk_track_to_answer_track
        FOREIGN KEY (track_no)
            REFERENCES track (track_no)
            ON UPDATE RESTRICT
            ON DELETE CASCADE;