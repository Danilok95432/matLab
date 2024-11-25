import { useForm, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"

import styles from './index.module.scss'
import { Select, MenuItem, TextField, InputLabel } from "@mui/material"
import { useDispatch } from "react-redux"
import { setStartData } from "../../store/resolution"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";

interface FormValues {
  findDirect: string,
  countVariables: number,
  countTasks: number,
  targetFuncCoefficients: number[]
}

const schema = Yup.object().shape({
  findDirect: Yup.string().required("Это поле обязательно"),
  countVariables: Yup.number().required("Это поле обязательно").min(1, "Должно быть хотя бы одно значение"),
  countTasks: Yup.number().required("Это поле обязательно").min(1, "Должно быть хотя бы одно значение"),
  targetFuncCoefficients: Yup.array()
    .of(Yup.number().required("Это поле обязательно"))
    .min(1, "Должно быть хотя бы одно значение"),
});

export const Form = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { 
      targetFuncCoefficients: []
    }
  });

  const [coefficientInputs, setCoefficientInputs] = useState<JSX.Element[]>([]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      dispatch(setStartData(data))
      navigate('/next-step')
    } catch (error) {
      alert(`Ошибка формы: ${error}`)
    }
  };

  useEffect(() => {
    const countVariables = watch("countVariables") || 0;
      //условие  watch("countVariables")  для запуска функции только после инициализации
    if (watch("countVariables")){
      updateCoefficientInputs(countVariables);
    }

  }, [watch("countVariables"),errors]);

  const updateCoefficientInputs = (countVariables:number) => {
    const inputs = [];
    for (let i = 0; i < countVariables; i++) {
      inputs.push(
        <div key={i} className={styles.formGroup}>
          <InputLabel htmlFor={`targetFuncCoefficient-${i}`}>
            Коэффициент {i + 1} целевой функции
          </InputLabel>
          <TextField
            type="number"
            id={`targetFuncCoefficient-${i}`}
            variant="outlined"
            {...register(`targetFuncCoefficients.${i}`)}
          />
          {errors.targetFuncCoefficients?.[i] && (
            <p className={styles.error}>
              {errors.targetFuncCoefficients?.[i]?.message}
            </p>
          )}
        </div>
      );
    }
    setCoefficientInputs(inputs);
  };

  return(
    <div className={styles.formPage}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.resolveForm}
      >
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
          <TextField type="number" id="countVariables" variant="outlined" {...register("countVariables")} />
          {errors.countVariables && (
            <p className={styles.error}>{errors.countVariables.message}</p>
          )}
        </div>
        <div className={styles.formGroup}>
          <InputLabel htmlFor="countTasks">Количество выражений</InputLabel>
          <TextField type="number" id="countTasks" variant="outlined" {...register("countTasks")}/>
          {errors.countTasks && (
            <p className={styles.error}>{errors.countTasks.message}</p>
          )}
        </div>
        {coefficientInputs}
        <button type="submit" className={styles.submitButton}>
          Решить
        </button>
      </form>
    </div>
  )
}