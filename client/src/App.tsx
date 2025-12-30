import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import ArtistPage from "@/pages/ArtistPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      
      <Route path="/artist1">
        <ArtistPage artistId="artist1" artistName="Yuno $weez" />
      </Route>

      <Route path="/artist2">
        <ArtistPage artistId="artist2" artistName="J@M@R" />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
