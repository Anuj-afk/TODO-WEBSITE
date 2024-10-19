import { Routes, Route } from "react-router-dom";
import Today from "./components/Today/Today";
import Upcoming from "./components/Upcoming/Upcoming";
import Completed from "./components/Completed/Completed";
import Missed from "./components/Missed/Missed";
import List from "./components/List/List";

function App() {

  return (
    <Routes>
      <Route path="/Today" element={<Today></Today>}></Route>
      <Route path="/Upcoming" element={<Upcoming></Upcoming>}></Route>
      <Route path="/Completed" element={<Completed></Completed>}></Route>
      <Route path="/Missed" element={<Missed></Missed>}></Route>
      <Route path="/List" element={<List></List>}></Route>
    </Routes>
  );
}
export default App;