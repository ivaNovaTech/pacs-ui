CREATE VIEW ImageView AS
(

SELECT pat.id as pat_id,
       std.id as std_id,
       ser.id as ser_id,
       img.id as img_id,
       std.study_date,
       std.description,
       std.accn_num,
       std.modality,
       img.image_uid
FROM patient pat
JOIN study std on pat.id = std.patient_id
JOIN series ser on std.id = ser.study_id
JOIN image img on img.series_id = ser.id
);
