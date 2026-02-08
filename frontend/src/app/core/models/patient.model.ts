export interface Patient {
  mrn: string;
  last_name: string;
  first_name: string;
  middle_name: string;
  sex: string;
  date_of_birth: string | Date; // String for JSON transport, Date for logic
  suffix: string;
  prefix: string;
}