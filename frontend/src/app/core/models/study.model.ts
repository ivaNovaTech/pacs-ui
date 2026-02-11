export interface Study {
  id: number;
  patient_id: number; // Links to Patient.id
  studyid: string;  
  accn_num: string;  
  study_uid: string; 
  study_date: string;
  study_year: number;
  modality: string;
  description: string;
  created_at: string;
  last_updated_at: string;
  mrn: string;
}