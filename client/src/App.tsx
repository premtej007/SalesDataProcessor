import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sparkles, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import Home from "@/pages/home";
import HistoryPage from "@/pages/history";
import NotFound from "@/pages/not-found";

function Navigation() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="hidden sm:inline">Amazon Listing Optimizer</span>
            </Link>
            <nav className="flex items-center gap-2">
              <Button
                variant={location === "/" ? "secondary" : "ghost"}
                size="sm"
                asChild
              >
                <Link href="/" data-testid="link-home">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Optimize
                </Link>
              </Button>
              <Button
                variant={location === "/history" ? "secondary" : "ghost"}
                size="sm"
                asChild
              >
                <Link href="/history" data-testid="link-history">
                  <History className="h-4 w-4 mr-2" />
                  History
                </Link>
              </Button>
            </nav>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/history" component={HistoryPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="optimizer-theme">
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <Router />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
