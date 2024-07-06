import AppSection from "../Components/App";
import NavBar from "../Components/NavBar";
import SearchBar from "../Components/SearchBar";
import useApps from "../CustomHooks/useApps";

function App() {
  const { apps } = useApps();

  return (
    <>
      <NavBar></NavBar>
      <main className="items-center justify-center w-screen h-screen mx-auto flex flex-col">
        <SearchBar></SearchBar>
        <section className="gap-3 grid grid-cols-1 md:grid-cols-3 px-3 md:w-[50rem]">
          {apps?.map((app) => (
            <AppSection
              key={app.id}
              title={app.title}
              description={app.description}
              id={app.id}
              created_at={app.created_at}
            />
          ))}
        </section>
      </main>
    </>
  );
}

export default App;
