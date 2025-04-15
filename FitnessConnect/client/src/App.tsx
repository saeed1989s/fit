import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import TrainersPage from "@/pages/trainers-page";
import TrainerProfilePage from "@/pages/trainer-profile";
import WorkoutPlans from "@/pages/workout-plans";
import NutritionPlans from "@/pages/nutrition-plans";
import ShopPage from "@/pages/shop-page";
import ProfilePage from "@/pages/profile-page";
import { ProtectedRoute } from "@/lib/protected-route";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

function Router() {
  const [location] = useLocation();
  const showNavbarFooter = location !== "/auth";
  
  return (
    <>
      {showNavbarFooter && <Navbar />}
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/trainers" component={TrainersPage} />
        <Route path="/trainers/:id" component={TrainerProfilePage} />
        <Route path="/workout-plans" component={WorkoutPlans} />
        <Route path="/nutrition-plans" component={NutritionPlans} />
        <Route path="/shop" component={ShopPage} />
        <ProtectedRoute path="/profile" component={ProfilePage} />
        <Route component={NotFound} />
      </Switch>
      {showNavbarFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
