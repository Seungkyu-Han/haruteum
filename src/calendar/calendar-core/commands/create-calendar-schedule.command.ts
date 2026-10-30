export interface CreateCalendarScheduleCommand {
  coupleId: string;
  userId: string;
  title: string;
  description?: string | null;
  startDate: Date;
  endDate?: Date;
  isCompleted?: boolean;
}

