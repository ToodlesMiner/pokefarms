import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";

const App = () => {
  return (
    <>
      <Routes>
        <Route index path="/" element={<Home />} />
      </Routes>
    </>
  );
};

export default App;
