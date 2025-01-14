SET SESSION FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS track;

CREATE TABLE track
(
    id          VARCHAR(255) PRIMARY KEY,
    track_id    VARCHAR(255) NOT NULL,
    name        VARCHAR(255) NOT NULL,
    artist      VARCHAR(255) NOT NULL,
    album_image VARCHAR(255),
    uri         VARCHAR(255) NOT NULL,
    answer_id VARCHAR(255)
);
