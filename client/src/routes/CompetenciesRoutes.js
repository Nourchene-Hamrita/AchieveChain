import { Route, Routes } from "react-router-dom"

import CompetenciesPage from "../pages/CompetenciesPage/CompetenciesPage"
import CompetencyList from "../components/competencies/CompetencyList"

const CompetenciesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CompetenciesPage />} />
      <Route path="/list" element={<CompetencyList />} />

    </Routes>
  )
}
export default CompetenciesRoutes