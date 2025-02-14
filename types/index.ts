export type Location = {
  id: string;
  name: string;
  image: string;
};

export type Room = {
  id: number;
  name: string;
  capacity: number;
  available: number;
};

export type Employee = {
  id: number;
  name: string;
  department: string;
  presences: number;
};

export type MonthlyAttendance = {
  [key: string]: { count: number; people: string[] };
};

export type DailyAttendance = {
  count: number;
  people: string[];
};