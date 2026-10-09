import { problemsPack1 } from './problems-001-020/index';
import { problemsPack2 } from './problems-021-040/index';
import { problemsPack3 } from './problems-041-060/index';
import { problemsPack4 } from './problems-061-080/index';
import type { EulerProblem } from './types/euler-problem';

export const allProblems: EulerProblem[] = [
  ...problemsPack1,
  ...problemsPack2,
  ...problemsPack3,
  ...problemsPack4,
];

export { problemsPack1, problemsPack2, problemsPack3, problemsPack4 };
