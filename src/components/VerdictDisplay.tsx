import { AnalysisResult } from '@/hooks/useFakeNewsDetector';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, XCircle, AlertCircle, ChevronDown, FileSearch, Stamp, Brain, Globe, Search, ExternalLink, Shield, ShieldAlert, ShieldQuestion } from 'lucide-react';
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

        {/* Enhanced Analysis Accordion Sections */}
        <Accordion type="multiple" className="space-y-2">
          {/* Emotional Analysis Section */}
          {result.emotionalAnalysis && (
            <AccordionItem value="emotional" className="border-2 border-border">
              <AccordionTrigger className="px-4 py-3 bg-secondary/30 hover:bg-secondary/50 hover:no-underline">
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <span className="font-headline font-bold uppercase tracking-wider text-sm">
                    Emotional Analysis
                  </span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "ml-2 text-xs",
                      result.emotionalAnalysis.manipulationLevel === 'low' && "border-success text-success",
                      result.emotionalAnalysis.manipulationLevel === 'medium' && "border-warning text-warning",
                      result.emotionalAnalysis.manipulationLevel === 'high' && "border-destructive text-destructive"
                    )}
                  >
                    {result.emotionalAnalysis.manipulationLevel.toUpperCase()}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4 pt-2">
                  {/* Emotional Score Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Manipulation Score</span>
                      <span className="font-mono font-bold">{result.emotionalAnalysis.score}/100</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-500",
                          result.emotionalAnalysis.score < 25 && "bg-success",
                          result.emotionalAnalysis.score >= 25 && result.emotionalAnalysis.score < 55 && "bg-warning",
                          result.emotionalAnalysis.score >= 55 && "bg-destructive"
                        )}
                        style={{ width: `${result.emotionalAnalysis.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Dominant Emotion */}
                  {result.emotionalAnalysis.dominantEmotion && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Dominant Emotion:</span>
                      <Badge variant="secondary">{result.emotionalAnalysis.dominantEmotion}</Badge>
                    </div>
                  )}

                  {/* Triggered Categories */}
                  {result.emotionalAnalysis.triggers.length > 0 ? (
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Detected Triggers:</span>
                      <div className="grid gap-2">
                        {result.emotionalAnalysis.triggers.map((trigger, idx) => (
                          <div key={idx} className="p-3 bg-background/50 border border-border rounded">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{trigger.category}</span>
                              <span className="text-xs text-muted-foreground">
                                Intensity: {trigger.intensity}%
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {trigger.words.map((word, widx) => (
                                <Badge key={widx} variant="outline" className="text-xs">
                                  {word}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No significant emotional manipulation patterns detected.
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Source Credibility Section */}
          {result.sourceCredibility && (
            <AccordionItem value="source" className="border-2 border-border">
              <AccordionTrigger className="px-4 py-3 bg-secondary/30 hover:bg-secondary/50 hover:no-underline">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-blue-500" />
                  <span className="font-headline font-bold uppercase tracking-wider text-sm">
                    Source Credibility
                  </span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "ml-2 text-xs",
                      result.sourceCredibility.overallReputation === 'trusted' && "border-success text-success",
                      result.sourceCredibility.overallReputation === 'mixed' && "border-warning text-warning",
                      result.sourceCredibility.overallReputation === 'untrusted' && "border-destructive text-destructive",
                      result.sourceCredibility.overallReputation === 'unknown' && "border-muted-foreground text-muted-foreground"
                    )}
                  >
                    {result.sourceCredibility.overallReputation.toUpperCase()}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4 pt-2">
                  {/* Credibility Score Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Risk Score</span>
                      <span className="font-mono font-bold">{result.sourceCredibility.score}/100</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-500",
                          result.sourceCredibility.score < 30 && "bg-success",
                          result.sourceCredibility.score >= 30 && result.sourceCredibility.score < 60 && "bg-warning",
                          result.sourceCredibility.score >= 60 && "bg-destructive"
                        )}
                        style={{ width: `${result.sourceCredibility.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Found Sources */}
                  {result.sourceCredibility.foundSources.length > 0 ? (
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Detected Sources:</span>
                      <div className="grid gap-2">
                        {result.sourceCredibility.foundSources.map((source, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-background/50 border border-border rounded">
                            {source.reputation === 'trusted' && <Shield className="h-4 w-4 text-success" />}
                            {source.reputation === 'unreliable' && <ShieldAlert className="h-4 w-4 text-destructive" />}
                            {source.reputation === 'satire' && <ShieldQuestion className="h-4 w-4 text-warning" />}
                            {(source.reputation === 'mixed' || source.reputation === 'unknown') && <ShieldQuestion className="h-4 w-4 text-muted-foreground" />}
                            <div className="flex-1">
                              <span className="font-mono text-sm">{source.domain}</span>
                              {source.category && (
                                <span className="text-xs text-muted-foreground ml-2">({source.category})</span>
                              )}
                            </div>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                source.reputation === 'trusted' && "border-success text-success",
                                source.reputation === 'unreliable' && "border-destructive text-destructive",
                                source.reputation === 'satire' && "border-warning text-warning"
                              )}
                            >
                              {source.reputation}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No external sources or URLs detected in the content.
                    </p>
                  )}

                  {/* Factors */}
                  {result.sourceCredibility.factors.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Analysis Factors:</span>
                      <ul className="space-y-1">
                        {result.sourceCredibility.factors.map((factor, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="text-muted-foreground">•</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Fact Check Results Section (Only shown if available) */}
          {result.factCheckResults && result.factCheckResults.available && (
            <AccordionItem value="factcheck" className="border-2 border-border">
              <AccordionTrigger className="px-4 py-3 bg-secondary/30 hover:bg-secondary/50 hover:no-underline">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-green-500" />
                  <span className="font-headline font-bold uppercase tracking-wider text-sm">
                    External Fact Checks
                  </span>
                  {result.factCheckResults.claims.length > 0 && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {result.factCheckResults.claims.length} FOUND
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4 pt-2">
                  {result.factCheckResults.error ? (
                    <p className="text-sm text-destructive">
                      Error: {result.factCheckResults.error}
                    </p>
                  ) : result.factCheckResults.claims.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Related claims found by fact-checking organizations:
                      </p>
                      {result.factCheckResults.claims.map((claim, idx) => (
                        <div key={idx} className="p-3 bg-background/50 border border-border rounded space-y-2">
                          <p className="text-sm font-medium">"{claim.text}"</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            {claim.claimant && (
                              <span className="text-muted-foreground">
                                Claimed by: {claim.claimant}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  claim.ratingValue !== undefined && claim.ratingValue <= 30 && "border-success text-success",
                                  claim.ratingValue !== undefined && claim.ratingValue > 30 && claim.ratingValue <= 60 && "border-warning text-warning",
                                  claim.ratingValue !== undefined && claim.ratingValue > 60 && "border-destructive text-destructive"
                                )}
                              >
                                {claim.rating}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                by {claim.publisher}
                              </span>
                            </div>
                            {claim.url && (
                              <a 
                                href={claim.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                              >
                                View <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No related fact-checks found for this content.
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

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
