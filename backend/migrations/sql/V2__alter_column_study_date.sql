alter table study
    alter column study_date type timestamptz using study_date::timestamptz;

