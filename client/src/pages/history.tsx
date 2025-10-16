import { useQuery } from "@tanstack/react-query";
import { History as HistoryIcon, Calendar, ChevronRight, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Optimization } from "@shared/schema";

export default function History() {
  const { data: optimizations, isLoading } = useQuery<Optimization[]>({
    queryKey: ["/api/history"],
  });

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-2 flex items-center gap-3">
            <HistoryIcon className="h-8 w-8 text-primary" />
            Optimization History
          </h1>
          <p className="text-lg text-muted-foreground">
            View all your previous product listing optimizations
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32 mt-2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!optimizations || optimizations.length === 0) && (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <HistoryIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No history yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Your optimization history will appear here once you start optimizing product listings
            </p>
          </div>
        )}

        {/* History List */}
        {!isLoading && optimizations && optimizations.length > 0 && (
          <div className="space-y-4">
            {optimizations.map((optimization) => (
              <Card key={optimization.id} className="hover-elevate transition-all" data-testid={`card-history-${optimization.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <Package className="h-5 w-5 text-primary" />
                        <span className="font-mono text-lg" data-testid={`text-asin-${optimization.id}`}>
                          {optimization.asin}
                        </span>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {formatDate(optimization.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      {optimization.suggestedKeywords.length} keywords
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="details" className="border-none">
                      <AccordionTrigger className="hover:no-underline py-2 text-sm font-medium">
                        View Optimization Details
                        <ChevronRight className="h-4 w-4 transition-transform" />
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Original */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-foreground">Original</h4>
                              <Badge variant="outline">Amazon</Badge>
                            </div>
                            <div>
                              <h5 className="text-xs font-medium text-muted-foreground mb-1">Title</h5>
                              <p className="text-sm text-foreground">{optimization.originalTitle}</p>
                            </div>
                            <div>
                              <h5 className="text-xs font-medium text-muted-foreground mb-2">Bullet Points</h5>
                              <ul className="space-y-1">
                                {optimization.originalBullets.map((bullet, idx) => (
                                  <li key={idx} className="text-xs text-foreground flex gap-2">
                                    <span className="text-muted-foreground">•</span>
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-xs font-medium text-muted-foreground mb-1">Description</h5>
                              <p className="text-xs text-foreground leading-relaxed">
                                {optimization.originalDescription}
                              </p>
                            </div>
                          </div>

                          {/* Optimized */}
                          <div className="space-y-4 bg-chart-2/5 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-foreground">Optimized</h4>
                              <Badge className="bg-chart-2 text-white hover:bg-chart-2/90">AI Enhanced</Badge>
                            </div>
                            <div>
                              <h5 className="text-xs font-medium text-muted-foreground mb-1">Title</h5>
                              <p className="text-sm text-foreground font-medium">
                                {optimization.optimizedTitle}
                              </p>
                            </div>
                            <div>
                              <h5 className="text-xs font-medium text-muted-foreground mb-2">Bullet Points</h5>
                              <ul className="space-y-1">
                                {optimization.optimizedBullets.map((bullet, idx) => (
                                  <li key={idx} className="text-xs text-foreground flex gap-2">
                                    <span className="text-chart-2">✓</span>
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-xs font-medium text-muted-foreground mb-1">Description</h5>
                              <p className="text-xs text-foreground leading-relaxed">
                                {optimization.optimizedDescription}
                              </p>
                            </div>
                            <div>
                              <h5 className="text-xs font-medium text-muted-foreground mb-2">Keywords</h5>
                              <div className="flex flex-wrap gap-1">
                                {optimization.suggestedKeywords.map((keyword, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="border-chart-2 text-chart-2 text-xs"
                                  >
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
