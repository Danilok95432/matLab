import React from "react";
import { Controller } from "react-hook-form";
import { TextField, InputLabel, Select, MenuItem } from "@mui/material";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";

interface TaskFormProps {
  index: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
}

export const TaskForm: React.FC<TaskFormProps> = ({ index, control }) => {
  const data = useSelector((state: RootState) => state.resolution.startData);
  const { countVariables } = data;

  return (
    <div className={styles.taskContainer}>
      <h3>Форма выражения {index + 1}</h3>
      {Array.from({ length: countVariables }, (_, varIndex) => (
        <Controller
          key={`coeff-${varIndex}`}
          name={`tasks.${index}.coefficients.${varIndex}`}
          control={control}
          render={({ field }) => (
            <TextField
              variant="outlined"
              label={`Коэффициент переменной ${varIndex + 1}`}
              type="number"
              {...field}
              value={field.value !== undefined ? field.value : 0}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                field.onChange(isNaN(value) ? 0 : value);
              }}
              error={!!field.value && isNaN(field.value)}
              helperText={
                !!field.value && isNaN(field.value) ? "Должно быть числом" : ""
              }
            />
          )}
        />
      ))}
      <Controller
        name={`tasks.${index}.freeMember`}
        control={control}
        render={({ field }) => (
          <TextField
            variant="outlined"
            label="Свободный член"
            type="number"
            {...field}
            error={!!field.value && isNaN(field.value)}
            helperText={
              !!field.value && isNaN(field.value) ? "Должно быть числом" : ""
            }
          />
        )}
      />
      <Controller
        name={`tasks.${index}.sign`}
        control={control}
        render={({ field }) => (
          <div>
            <InputLabel id={`sign-label-${index}`}>Знак</InputLabel>
            <div className={styles.selectForm}>
              <Select
                labelId={`sign-label-${index}`}
                {...field}
                error={!!field.value && field.value === ""}
              >
                <MenuItem value="">Выберите знак</MenuItem>
                <MenuItem value="=">{`=`}</MenuItem>
                <MenuItem value="<=">{`<=`}</MenuItem>
                <MenuItem value=">=">{`>=`}</MenuItem>
              </Select>
            </div>
            {field.value === "" && (
              <p className={styles.error}>Выберите знак</p>
            )}
          </div>
        )}
      />
    </div>
  );
};
