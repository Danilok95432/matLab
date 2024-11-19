import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { Tasks } from "../types/Tasks"
import { resolve } from "../helpers/resolve"

type PayloadStartProps = {
  findDirect: string
  countVariables: number
  countTasks: number
}

type PayloadTasksProps = {
  tasks: Tasks[]
}

export interface resolutionState {
  startData: { findDirect: string; countVariables: number; countTasks: number },
  tasksData: Tasks[],
  result: {
    solution: {
    [key: string]: number;
    },
    value: number
  }
}

const initialState: resolutionState = {
  startData: {
    findDirect: "max",
    countVariables: 1,
    countTasks: 1,
  },
  tasksData: [],
  result: {
    solution: {},
    value: 0
  }
};

export const resolutionSlice = createSlice({
  name: "resolution",
  initialState,
  reducers: {
    setStartData: (state, action: PayloadAction<PayloadStartProps>) => {
      return {
        ...state,
        startData: action.payload,
      }
    },
    setTasksData: (state, action: PayloadAction<PayloadTasksProps>) => {
      return {
        ...state,
        tasksData: action.payload.tasks
      }
    },
    simplexMethod: (state) => {
      return {
        ...state,
        result: resolve(state)
      }
    }
  },
});

export const { setStartData, setTasksData, simplexMethod } = resolutionSlice.actions;

export default resolutionSlice.reducer;
