export interface Question {
  id: string;
  title: string;
  description: string;
  id_school_subject: string;
  created_at: string;

  users?: {
    id: string;
    name: string;
    email: string;
  }[];

  conversation?: {
    id: string;
  };
}
