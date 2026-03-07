import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Chat from "./pages/Chat";
import OrderSuccess from "./pages/OrderSuccess";
import OrderTrack from "./pages/OrderTrack";
import Profile from "./pages/Profile";
import ServerError from "./pages/ServerError";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ServerError />
);

export default App;
