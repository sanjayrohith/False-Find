import { useFakeNewsDetector } from '@/hooks/useFakeNewsDetector';
import { NewsInput } from '@/components/NewsInput';
import { VerdictDisplay } from '@/components/VerdictDisplay';
import { HistoryPanel } from '@/components/HistoryPanel';
import { Newspaper, Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Index = () => {
  const {
    isAnalyzing,
    currentResult,
    history,
    analyzeNews,
    clearHistory,
    loadFromHistory,
  } = useFakeNewsDetector();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background relative">
      {/* Newspaper texture overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
      
      {/* Header - Newspaper Masthead Style */}
      <header className="border-b-4 border-foreground bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between py-2 text-xs border-b border-border text-muted-foreground">
            <span>Est. 2024</span>
            <span className="font-medium">{currentDate}</span>
            <span>Vol. 1 No. 1</span>
          </div>
          
          {/* Main masthead */}
          <div className="py-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-px flex-1 bg-foreground max-w-[100px]" />
              <Shield className="h-6 w-6 text-foreground" />
              <div className="h-px flex-1 bg-foreground max-w-[100px]" />
            </div>
            <h1 className="font-newspaper-title text-4xl md:text-6xl tracking-wide">
              The Veritas Tribune
            </h1>
            <p className="font-headline text-sm md:text-base mt-2 italic text-muted-foreground">
              "Separating Fact from Fiction Since the Digital Age"
            </p>
            <div className="newspaper-divider mt-4 max-w-md mx-auto" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-foreground text-background text-xs font-bold uppercase tracking-widest">
            <Newspaper className="h-3 w-3" />
            News Verification Department
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr,320px] gap-8 items-start">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            {/* Breaking News Banner when analyzing */}
            {isAnalyzing && (
              <div className="bg-accent text-accent-foreground py-3 px-4 flex items-center justify-center gap-3 animate-pulse">
                <span className="font-headline font-bold uppercase tracking-wider text-sm">
                  ⚡ Breaking: Analysis in Progress ⚡
                </span>
              </div>
            )}

            <NewsInput onAnalyze={analyzeNews} isAnalyzing={isAnalyzing} />
            
            {currentResult && !isAnalyzing && (
              <VerdictDisplay result={currentResult} />
            )}

            {isAnalyzing && (
              <div className="border-2 border-border bg-card p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 newspaper-texture opacity-50" />
                <div className="relative">
                  <div className="inline-block">
                    <Newspaper className="h-16 w-16 mx-auto mb-4 text-muted-foreground animate-bounce" />
                  </div>
                  <h3 className="font-headline text-2xl font-bold mb-2">Investigating...</h3>
                  <p className="text-muted-foreground font-body">
                    Our verification team is examining the evidence
                  </p>
                  <div className="flex justify-center gap-1 mt-4">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-foreground rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!currentResult && !isAnalyzing && (
              <div className="border-2 border-dashed border-border bg-card/50 p-8 text-center">
                <div className="max-w-md mx-auto">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-headline text-xl font-bold mb-2">
                    Submit Your Story for Review
                  </h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">
                    In an era of information overload, truth matters. Paste any news headline 
                    or article above to run it through our verification analysis. We'll examine 
                    it for common markers of misinformation.
                  </p>
                </div>
              </div>
            )}

            {/* Disclaimer - newspaper classified ad style */}
            <Alert className="border-2 border-foreground bg-secondary/50">
              <AlertDescription className="text-xs text-center font-body leading-relaxed">
                <span className="font-bold uppercase tracking-wider">Notice to Readers:</span>{' '}
                This publication is intended for educational and demonstration purposes only. 
                Always verify news through multiple reputable sources before sharing.
              </AlertDescription>
            </Alert>
          </div>

          {/* Right Column - History (Sidebar) */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="border-l-4 border-foreground pl-4">
              <h2 className="font-headline font-bold text-lg uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-foreground inline-block" />
                Archives
              </h2>
            </div>
            <HistoryPanel 
              history={history} 
              onSelect={loadFromHistory} 
              onClear={clearHistory} 
            />
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-foreground mt-12 bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="font-newspaper-title text-2xl mb-2">The Veritas Tribune</div>
            <p className="text-xs text-muted-foreground font-body">
              © 2024 The Veritas Tribune • All Rights Reserved • Fighting Misinformation One Story at a Time
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
