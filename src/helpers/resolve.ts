import { resolutionState } from "../store/resolution";

export const resolve = (state: resolutionState) => {
  const { countVariables, countTasks, findDirect } = state.startData;
  const tasksData = state.tasksData;

  // Error Handling for Invalid Input
  if (countVariables <= 0 || countTasks <= 0 || tasksData.length !== countTasks) {
    console.log("Неверный ввод данных")
  }

  // 1. Преобразовать в стандартную форму (развернуть): добавить слабые места /излишки и искусственные переменные

  const tableau: number[][] = [];
  const b: number[] = []; // свободные члены

  for (let i = 0; i < countTasks; i++) {
    const task = tasksData[i];
    const coefficients = task.coefficients;
    const slackVariable = task.sign === "<=" ? 1 : 0;  
    const surplusVariable = task.sign === ">=" ? -1 : 0;
    const artificialVariable = task.sign !== "<=" ? 1 : 0; 

    const row = [
      ...coefficients,
      slackVariable,
      surplusVariable,
      artificialVariable,
      task.freeMember,
    ];
    tableau.push(row);
    b.push(task.freeMember);
  }

  // Строка целевой функции
  const objectiveFunctionCoefficients = tasksData.map(t => -t.coefficients[0]); 
  const objectiveRow = [
    ...objectiveFunctionCoefficients,
    0, 0, ...Array(countTasks).fill(findDirect === 'min' ? -1 : 1), 0
  ];
  tableau.push(objectiveRow);



  // 2. Симплекс итерации
  let isOptimal = false;
  let iterations = 0;

  while (!isOptimal && iterations < 100) {
    iterations++;
    // 3. Поиск ведущего столбца (самый отрицательный в целевой строке)
    const pivotColumnIndex = tableau[tableau.length - 1].findIndex((val, i) => i < countVariables + 2 && val < 0);

    if (pivotColumnIndex === -1) {
      isOptimal = true;
      break;
    }

    // 4. Поиск ведущей строки (тест на минимальное соотношение)
    let minRatio = Infinity;
    let pivotRowIndex = -1;

    for (let i = 0; i < countTasks; i++) {
      if (tableau[i][pivotColumnIndex] > 0) {
        const ratio = b[i] / tableau[i][pivotColumnIndex];
        if (ratio < minRatio) {
          minRatio = ratio;
          pivotRowIndex = i;
        }
      }
    }

    if (pivotRowIndex === -1) {
      console.log("Неограниченное решение.")
    }

    const pivotValue = tableau[pivotRowIndex][pivotColumnIndex];
    for (let j = 0; j < tableau[0].length; j++) {
      tableau[pivotRowIndex][j] /= pivotValue;
    }
    b[pivotRowIndex] /= pivotValue;

    for (let i = 0; i < tableau.length; i++) {
      if (i !== pivotRowIndex) {
        const factor = tableau[i][pivotColumnIndex];
        for (let j = 0; j < tableau[0].length; j++) {
          tableau[i][j] -= factor * tableau[pivotRowIndex][j];
        }
        b[i] -= factor * b[pivotRowIndex];
      }
    }
  }

  // 5. Извлекаем решение

  const solution: { [key: string]: number } = {};
  for (let i = 0; i < countVariables; i++) {
    solution[`x${i + 1}`] = tableau[i][tableau[i].length - 1];
  }
  const optimalValue = findDirect === 'max' ? -tableau[tableau.length - 1][tableau[0].length - 1] : tableau[tableau.length - 1][tableau[0].length - 1];

  return {
    solution,
    value: optimalValue, // Значение целевой функции
  };
};