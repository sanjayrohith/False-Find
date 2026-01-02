import { AnalysisResult } from '@/hooks/useFakeNewsDetector';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Archive, Trash2, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface HistoryPanelProps {
  history: AnalysisResult[];
  onSelect: (result: AnalysisResult) => void;
  onClear: () => void;
}

export function HistoryPanel({ history, onSelect, onClear }: HistoryPanelProps) {
  const getVerdictIcon = (verdict: AnalysisResult['verdict']) => {
    switch (verdict) {
      case 'verified':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'fake':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertCircle className="h-4 w-4 text-warning" />;
    }
  };

  const getVerdictBadge = (verdict: AnalysisResult['verdict']) => {
    const config = {
      verified: { label: 'Verified', className: 'bg-success/10 text-success border-success/30' },
      fake: { label: 'Disputed', className: 'bg-destructive/10 text-destructive border-destructive/30' },
      uncertain: { label: 'Uncertain', className: 'bg-warning/10 text-warning border-warning/30' },
    };
    return config[verdict];
  };

  return (
    <div className="border-2 border-foreground bg-card">
      {/* Header */}
      <div className="bg-foreground text-background px-4 py-3 flex items-center justify-between">
        <h3 className="font-headline font-bold uppercase tracking-wider text-sm flex items-center gap-2">
          <Archive className="h-4 w-4" />
          Past Editions
        </h3>
        {history.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            className="text-background/70 hover:text-background hover:bg-background/10 h-7 px-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {history.length === 0 ? (
        <div className="p-8 text-center border-t-0">
          <div className="w-16 h-16 mx-auto mb-4 border-2 border-dashed border-border rounded-full flex items-center justify-center">
            <Archive className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="font-headline font-bold text-sm">No Archives Yet</p>
          <p className="text-xs text-muted-foreground mt-1 font-body">
            Your verification history will appear here
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="divide-y divide-border">
            {history.map((item, index) => {
              const badgeConfig = getVerdictBadge(item.verdict);
              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className={cn(
                    "w-full text-left p-4 hover:bg-secondary/50 transition-colors relative",
                    "focus:outline-none focus:bg-secondary/50"
                  )}
                >
                  {/* Edition number */}
                  <div className="absolute top-2 right-2 text-[10px] font-mono text-muted-foreground">
                    #{history.length - index}
                  </div>
                  
                  <div className="flex items-start gap-3">
                    {getVerdictIcon(item.verdict)}
                    <div className="flex-1 min-w-0 pr-6">
                      <p className="text-sm line-clamp-2 font-body leading-snug mb-2">
                        {item.text}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge 
                          variant="outline" 
                          className={cn("text-[10px] font-headline uppercase tracking-wider rounded-none border", badgeConfig.className)}
                        >
                          {badgeConfig.label}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
