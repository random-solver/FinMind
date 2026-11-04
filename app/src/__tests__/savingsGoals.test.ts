import { evaluateSavingsGoalProgress } from '../lib/savingsGoals';

describe('evaluateSavingsGoalProgress', () => {
  it('tracks milestones at 25%, 50%, 75%, and 100%', () => {
    const res = evaluateSavingsGoalProgress({
      id: 'g1',
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 5500,
    });
    expect(res.progressPercent).toBe(55);
    expect(res.unlockedMilestones).toEqual([25, 50]);
    expect(res.nextMilestonePercent).toBe(75);
    expect(res.isCompleted).toBe(false);
  });
});
