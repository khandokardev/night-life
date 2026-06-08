import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { AdminLayout } from "@/components/layout";
import type { ApiError } from "@/lib/mutator";

import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Users from "@/pages/users";
import AdminRoles from "@/pages/admin-roles";
import Bookings from "@/pages/bookings";
import Reviews from "@/pages/reviews";
import Settings from "@/pages/settings";
import Notifications from "@/pages/notifications";
import Categories from "@/pages/categories";
import Clubs from "@/pages/clubs";
import Restaurants from "@/pages/restaurants";
import Tours from "@/pages/tours";
import Products from "@/pages/products";
import Events from "@/pages/events";
import Promotions from "@/pages/promotions";
import Chat from "@/pages/chat";
import Payments from "@/pages/payments";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        const status = (error as ApiError)?.status;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 1;
      },
    },
  },
});

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Redirect to="/login" />;
  return (
    <AdminLayout>
      <Component />
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={() => <Redirect to="/dashboard" />} />
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/users">
        <ProtectedRoute component={Users} />
      </Route>
      <Route path="/admin-roles">
        <ProtectedRoute component={AdminRoles} />
      </Route>
      <Route path="/categories">
        <ProtectedRoute component={Categories} />
      </Route>
      <Route path="/clubs">
        <ProtectedRoute component={Clubs} />
      </Route>
      <Route path="/restaurants">
        <ProtectedRoute component={Restaurants} />
      </Route>
      <Route path="/tours">
        <ProtectedRoute component={Tours} />
      </Route>
      <Route path="/products">
        <ProtectedRoute component={Products} />
      </Route>
      <Route path="/events">
        <ProtectedRoute component={Events} />
      </Route>
      <Route path="/bookings">
        <ProtectedRoute component={Bookings} />
      </Route>
      <Route path="/reviews">
        <ProtectedRoute component={Reviews} />
      </Route>
      <Route path="/notifications">
        <ProtectedRoute component={Notifications} />
      </Route>
      <Route path="/promotions">
        <ProtectedRoute component={Promotions} />
      </Route>
      <Route path="/settings">
        <ProtectedRoute component={Settings} />
      </Route>
      <Route path="/chat">
        <ProtectedRoute component={Chat} />
      </Route>
      <Route path="/payments">
        <ProtectedRoute component={Payments} />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="dark">
            <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
              <Router />
            </WouterRouter>
            <Toaster />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
