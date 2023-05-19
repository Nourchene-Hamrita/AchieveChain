import { Route, Routes } from "react-router-dom"
import GradesPage from "../pages/GradesPage/GradesPage"
import GradeList from "../components/grades/GradeList"

const GradesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<GradesPage />} />
      <Route path="/list" element={<GradeList />} />
    </Routes>
  )
}
export default GradesRoutes