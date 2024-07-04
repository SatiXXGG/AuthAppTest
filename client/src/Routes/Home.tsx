import useUser from "../CustomHooks/useUser";
import NavBar from "../Components/NavBar";

function App() {
  useUser();

  return (
    <>
      <NavBar></NavBar>
    </>
  );
}

export default App;
