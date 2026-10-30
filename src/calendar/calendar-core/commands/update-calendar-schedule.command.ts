export interface UpdateCalendarScheduleCommand {
  title?: string;
  description?: string | null;
  startDate?: Date;
  endDate?: Date;
  isCompleted?: boolean;
}

