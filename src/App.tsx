import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider as ProviderRedux } from "react-redux";

import PublicLayout from "./layout/PublicLayout";
import LoginPage from "./page/LoginPage";
import { store } from "./store";

function App() {
  return (
    <ProviderRedux store={store}>
      <BrowserRouter>
        <Routes>
          <Route>
            <Route
              path="/login"
              element={
                <PublicLayout>
                  <LoginPage />
                </PublicLayout>
              }
            />
          </Route>
          <Route path="/" element={<h1>Home page</h1>} />
        </Routes>
      </BrowserRouter>
    </ProviderRedux>
  );
}

export default App;
