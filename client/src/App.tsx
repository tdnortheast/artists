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
      
      <Route path="/artist/:id">
        {(params) => {
          const artistName = params.id === "1" ? "Yuno $weez" : "J@M@R";
          return <ArtistPage artistId={`artist${params.id}`} artistName={artistName} />;
        }}
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
