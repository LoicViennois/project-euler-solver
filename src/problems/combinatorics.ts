export function permutation<T>(array: T[], k?: number): T[][] {
  const result: T[][] = [];

  if (!k) {
    k = array.length;
  }

  const recursion = (items: T[], temp: T[]) => {
    if (temp.length === k) {
      result.push([...temp]);
      return;
    }

    for (const item of items) {
      recursion(
        items.filter((i) => i !== item),
        [...temp, item],
      );
    }
  };

  recursion(array, []);
  return result;
}

export function combination<T>(array: T[], k?: number): T[][] {
  const result: T[][] = [];

  if (!k) {
    k = array.length;
  }

  const recursion = (items: T[], temp: T[]) => {
    if (temp.length === k) {
      result.push([...temp]);
      return;
    }

    for (const item of items) {
      const index = items.indexOf(item);
      recursion(items.slice(index + 1), [...temp, item]);
    }
  };

  recursion(array, []);
  return result;
}

export function cartesianProduct<T>(...arrays: T[][]): T[][] {
  const result: T[][] = [];

  const recursion = (cumul: T[], arrs: T[][]) => {
    const [a0, ...others] = arrs;

    for (const v0 of a0 ?? []) {
      const newCumul = [...cumul, v0];
      if (newCumul.length === arrays.length) {
        result.push(newCumul);
      } else {
        recursion(newCumul, others);
      }
    }
  };

  recursion([], arrays);
  return result;
}
