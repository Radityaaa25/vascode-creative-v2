import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { lazy, Suspense } from "react";

const Index = lazy(() => import("./pages/Index"));
const CategoryPortfolio = lazy(() => import("./pages/CategoryPortfolio"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.VITE_BASE || "/"}>
          <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-void"><div className="h-8 w-8 animate-spin rounded-full border-2 border-volt border-t-transparent" /></div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/portfolio/:category" element={<CategoryPortfolio />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;