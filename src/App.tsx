import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/login"></Route>
        </Route>
        <Route path="/" element={<h1>Home page</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
