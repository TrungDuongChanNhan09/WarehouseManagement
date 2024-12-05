import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";
import { Fragment } from "react";
function App() {
  return (
    <BrowserRouter>
      <div id="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            const Layout = Fragment;
            return (
              <Route
                key={index}
                path={route.path}
                element={<Layout>{Page}</Layout>}
              />
            );
          })}
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;