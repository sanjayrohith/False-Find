import { AnalysisResult } from '@/hooks/useFakeNewsDetector';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle2, XCircle, AlertCircle, ChevronDown, FileSearch, Stamp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface VerdictDisplayProps {
  result: AnalysisResult;
}

export function VerdictDisplay({ result }: VerdictDisplayProps) {
  const [isOpen, setIsOpen] = useState(true);

  const verdictConfig = {
    verified: {
      icon: CheckCircle2,
      label: 'VERIFIED',
      stamp: 'AUTHENTIC',
      bgClass: 'bg-success/10',
      textClass: 'text-success',
      borderClass: 'border-success',
      progressClass: 'bg-success',
      stampRotation: '-rotate-12',
    },
    fake: {
      icon: XCircle,
      label: 'FAKE NEWS',
      stamp: 'DISPUTED',
      bgClass: 'bg-destructive/10',
      textClass: 'text-destructive',
      borderClass: 'border-destructive',
      progressClass: 'bg-destructive',
      stampRotation: 'rotate-6',
    },
    uncertain: {
      icon: AlertCircle,
      label: 'UNCERTAIN',
      stamp: 'UNVERIFIED',
      bgClass: 'bg-warning/10',
      textClass: 'text-warning',
      borderClass: 'border-warning',
      progressClass: 'bg-warning',
      stampRotation: '-rotate-6',
    },
  };

  const config = verdictConfig[result.verdict];
  const Icon = config.icon;

  return (
    <div className="border-2 border-foreground bg-card relative overflow-hidden animate-fade-in">
      {/* Newspaper texture */}
      <div className="absolute inset-0 newspaper-texture opacity-30 pointer-events-none" />
      
      {/* Header band */}
      <div className="bg-foreground text-background px-4 py-3 flex items-center gap-3">
        <FileSearch className="h-5 w-5" />
        <h2 className="font-headline font-bold uppercase tracking-wider text-sm">
          Verification Report
        </h2>
        <div className="ml-auto text-xs opacity-70">
          {new Date(result.timestamp).toLocaleTimeString()}
        </div>
      </div>

      <div className="p-6 relative space-y-6">
        {/* Main Verdict with Stamp */}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-full border-2",
              config.bgClass,
              config.borderClass
            )}>
              <Icon className={cn("h-10 w-10", config.textClass)} />
            </div>
            <div>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-lg font-headline font-bold px-4 py-1.5 rounded-none border-2",
                  config.textClass, 
                  config.borderClass,
                  config.bgClass
                )}
              >
                {config.label}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2 font-body">
                {result.verdict === 'verified' && 'This content appears credible based on our analysis'}
                {result.verdict === 'fake' && 'This content shows multiple signs of misinformation'}
                {result.verdict === 'uncertain' && 'Unable to determine authenticity with confidence'}
              </p>
            </div>
          </div>
          
          {/* Stamp seal */}
          <div className={cn(
            "absolute -right-2 top-0 border-4 rounded px-4 py-2 font-headline font-bold text-sm uppercase tracking-widest opacity-80",
            config.textClass,
            config.borderClass,
            config.stampRotation
          )}>
            <Stamp className="h-4 w-4 inline mr-1" />
            {config.stamp}
          </div>
        </div>

        {/* Confidence Meter - styled like a gauge */}
        <div className="border-2 border-border bg-background/50 p-4">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="font-headline font-bold uppercase tracking-wider text-xs">
              Confidence Index
            </span>
            <span className={cn("font-mono text-2xl font-bold", config.textClass)}>
              {result.confidence}%
            </span>
          </div>
          <div className="relative h-4 bg-muted rounded-none border border-border overflow-hidden">
            <div 
              className={cn("absolute top-0 left-0 h-full transition-all duration-1000 ease-out", config.progressClass)}
              style={{ width: `${result.confidence}%` }}
            />
            {/* Tick marks */}
            <div className="absolute inset-0 flex">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex-1 border-r border-border/30 last:border-r-0" />
              ))}
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>

        {/* Explanations - styled like newspaper columns */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 border-2 border-border bg-secondary/50 hover:bg-secondary transition-colors">
            <span className="font-headline font-bold uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-4 h-0.5 bg-foreground inline-block" />
              Analysis Findings
            </span>
            <ChevronDown className={cn(
              "h-5 w-5 transition-transform duration-200",
              isOpen && "rotate-180"
            )} />
          </CollapsibleTrigger>
          <CollapsibleContent className="border-x-2 border-b-2 border-border">
            <div className="p-4 space-y-3">
              {result.reasons.map((reason, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-3 bg-background/50 border-l-4 border-muted-foreground"
                >
                  <span className="font-mono text-xs text-muted-foreground mt-0.5">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="font-body text-sm leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Analyzed Text Preview - styled like a clipping */}
        <div className="relative p-4 bg-secondary/30 border-2 border-dashed border-border">
          <div className="absolute -top-3 left-4 bg-card px-2 text-xs font-headline uppercase tracking-wider text-muted-foreground">
            Submitted Article
          </div>
          <p className="font-body text-sm italic leading-relaxed line-clamp-4 mt-1">
            "{result.text}"
          </p>
        </div>
      </div>
    </div>
  );
}
