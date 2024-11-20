import { resolutionState } from "../store/resolution";

export const resolve = (state: resolutionState) => {
  const { countVariables, countTasks, targetFuncFirst, targetFuncSecond, findDirect } = state.startData;
  const tasksData = state.tasksData;
  const targetFuncCoefficients = [targetFuncFirst, targetFuncSecond];

  // Проверка входных данных
  if (countVariables <= 0 || countTasks <= 0 || tasksData.length !== countTasks) {
    throw new Error("Неверный ввод данных");
  }

  // Преобразование в стандартную форму
  const tableau: number[][] = [];
  let index = -1;
  for (const task of tasksData) {
    index += 1;
    const row = [
      ...task.coefficients,
      ...Array(countTasks).fill(0), // Слабые и искусственные переменные
      task.freeMember,
    ];

    if (task.sign === '<=') {
      row[countVariables + index] = 1; // slack variable
    } else if (task.sign === '>=') {
      row[countVariables + index] = -1; // surplus variable
      row[countVariables + countTasks + index] = 1; // artificial variable
    }

    tableau.push(row);
  }

  // Строка целевой функции
  const objectiveRow = [
    ...targetFuncCoefficients,
    ...Array(countTasks + countTasks).fill(0), // Для slack и artificial переменных
    0
  ];

  if (findDirect === 'min') {
    objectiveRow.forEach((_val, index) => objectiveRow[index] *= -1); // Меняем знак для минимизации
  }

  tableau.push(objectiveRow);

  // Симплекс итерации
  let isOptimal = false;

  while (!isOptimal) {
    // Поиск ведущего столбца
    let pivotColumnIndex = -1;
    let maxAbsValue = 0; // Для хранения максимального по модулю значения

    if (findDirect === 'max') {
        // Ищем максимальный положительный коэффициент по модулю
        for (let j = 0; j < tableau[tableau.length - 1].length - 1; j++) {
            if (tableau[tableau.length - 1][j] > 0 && Math.abs(tableau[tableau.length - 1][j]) > maxAbsValue) {
                maxAbsValue = Math.abs(tableau[tableau.length - 1][j]);
                pivotColumnIndex = j;
            }
        }
    } else {
        // Ищем максимальный отрицательный коэффициент по модулю
        for (let j = 0; j < tableau[tableau.length - 1].length - 1; j++) {
            if (tableau[tableau.length - 1][j] < 0 && Math.abs(tableau[tableau.length - 1][j]) > maxAbsValue) {
                maxAbsValue = Math.abs(tableau[tableau.length - 1][j]);
                pivotColumnIndex = j;
            }
        }
    }
    console.log(`Ведущий столбец: ${pivotColumnIndex}`);

    // Проверка на оптимальность
    if (pivotColumnIndex === -1) {
        isOptimal = true;
        console.log("Оптимальное решение найдено.");
        break;
    }

    // Поиск ведущей строки
    let pivotRowIndex = -1;
    let minRatio = Infinity;

    for (let i = 0; i < countTasks; i++) {
        if (tableau[i][pivotColumnIndex] > 0) {
            const ratio = tableau[i][tableau[i].length - 1] / tableau[i][pivotColumnIndex];
            if (ratio < minRatio) {
                minRatio = ratio;
                pivotRowIndex = i;
            }
        }
    }

    if (pivotRowIndex === -1) {
        throw new Error("Неограниченное решение.");
    }

    console.log(`Ведущая строка: ${pivotRowIndex}, Минимальное отношение: ${minRatio}`);

    // Нормализация ведущей строки
    const pivotValue = tableau[pivotRowIndex][pivotColumnIndex];
    for (let j = 0; j < tableau[0].length; j++) {
        tableau[pivotRowIndex][j] /= pivotValue;
    }
    console.log(`Нормализованная ведущая строка:`, tableau[pivotRowIndex]);

    // Обновление остальных строк
    for (let i = 0; i < tableau.length; i++) {
        if (i !== pivotRowIndex) {
            const factor = tableau[i][pivotColumnIndex];
            for (let j = 0; j < tableau[0].length; j++) {
                tableau[i][j] -= factor * tableau[pivotRowIndex][j];
            }
            console.log(`Обновленная строка ${i}:`, tableau[i]);
        }
    }
  }


  // Извлечение решения
  const solution: { [key: string]: number } = {};
  for (let i = 0; i < countVariables; i++) {
    solution[`x${i + 1}`] = 0;
  }

  for (let i = 0; i < tableau.length - 1; i++) {
    const basicVarIndex = tableau[i].slice(0, countVariables).indexOf(1);
    if (basicVarIndex !== -1 && tableau[i].slice(0, countVariables).lastIndexOf(1) === basicVarIndex) {
      solution[`x${basicVarIndex + 1}`] = Math.ceil(tableau[i][tableau[i].length - 1]);
    }
  }

  // Вычисление значения целевой функции
  const optimalValue = targetFuncCoefficients.reduce((sum, coeff, index) => {
    return sum + coeff * solution[`x${index + 1}`];
  }, 0);

  return {
    solution,
    value: optimalValue,
  };
};