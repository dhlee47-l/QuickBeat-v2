SET SESSION FOREIGN_KEY_CHECKS = 0;

/* Drop Tables */
DROP TABLE IF EXISTS qr_codes;
DROP TABLE IF EXISTS track;
DROP TABLE if EXISTS user;


CREATE TABLE user(

);

CREATE TABLE qr_codes
(
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    qr_image_url    VARCHAR(255) NOT NULL,
    track_data_json TEXT         NOT NULL,
    created_at      TIMESTAMP    NOT NULL
);

CREATE TABLE track
(

);
