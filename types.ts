
export interface GoalSettingSection {
  big_goals: string;
  milestones: string;
  thirty_day_objectives: string;
}

export interface MonthlyPlanner {
  overview_page: string;
  habit_list_templates: string;
}

export interface WeeklyPlanner {
  week_template: string;
  habit_tracker: string;
  weekly_reflection: string;
}

export interface DailyPages {
  morning_prompt: string;
  evening_prompt: string;
  habit_checklist: string;
  motivation_quotes: string[];
}

export interface Challenges {
  seven_day_challenge: string;
  twenty_one_day_challenge: string;
}

export interface ReviewSection {
  progress_summary: string;
  reward_system: string;
}

export interface WorkbookData {
  WorkbookTitle: string;
  Introduction: string;
  HowToUse: string;
  GoalSettingSection: GoalSettingSection;
  MonthlyPlanner: MonthlyPlanner;
  WeeklyPlanner: WeeklyPlanner;
  DailyPages: DailyPages;
  Challenges: Challenges;
  ReviewSection: ReviewSection;
}

export enum AppState {
  IDLE = 'IDLE',
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  GENERATING = 'GENERATING',
  VIEWING = 'VIEWING',
  ERROR = 'ERROR'
}

export interface DailyEntry {
  date: string;
  morningReflection: string;
  eveningReflection: string;
  habitsChecked: boolean[];
}

export interface UserProgress {
  entries: Record<string, DailyEntry>;
  goalNotes: string;
  checkedItems: Record<string, boolean>;
}
