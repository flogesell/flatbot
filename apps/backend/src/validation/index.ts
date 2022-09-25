export type Status<T> = {
  status: boolean;
  message: string;
  data?: T;
};
