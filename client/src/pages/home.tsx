import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Sparkles, History as HistoryIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { asinSchema, type AsinInput, type Optimization } from "@shared/schema";

interface ProductData {
  title: string;
  bullets: string[];
  description: string;
}

interface OptimizedData {
  optimizedTitle: string;
  optimizedBullets: string[];
  optimizedDescription: string;
  suggestedKeywords: string[];
}

export default function Home() {
  const { toast } = useToast();
  const [currentAsin, setCurrentAsin] = useState<string>("");
  const [showComparison, setShowComparison] = useState(false);
  const [originalData, setOriginalData] = useState<ProductData | null>(null);
  const [optimizedData, setOptimizedData] = useState<OptimizedData | null>(null);

  const form = useForm<AsinInput>({
    resolver: zodResolver(asinSchema),
    defaultValues: {
      asin: "",
    },
  });

  // Fetch and optimize mutation
  const optimizeMutation = useMutation({
    mutationFn: async (asin: string) => {
      const response = await apiRequest("POST", "/api/optimize", { asin });
      return response;
    },
    onSuccess: (data) => {
      setOriginalData({
        title: data.originalTitle,
        bullets: data.originalBullets,
        description: data.originalDescription,
      });
      setOptimizedData({
        optimizedTitle: data.optimizedTitle,
        optimizedBullets: data.optimizedBullets,
        optimizedDescription: data.optimizedDescription,
        suggestedKeywords: data.suggestedKeywords,
      });
      setShowComparison(true);
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
      toast({
        title: "Optimization Complete!",
        description: "Your product listing has been successfully optimized.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Optimization Failed",
        description: error.message || "Failed to optimize product listing. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AsinInput) => {
    setCurrentAsin(data.asin);
    setShowComparison(false);
    optimizeMutation.mutate(data.asin);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-foreground mb-4">
            Amazon Listing Optimizer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Use AI to optimize your Amazon product listings with improved titles, bullet points,
            descriptions, and keyword suggestions
          </p>
        </div>

        {/* ASIN Input Form */}
        <Card className="max-w-2xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Enter Product ASIN
            </CardTitle>
            <CardDescription>
              Enter a 10-character Amazon Standard Identification Number to optimize
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="asin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ASIN</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="B07H65KP63"
                          className="font-mono text-lg"
                          data-testid="input-asin"
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={optimizeMutation.isPending}
                  data-testid="button-optimize"
                >
                  {optimizeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Optimize Listing
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Loading State */}
        {optimizeMutation.isPending && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-full" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-full" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Comparison View */}
        {showComparison && originalData && optimizedData && optimizedData.optimizedBullets && optimizedData.suggestedKeywords && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-chart-2" />
              Optimization Results
              <Badge variant="secondary" className="ml-2 font-mono">
                {currentAsin}
              </Badge>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Original Content */}
              <Card data-testid="card-original">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Original</span>
                    <Badge variant="secondary">Amazon</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Title</h3>
                    <p className="text-base text-foreground" data-testid="text-original-title">
                      {originalData.title}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Bullet Points</h3>
                    <ul className="space-y-2">
                      {originalData.bullets && originalData.bullets.map((bullet, index) => (
                        <li key={index} className="flex gap-2 text-sm text-foreground">
                          <span className="text-muted-foreground mt-1">•</span>
                          <span data-testid={`text-original-bullet-${index}`}>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                    <p className="text-sm text-foreground leading-relaxed" data-testid="text-original-description">
                      {originalData.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Optimized Content */}
              <Card className="border-chart-2/20 bg-chart-2/5" data-testid="card-optimized">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Optimized</span>
                    <Badge className="bg-chart-2 text-white hover:bg-chart-2/90">
                      AI Enhanced
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Title</h3>
                    <p className="text-base text-foreground font-medium" data-testid="text-optimized-title">
                      {optimizedData.optimizedTitle}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Bullet Points</h3>
                    <ul className="space-y-2">
                      {optimizedData.optimizedBullets && optimizedData.optimizedBullets.map((bullet, index) => (
                        <li key={index} className="flex gap-2 text-sm text-foreground">
                          <span className="text-chart-2 mt-1">✓</span>
                          <span data-testid={`text-optimized-bullet-${index}`}>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                    <p className="text-sm text-foreground leading-relaxed" data-testid="text-optimized-description">
                      {optimizedData.optimizedDescription}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Suggested Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {optimizedData.suggestedKeywords && optimizedData.suggestedKeywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="border-chart-2 text-chart-2" data-testid={`badge-keyword-${index}`}>
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!showComparison && !optimizeMutation.isPending && (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No optimization yet</h3>
            <p className="text-sm text-muted-foreground">
              Enter an ASIN above to get started with AI-powered optimization
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
