import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./components/ui/use-toast";
import Home from "./components/home";
import routes from "tempo-routes";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingOverlay from "./components/LoadingOverlay";

function App() {
  const { toast } = useToast();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Suspense fallback={<LoadingOverlay />}>
          <>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
            <Toaster />
          </>
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
