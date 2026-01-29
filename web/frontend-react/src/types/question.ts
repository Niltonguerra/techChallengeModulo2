export interface Question {
  id: string;
  title: string;
  description: string;
  id_school_subject: string;
  created_at: string;

  status: 'OPEN' | 'CLOSED';

  admin?: {
    id: string;
    name: string;
  } | null;

  users?: {
    id: string;
    name: string;
    email: string;
  }[];

  conversation?: {
    id: string;
  };
}
