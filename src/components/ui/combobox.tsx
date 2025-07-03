"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "./scroll-area"

interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  notFoundMessage?: string
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  notFoundMessage = "No option found.",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    if(!open) {
        setSearch("")
    }
  }, [open]);

  const filteredOptions = React.useMemo(() => {
    if (!search) return options
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    )
  }, [options, search])

  const selectedLabel = options.find((option) => option.value === value)?.label

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {value ? selectedLabel : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <div className="p-2">
            <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
                autoFocus
            />
        </div>
        <ScrollArea className="h-60">
            <div className="p-2 pt-0 space-y-1">
            {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                    <Button
                        key={option.value}
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-normal h-9"
                        )}
                        onClick={() => {
                            onValueChange(option.value)
                            setOpen(false)
                        }}
                    >
                        <Check
                            className={cn(
                                "mr-2 h-4 w-4 shrink-0",
                                value === option.value ? "opacity-100" : "opacity-0"
                            )}
                        />
                        {option.label}
                    </Button>
                ))
            ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">
                    {notFoundMessage}
                </p>
            )}
            </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
