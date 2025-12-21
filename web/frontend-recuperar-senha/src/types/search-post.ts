import type { Dayjs } from "dayjs";

export type State = {
  postSearch: string;
  postAuthor: string | null;
  postContent: string | null;
  createdAtBefore: Dayjs | null;
  createdAtAfter: Dayjs | null;
};

export type Action = {
  field: keyof State;
  value: any;
};
