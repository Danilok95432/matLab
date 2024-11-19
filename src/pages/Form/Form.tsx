import { useForm, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"

import styles from './index.module.scss'
import { Select, MenuItem, TextField, InputLabel } from "@mui/material"
import { useDispatch } from "react-redux"
import { setStartData } from "../../store/resolution"
import { useNavigate } from "react-router-dom"

interface FormValues {
  findDirect: string,
  countVariables: number,
  countTasks: number,
}

const schema = Yup.object().shape({
  findDirect: Yup.string().required("Это поле обязательно"),
  countVariables: Yup.number().required("Это поле обязательно"),
  countTasks: Yup.number().required("Это поле обязательно"),
});

export const Form = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      dispatch(setStartData(data))
      navigate('/next-step')
    } catch (error) {
      alert(`Ошибка формы: ${error}`)
    }
  };

  return(
    <div className={styles.formPage}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.resolveForm}
      >
        <h2>Решение системы уравнений симплекс методом</h2>
        <div className={styles.formGroup}>
          <InputLabel id="findDirect">Что ищем (Макс/Мин)?</InputLabel>
          <Select 
            labelId="findDirect"
            defaultValue={'max'} 
            id="findDirect"
            {...register("findDirect")}
            >
            <MenuItem value={'max'}>{`Max`}</MenuItem>
            <MenuItem value={'min'}>{`Min`}</MenuItem>
          </Select>
          {errors.findDirect && (
            <p className={styles.error}>{errors.findDirect.message}</p>
          )}
        </div>
        <div className={styles.formGroup}>
          <InputLabel htmlFor="countVariables">Количество переменных</InputLabel>
          <TextField id="countVariables" variant="outlined" {...register("countVariables")}/>
          {errors.countVariables && (
            <p className={styles.error}>{errors.countVariables.message}</p>
          )}
        </div>
        <div className={styles.formGroup}>
          <InputLabel htmlFor="countTasks">Количество выражений</InputLabel>
          <TextField id="countTasks" variant="outlined" {...register("countTasks")}/>
          {errors.countTasks && (
            <p className={styles.error}>{errors.countTasks.message}</p>
          )}
        </div>
        
        <button type="submit" className={styles.submitButton}>
          Решить
        </button>
      </form>
    </div>
  )
}