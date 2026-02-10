export interface Study {
  id: number;
  patient_id: number; // Links to Patient.id
  study_id: number;   
  study_uid: string;  // The DICOM StudyInstanceUID
  study_date: string;
  study_year: number;
  modality: string;
  description: string;
  created_at: string;
  last_updated_at: string;
}