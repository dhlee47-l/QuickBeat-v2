SET SESSION FOREIGN_KEY_CHECKS = 0;

/* Drop Tables */
DROP TABLE IF EXISTS qr_codes;
DROP TABLE IF EXISTS track;
DROP TABLE IF EXISTS user;

/* Create Tables */
CREATE TABLE user
(
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    username    VARCHAR(50) UNIQUE NOT NULL,
    password    VARCHAR(100) NOT NULL,
    name        VARCHAR(50),
    email       VARCHAR(100) UNIQUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE qr_codes
(
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id         BIGINT,
    qr_image_url    VARCHAR(255) NOT NULL,
    track_data_json TEXT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE track
(
    id          VARCHAR(255) PRIMARY KEY,
    track_id    VARCHAR(255) NOT NULL,
    name        VARCHAR(255) NOT NULL,
    artist      VARCHAR(255) NOT NULL,
    album_image VARCHAR(255),
    uri         VARCHAR(255) NOT NULL,
    qr_code_id  BIGINT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (qr_code_id) REFERENCES qr_codes(id)
);

SET SESSION FOREIGN_KEY_CHECKS = 1;

ALTER TABLE track
    ADD COLUMN answer_id VARCHAR(255);