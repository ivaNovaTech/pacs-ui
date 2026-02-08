export interface Study {
  study_id: number;
  patient_id: number;
  study_uid: string;
  study_date: string; // ISO string from API
  study_year: number;
  modality: string;
  description: string;
  created_at: string;
  last_updated_at: string;
}