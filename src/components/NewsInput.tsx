import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Search, Loader2, FileText } from 'lucide-react';

interface NewsInputProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

export function NewsInput({ onAnalyze, isAnalyzing }: NewsInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim().length > 0) {
      onAnalyze(text.trim());
    }
  };

  return (
    <div className="border-2 border-foreground bg-card relative overflow-hidden">
      {/* Newspaper texture */}
      <div className="absolute inset-0 newspaper-texture opacity-30 pointer-events-none" />
      
      {/* Header band */}
      <div className="bg-foreground text-background px-4 py-3 flex items-center gap-3">
        <FileText className="h-5 w-5" />
        <h2 className="font-headline font-bold uppercase tracking-wider text-sm">
          Submit Article for Verification
        </h2>
      </div>
      
      <div className="p-6 relative space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Paste your news headline or article text here for verification...

Example: 'Scientists discover revolutionary new energy source that could power cities for centuries' or 'SHOCKING revelation that you won't believe!!!'"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[180px] resize-none font-body text-base bg-background/50 border-2 border-border focus:border-foreground transition-colors rounded-none"
            disabled={isAnalyzing}
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-mono">{text.length} chars</span>
          </div>
        </div>
        
        <Button 
          onClick={handleSubmit} 
          disabled={text.trim().length === 0 || isAnalyzing}
          className="w-full h-12 text-base font-headline font-bold uppercase tracking-wider rounded-none border-2 border-foreground hover:bg-foreground hover:text-background transition-all"
          variant="outline"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Verifying Story...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Verify This Story
            </>
          )}
        </Button>
        
        {/* Decorative corner marks */}
        <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-muted-foreground/30" />
        <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-muted-foreground/30" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-muted-foreground/30" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-muted-foreground/30" />
      </div>
    </div>
  );
}
