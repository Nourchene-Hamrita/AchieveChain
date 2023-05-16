import { Route, Routes } from "react-router-dom"
import BadgesPage from "../pages/BadgesPage/BagdesPage"
import BadgeList from "../components/badges/BadgeList"

const BadgesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BadgesPage />} />
      <Route path="/list" element={<BadgeList />} />
    </Routes>
  )
}
export default BadgesRoutes