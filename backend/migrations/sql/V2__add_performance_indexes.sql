-- V2__add_performance_indexes.sql

-- Indices for performance (Essential for PACS search)
CREATE INDEX IF NOT EXISTS idx_patient_mrn ON public.patient(mrn);
CREATE INDEX IF NOT EXISTS idx_study_uid ON public.study(study_uid);
CREATE INDEX IF NOT EXISTS idx_series_study_id ON public.series(study_id);
CREATE INDEX IF NOT EXISTS idx_image_series_id ON public.image(series_id);