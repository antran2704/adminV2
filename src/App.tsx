import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider as ProviderRedux } from "react-redux";

import PublicLayout from "./layout/PublicLayout";
import LoginPage from "./page/LoginPage";
import { store } from "./store";
import PrivateLayout from "./layout/PrivateLayout";
import AuthenGuard from "./components/Guard/AuthenGuard";
import HomePage from "./page/HomePage";

function App() {
  return (
    <ProviderRedux store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
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

          {/* Private routes */}
          <Route
            element={
              <AuthenGuard>
                <PrivateLayout />
              </AuthenGuard>
            }
          >
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProviderRedux>
  );
}

export default App;
