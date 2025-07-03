
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { allConverters } from "@/lib/converters"
import type { AnyConverter } from "@/lib/types"
import { Search, Sparkles, Ruler, Weight, Thermometer, AreaChart, Box, Clock } from "lucide-react"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectConverter: (converter: AnyConverter) => void
}

const getConverterIcon = (converter: AnyConverter) => {
    switch (converter.id) {
        case 'length': return <Ruler className="h-5 w-5 text-accent-foreground" />;
        case 'mass': return <Weight className="h-5 w-5 text-accent-foreground" />;
        case 'temperature': return <Thermometer className="h-5 w-5 text-accent-foreground" />;
        case 'area': return <AreaChart className="h-5 w-5 text-accent-foreground" />;
        case 'volume': return <Box className="h-5 w-5 text-accent-foreground" />;
        case 'time': return <Clock className="h-5 w-5 text-accent-foreground" />;
        default: return <Sparkles className="h-5 w-5 text-accent-foreground" />;
    }
}

export function CommandPalette({
  open,
  onOpenChange,
  onSelectConverter,
}: CommandPaletteProps) {
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setSearch("")
    }
  }, [open])

  const filteredConverters = allConverters.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search converters..."
                className="pl-9"
              />
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="p-2">
            <ScrollArea className="h-72">
            <div className="p-2">
                {filteredConverters.length > 0 ? (
                <ul className="space-y-1">
                    {filteredConverters.map((converter) => (
                    <li
                        key={converter.id}
                        onClick={() => onSelectConverter(converter)}
                        className="flex items-center gap-3 p-3 rounded-md hover:bg-accent cursor-pointer"
                    >
                        {getConverterIcon(converter)}
                        <div>
                        <p className="font-semibold">{converter.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {converter.description}
                        </p>
                        </div>
                    </li>
                    ))}
                </ul>
                ) : (
                <div className="text-center text-muted-foreground p-8">
                    <p>No converters found.</p>
                </div>
                )}
            </div>
            </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
