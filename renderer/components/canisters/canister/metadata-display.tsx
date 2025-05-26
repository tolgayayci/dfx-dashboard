import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Skeleton } from '@components/ui/skeleton';
import { Alert, AlertDescription } from '@components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { ScrollArea } from '@components/ui/scroll-area';
import { Copy, ExternalLink, RefreshCw, AlertCircle, Code, Info, Settings, Package, Wrench } from 'lucide-react';
import { Button } from '@components/ui/button';
import { useToast } from '@components/ui/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion';

interface MetadataDisplayProps {
  canisterName: string;
  network: string;
  projectPath: string;
  isNNSCanister?: boolean;
}

interface CanisterMetadata {
  'candid:service'?: string;
  'candid:args'?: string;
  'dfx:wasm_url'?: string;
  'dfx:deps'?: string;
  'dfx:init'?: string;
  'cdk:name'?: string;
  'cdk:version'?: string;
}

interface MetadataSection {
  key: keyof CanisterMetadata;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  type: 'code' | 'text' | 'url' | 'deps' | 'badge';
}

export default function MetadataDisplay({ 
  canisterName, 
  network, 
  projectPath, 
  isNNSCanister = false 
}: MetadataDisplayProps) {
  const [metadata, setMetadata] = useState<CanisterMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const metadataSections: MetadataSection[] = [
    {
      key: 'candid:service',
      title: 'Candid Service Interface',
      description: 'The public interface definition for this canister',
      icon: <Code className="h-5 w-5" />,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      type: 'code'
    },
    {
      key: 'candid:args',
      title: 'Initialization Arguments',
      description: 'Arguments used when initializing the canister',
      icon: <Settings className="h-5 w-5" />,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      type: 'code'
    },
    {
      key: 'cdk:name',
      title: 'Development Kit',
      description: 'The CDK used to build this canister',
      icon: <Wrench className="h-5 w-5" />,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      type: 'badge'
    },
    {
      key: 'dfx:wasm_url',
      title: 'WASM URL',
      description: 'Download URL for the canister WASM module',
      icon: <ExternalLink className="h-5 w-5" />,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      type: 'url'
    },
    {
      key: 'dfx:deps',
      title: 'Dependencies',
      description: 'Other canisters this canister depends on',
      icon: <Package className="h-5 w-5" />,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      type: 'deps'
    },
    {
      key: 'dfx:init',
      title: 'Initialization Guide',
      description: 'Instructions for initializing this canister',
      icon: <Info className="h-5 w-5" />,
      iconBg: 'bg-gray-50',
      iconColor: 'text-gray-600',
      type: 'text'
    }
  ];

  const fetchMetadata = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await window.awesomeApi.getCanisterMetadata(
        canisterName,
        network,
        projectPath
      );

      if (result.success) {
        setMetadata(result.data);
      } else {
        setError(result.error || 'Failed to fetch metadata');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, [canisterName, network, projectPath, isNNSCanister]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const openExternalLink = (url: string) => {
    window.awesomeApi.openExternalLink(url);
  };

  const renderMetadataValue = (section: MetadataSection, value: string) => {
    switch (section.type) {
      case 'code':
        return (
          <div className="relative">
            <ScrollArea className="h-48 w-full rounded-md border bg-muted/30 p-4">
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {value}
              </pre>
            </ScrollArea>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(value, section.title)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        );
      
      case 'url':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openExternalLink(value)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open URL
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(value, section.title)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <code className="block p-2 bg-muted rounded text-xs break-all">
              {value}
            </code>
          </div>
        );
      
      case 'deps':
        return (
          <div className="flex flex-wrap gap-2">
            {value.split(';').map((dep, index) => {
              const [name, id] = dep.split(':');
              return (
                <Badge key={index} variant="outline" className="font-mono">
                  {name}: {id}
                </Badge>
              );
            })}
          </div>
        );
      
      case 'badge':
        return (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{value}</Badge>
            {metadata?.['cdk:version'] && section.key === 'cdk:name' && (
              <Badge variant="outline">v{metadata['cdk:version']}</Badge>
            )}
          </div>
        );
      
      default:
        return (
          <div className="relative">
            <p className="p-3 bg-muted rounded-md text-sm">{value}</p>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-1 right-1"
              onClick={() => copyToClipboard(value, section.title)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-240px)] w-full rounded-md border p-4 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 text-gray-500 animate-spin" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">Loading Metadata</p>
          <p className="text-sm text-muted-foreground">
            Fetching canister metadata information...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-240px)] w-full rounded-md border p-4 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-red-600">Failed to Load Metadata</p>
          <p className="text-sm text-gray-600 max-w-md">
            There was an error fetching the metadata for this canister. This could be due to network issues or the canister may not have metadata available.
          </p>
          <p className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
            {error}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchMetadata}
          className="mt-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  // Check if we have any meaningful metadata
  const availableSections = metadataSections.filter(section => {
    const value = metadata?.[section.key];
    return value && value.trim() !== '';
  });

  // If no metadata is available, show a helpful message
  if (availableSections.length === 0) {
    return (
      <div className="h-[calc(100vh-240px)] w-full rounded-md border p-4 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
          <Info className="h-8 w-8 text-blue-500" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">No Metadata Available</p>
          <p className="text-sm text-muted-foreground max-w-md">
            This canister doesn't have metadata available. Metadata is typically available for canisters deployed with dfx 0.17.0+ or those that explicitly include metadata sections.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchMetadata}
          className="mt-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-240px)] w-full">
      <div className="space-y-3">
        <Accordion type="multiple" defaultValue={['candid:service']}>
          {availableSections.map((section) => {
            const value = metadata?.[section.key];
            
            return (
              <AccordionItem key={section.key} value={section.key}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <div className={`w-10 h-10 rounded-lg ${section.iconBg} border flex items-center justify-center`}>
                      <span className={section.iconColor}>
                        {section.icon}
                      </span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-sm">{section.title}</p>
                      <p className="text-xs text-muted-foreground">{section.description}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Available
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <div className="mt-3 pl-13">
                    {renderMetadataValue(section, value!)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </ScrollArea>
  );
} 