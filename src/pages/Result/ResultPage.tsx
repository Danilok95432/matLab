import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import styles from "./index.module.scss";
import { useNavigate } from "react-router-dom";

export const ResultPage = () => {
  const result = useSelector((state: RootState) => state.resolution.result);
  const navigate = useNavigate();

  const handleRestart = () => {
    navigate("/");
  };

  if (result) {
    return (
      <div className={styles.resultPage}>
        <h1>Результаты вычислений</h1>
        {Object.entries(result.solution).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {value.toString()}
          </div>
        ))}
        <h2>Значение целевой функции: {result.value}</h2>
        <button onClick={handleRestart} className={styles.submitButton}>
          Попробовать снова
        </button>
      </div>
    );
  }
  return (
    <div>
      <button onClick={handleRestart} className={styles.submitButton}>
        Попробовать снова
      </button>
    </div>
  );
};
