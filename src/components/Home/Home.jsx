import Nav from "../nav/Nav";
import stl from "./Home.module.css";

const Home = () => {
  return (
    <div className={stl.home}>
      <Nav />
      <img src="../Logo.png" alt="Mainlogo" className={stl.mainLogo} />

      <div className={stl.mainApp}></div>
      <img src="../bg.png" alt="Forrest" className={stl.forrestBG} />
    </div>
  );
};

export default Home;
