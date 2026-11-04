export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadlineIso?: string;
}

export interface GoalProgressReport {
  goalId: string;
  progressPercent: number;
  remainingAmount: number;
  unlockedMilestones: number[];
  nextMilestonePercent: number | null;
  isCompleted: boolean;
}

const MILESTONES = [25, 50, 75, 100];

export function evaluateSavingsGoalProgress(goal: SavingsGoal): GoalProgressReport {
  if (goal.targetAmount <= 0) {
    throw new Error('targetAmount must be positive');
  }
  const rawPct = (goal.currentAmount / goal.targetAmount) * 100;
  const progressPercent = Number(Math.min(100, Math.max(0, rawPct)).toFixed(2));
  const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
  const unlockedMilestones = MILESTONES.filter((m) => progressPercent >= m);
  const nextMilestonePercent = MILESTONES.find((m) => progressPercent < m) ?? null;

  return {
    goalId: goal.id,
    progressPercent,
    remainingAmount,
    unlockedMilestones,
    nextMilestonePercent,
    isCompleted: progressPercent >= 100,
  };
}
