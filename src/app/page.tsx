
"use client"

import * as React from "react"
import { detectFormat, type DetectFormatOutput } from "@/ai/flows/auto-detect-conversion"
import { allConverters, dataConverters, unitConverters } from "@/lib/converters"
import type { AnyConverter, DataConverter, UnitConverter } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CommandPalette } from "@/components/command-palette"
import { UnitConverterView } from "@/components/unit-converter-view"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Check,
  Clipboard,
  CodeXml,
  Copy,
  Loader2,
  Share2,
  Sparkles,
  Search,
  Ruler,
  Weight,
  Thermometer,
  AreaChart,
  Box,
} from "lucide-react"

// Helper to get an icon for a converter type
const getConverterIcon = (converter: AnyConverter) => {
    switch (converter.id) {
        case 'length': return <Ruler />;
        case 'mass': return <Weight />;
        case 'temperature': return <Thermometer />;
        case 'area': return <AreaChart />;
        case 'volume': return <Box />;
        default: return <Sparkles />;
    }
}

export default function OmniConvertPage() {
  const { toast } = useToast()
  const [inputData, setInputData] = React.useState("")
  const [outputData, setOutputData] = React.useState("")
  const [detectedFormat, setDetectedFormat] =
    React.useState<DetectFormatOutput | null>(null)
  const [isDetecting, setIsDetecting] = React.useState(false)
  const [selectedConverter, setSelectedConverter] =
    React.useState<AnyConverter | null>(unitConverters[0])
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false)
  const [sidebarSearch, setSidebarSearch] = React.useState("")
  const [copied, setCopied] = React.useState(false)
  const [shared, setShared] = React.useState(false)

  // Debounce for AI detection for data converters
  React.useEffect(() => {
    if (selectedConverter?.type !== 'data' || !inputData.trim()) {
      setIsDetecting(false)
      setDetectedFormat(null)
      return
    }
    setIsDetecting(true)
    const handler = setTimeout(() => {
      detectFormat({ inputData })
        .then(setDetectedFormat)
        .catch(console.error)
        .finally(() => setIsDetecting(false))
    }, 500)

    return () => clearTimeout(handler)
  }, [inputData, selectedConverter])

  // Perform conversion for data converters
  React.useEffect(() => {
    if (selectedConverter?.type === 'data') {
      (selectedConverter as DataConverter)
        .convert(inputData)
        .then(setOutputData)
        .catch((err) => {
          setOutputData(`Error: ${err.message}`)
          toast({
            variant: "destructive",
            title: "Conversion Error",
            description: err.message,
          })
        })
    } else {
      setOutputData("")
    }
  }, [inputData, selectedConverter, toast])

  // Handle permalinks for data converters
  React.useEffect(() => {
    const loadFromHash = () => {
      try {
        const hash = window.location.hash.slice(1)
        if (!hash) return

        const [converterId, queryString] = hash.split("?")
        const targetConverter = allConverters.find((c) => c.id === converterId)
        
        if (targetConverter) {
            setSelectedConverter(targetConverter)
            // Only load source for data converters
            if (targetConverter.type === 'data' && queryString) {
                const params = new URLSearchParams(queryString)
                const src = params.get("src")
                if (src) setInputData(atob(src))
            }
        }
      } catch (error) {
        console.error("Failed to parse permalink:", error)
        toast({
            variant: "destructive",
            title: "Error loading permalink",
            description: "The shared link seems to be invalid.",
        })
      }
    }
    loadFromHash()
    window.addEventListener("hashchange", loadFromHash)
    return () => window.removeEventListener("hashchange", loadFromHash)
  }, [toast])

  // Update permalinks for data converters
  React.useEffect(() => {
    if (selectedConverter?.type !== 'data') return;

    const updateHash = () => {
      const src = inputData ? `?src=${btoa(inputData)}` : ""
      const newHash = `#${selectedConverter.id}${src}`
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, "", newHash)
      }
    }
    const handler = setTimeout(updateHash, 1000)
    return () => clearTimeout(handler)
  }, [inputData, selectedConverter])

  // Keyboard shortcut for command palette
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandPaletteOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])
  
  const handleCopy = (text: string, type: "output" | "share") => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "output") {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        setShared(true)
        setTimeout(() => setShared(false), 2000)
        toast({
          title: "Link Copied!",
          description: "Permalink has been copied to your clipboard.",
        })
      }
    })
  }

  const filteredUnitConverters = unitConverters.filter((c) =>
    c.name.toLowerCase().includes(sidebarSearch.toLowerCase())
  )

  const filteredDataConverters = dataConverters.filter((c) =>
    c.name.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  return (
    <SidebarProvider>
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onSelectConverter={(converter) => {
          setSelectedConverter(converter)
          setCommandPaletteOpen(false)
        }}
      />
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
                <CodeXml className="text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-headline font-bold text-primary-foreground group-data-[collapsible=icon]:hidden">
              OmniConvert
            </h1>
          </div>
          <div className="relative group-data-[collapsible=icon]:hidden">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search converters..."
              className="pl-9"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
            />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Unit Converters</SidebarGroupLabel>
            <SidebarMenu>
              {filteredUnitConverters.map((converter) => (
                <SidebarMenuItem key={converter.id}>
                  <SidebarMenuButton
                    onClick={() => setSelectedConverter(converter)}
                    isActive={selectedConverter?.id === converter.id}
                    tooltip={converter.name}
                  >
                    {getConverterIcon(converter)}
                    <span>{converter.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Data Converters</SidebarGroupLabel>
            <SidebarMenu>
              {filteredDataConverters.map((converter) => (
                <SidebarMenuItem key={converter.id}>
                  <SidebarMenuButton
                    onClick={() => setSelectedConverter(converter)}
                    isActive={selectedConverter?.id === converter.id}
                    tooltip={converter.name}
                  >
                    {getConverterIcon(converter)}
                    <span>{converter.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="p-4 md:p-6">
        <header className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-2xl md:text-3xl font-bold font-headline">
                  {selectedConverter?.name || "Welcome"}
                </h1>
            </div>
            <Button
              variant="outline"
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden md:inline-flex"
            >
              Jump to converter...
              <kbd className="ml-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
        </header>
        
        {selectedConverter?.type === 'unit' && (
            <UnitConverterView converter={selectedConverter as UnitConverter} />
        )}

        {selectedConverter?.type === 'data' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <Card className="flex flex-col shadow-md">
              <CardHeader className="flex-row items-center justify-between">
                <h2 className="text-lg font-semibold font-headline">Input</h2>
                <div className="relative">
                  {isDetecting && (
                    <Badge variant="outline" className="pl-6 animate-pulse">
                      <Loader2 className="h-3 w-3 absolute left-2 top-1/2 -translate-y-1/2 animate-spin" />
                      Detecting...
                    </Badge>
                  )}
                  {!isDetecting && detectedFormat?.format && (
                    <Badge variant="secondary" className="transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
                      {detectedFormat.format}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex p-0">
                <Textarea
                  placeholder="Paste your data here..."
                  className="flex-1 resize-none border-0 rounded-none focus-visible:ring-0 shadow-none p-6 text-sm font-mono"
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                />
              </CardContent>
            </Card>

            <Tabs defaultValue="converted" className="flex flex-col">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="converted">Converted</TabsTrigger>
                  <TabsTrigger value="diff">Diff</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                   <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(window.location.href, "share")}
                      disabled={!inputData}
                      aria-label="Share Permalink"
                   >
                      {shared ? <Check className="text-accent" /> : <Share2 />}
                   </Button>
                   <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(outputData, "output")}
                      disabled={!outputData}
                      aria-label="Copy Output"
                   >
                      {copied ? <Check className="text-accent" /> : <Copy />}
                   </Button>
                </div>
              </div>
              <TabsContent value="converted" className="flex-1 mt-2">
                <Card className="h-full flex flex-col shadow-md">
                  <CardContent className="flex-1 flex p-0">
                    <Textarea
                      readOnly
                      placeholder="Output will appear here..."
                      className="flex-1 resize-none border-0 rounded-none bg-muted/30 focus-visible:ring-0 shadow-none p-6 text-sm font-mono"
                      value={outputData}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="diff" className="flex-1 mt-2">
                <Card className="h-full shadow-md">
                   <CardContent className="grid grid-cols-2 gap-0 h-full p-0">
                      <Textarea readOnly value={inputData} placeholder="Input" className="resize-none border-0 rounded-none rounded-bl-md focus-visible:ring-0 shadow-none p-6 text-sm font-mono" />
                      <Textarea readOnly value={outputData} placeholder="Output" className="resize-none border-0 rounded-none bg-muted/30 rounded-br-md focus-visible:ring-0 shadow-none p-6 text-sm font-mono" />
                   </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="metadata" className="flex-1 mt-2">
                 <Card className="h-full shadow-md">
                   <CardContent className="p-6 space-y-4">
                      <h3 className="font-headline font-semibold">Conversion Metadata</h3>
                      {detectedFormat?.format ? (
                          <div className="text-sm space-y-2 font-mono">
                              <p><strong>Detected Format:</strong> {detectedFormat.format}</p>
                              <p><strong>Confidence:</strong> { (detectedFormat.confidence * 100).toFixed(0) }%</p>
                          </div>
                      ): (
                          <p className="text-sm text-muted-foreground">No format detected. Paste some data in the input panel.</p>
                      )}
                      
                      {selectedConverter && (
                        <div className="text-sm space-y-2 pt-4 border-t">
                          <h4 className="font-semibold font-headline">Active Converter</h4>
                          <p className="font-mono"><strong>Name:</strong> {selectedConverter.name}</p>
                          <p className="text-muted-foreground">{selectedConverter.description}</p>
                        </div>
                      )}
                   </CardContent>
                 </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

      </SidebarInset>
    </SidebarProvider>
  )
}
