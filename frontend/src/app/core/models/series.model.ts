export interface Series {
  id: number;
  study_id: number;
  series_instance_uid: string;
  series_number: number;
  modality: string;
  description?: string;
  body_part?: string;       // Added for dashboard
  instance_count: number;   // Added to show how many images are inside
  created_at: string;
}