import type { ProblemFunction } from './problem-function';

export interface EulerProblem {
  id: number;
  solver: null | ProblemFunction;
}
