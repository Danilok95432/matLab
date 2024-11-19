import './App.css'
import { Tasks } from './pages/AdditionalFormPage/Tasks';
import { Form } from './pages/Form/Form'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { ResultPage } from './pages/Result/ResultPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/next-step" element={<Tasks />} />
        <Route path='/result' element={<ResultPage />} />
      </Routes>
    </Router>
  )
}

export default App
