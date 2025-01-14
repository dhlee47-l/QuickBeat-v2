-- 1. answer 테이블 확인
SELECT *
FROM answer
WHERE answer_id = '3faa2f43-a599-45c1-8a09-4bb66cde29e9';

-- 2. 만약 answer가 있다면, 해당 answer_no로 answer_track 관계 확인
SELECT *
FROM answer_track
WHERE answer_no = 1;

-- 3. 연결된 tracks 확인
SELECT t.*
FROM track t
         JOIN answer_track at
ON t.track_no = at.track_no
WHERE at.answer_no = 1;