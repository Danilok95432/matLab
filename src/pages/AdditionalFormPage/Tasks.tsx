import { useDispatch, useSelector } from "react-redux"
import { useForm, SubmitHandler } from "react-hook-form"
import { RootState } from "../../store/store"
import styles from "./index.module.scss"
import { TaskForm } from "./components/TaskForm/TaskForm"
import { setTasksData, simplexMethod } from "../../store/resolution"
import { useNavigate } from "react-router-dom"

interface FormValues {
  tasks: {
    coefficients: number[]
    freeMember: number
    sign: string
  }[];
}

export const Tasks = () => {
  const startData = useSelector(
    (state: RootState) => state.resolution.startData
  )
  const { countTasks } = startData
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      tasks: Array.from({ length: countTasks }, () => ({
        coefficients: [],
        freeMember: 0,
        sign: "",
      })),
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(setTasksData(data))
    dispatch(simplexMethod())
    navigate('/result')
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.tasksContainer}>
      {Array.from({ length: countTasks }, (_, index) => (
        <TaskForm key={index} index={index} control={control} />
      ))}
      <button className={styles.submitButton} type="submit">Отправить все задачи</button>
    </form>
  );
};
