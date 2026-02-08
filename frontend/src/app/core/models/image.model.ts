export interface Image {
  image_id?: number;
  study_id: number;
  image_uid: string;
  instance_number: number;
  image_position: number;
  rows: number;
  columns: number;
  transfer_syntax_uid: string;
  study_year: number;
  modality: string;
  created_at?: string;
}