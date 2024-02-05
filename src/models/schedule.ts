export interface DutySchedule {
  id: string; userId: string; date: string;
  shift: 'morning'|'afternoon'|'night';
  note?: string;
}




