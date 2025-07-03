
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
import { 
    Search, Sparkles, Ruler, Weight, Thermometer, AreaChart, Box, Clock,
    Gauge, Compass, BatteryCharging, Zap, Database, Layers, Flame, Workflow,
    Waves, Move, Signal, Fuel, Sun, Bolt, Scaling, RotateCw, ArrowRightLeft,
    ScanLine, Monitor, Magnet, AlertTriangle, Volume2, Type, CircuitBoard, Lightbulb,
    FileCode, Sheet
} from "lucide-react"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectConverter: (converter: AnyConverter) => void
}

const getConverterIcon = (converter: AnyConverter) => {
    const iconProps = { className: "h-5 w-5 text-accent-foreground" };
    switch (converter.id) {
        case 'length': return <Ruler {...iconProps}/>;
        case 'mass': return <Weight {...iconProps}/>;
        case 'temperature': return <Thermometer {...iconProps}/>;
        case 'area': return <AreaChart {...iconProps}/>;
        case 'volume': return <Box {...iconProps}/>;
        case 'time': return <Clock {...iconProps}/>;
        case 'speed': return <Gauge {...iconProps}/>;
        case 'pressure': return <Scaling {...iconProps}/>;
        case 'energy': return <Flame {...iconProps}/>;
        case 'power': return <Bolt {...iconProps}/>;
        case 'force': return <Move {...iconProps}/>;
        case 'angle': return <Compass {...iconProps}/>;
        case 'frequency': return <Signal {...iconProps}/>;
        case 'data-storage': return <Database {...iconProps}/>;
        case 'fuel-consumption': return <Fuel {...iconProps}/>;
        case 'acceleration': return <Gauge {...iconProps}/>;
        case 'charge': return <BatteryCharging {...iconProps}/>;
        case 'density': return <Layers {...iconProps}/>;
        case 'flow-mass': return <Workflow {...iconProps}/>;
        case 'flow-volume': return <Waves {...iconProps}/>;
        case 'illumination': return <Sun {...iconProps}/>;
        case 'torque': return <RotateCw {...iconProps}/>;
        case 'current': return <Zap {...iconProps}/>;
        case 'data-transfer': return <ArrowRightLeft {...iconProps}/>;
        case 'digital-image-resolution': return <ScanLine {...iconProps}/>;
        case 'luminance': return <Monitor {...iconProps}/>;
        case 'permeability': return <Magnet {...iconProps}/>;
        case 'radiation': return <AlertTriangle {...iconProps}/>;
        case 'sound': return <Volume2 {...iconProps}/>;
        case 'typography': return <Type {...iconProps}/>;
        case 'inductance': return <CircuitBoard {...iconProps}/>;
        case 'electric-conductance': return <Lightbulb {...iconProps}/>;
        case 'json-to-xml':
        case 'xml-to-json':
        case 'yaml-to-xml':
        case 'xml-to-yaml':
            return <FileCode {...iconProps}/>;
        case 'json-to-csv':
        case 'csv-to-json':
            return <Sheet {...iconProps}/>;
        default: return <Sparkles {...iconProps}/>;
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
