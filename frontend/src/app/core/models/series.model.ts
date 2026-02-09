export interface Series {
  id?: number; // Optional if not yet assigned by DB
  series_id?: number; // Optional if not yet assigned by DB
  study_id: number;
  series_uid: string;
  series_number: number;
  modality: string;
  body_part_examined: string; // e.g., CHEST, BRAIN, KNEE
  description: string;
  study_year: number;
  created_at: string | Date;
  last_updated_at: string | Date;
}