
"use client"

import * as React from "react"
import type { UnitConverter, Unit } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRightLeft } from "lucide-react"
import { Button } from "./ui/button"

interface UnitConverterViewProps {
  converter: UnitConverter
}

// Helper to format numbers nicely
const formatNumber = (num: number): string => {
    if (isNaN(num)) return '';
    // Use exponential for very small or very large numbers
    if (Math.abs(num) > 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
        return num.toExponential(6);
    }
    // Limit decimals for floats
    if (num % 1 !== 0) {
        return num.toFixed(Math.min(8, (num.toString().split('.')[1] || '').length));
    }
    return num.toString();
};


export function UnitConverterView({ converter }: UnitConverterViewProps) {
  const [unit1, setUnit1] = React.useState<string>(converter.units[0].id)
  const [unit2, setUnit2] = React.useState<string>(converter.units[1].id)
  const [value1, setValue1] = React.useState<string>("1")
  const [value2, setValue2] = React.useState<string>("")

  const getUnit = React.useCallback(
    (id: string): Unit | undefined => converter.units.find((u) => u.id === id),
    [converter.units]
  )

  const convertValue = React.useCallback(
    (value: number, fromUnitId: string, toUnitId: string): number | null => {
      const fromUnit = getUnit(fromUnitId)
      const toUnit = getUnit(toUnitId)
      if (!fromUnit || !toUnit || isNaN(value)) return null

      const baseValue = fromUnit.toBase(value)
      const convertedValue = toUnit.fromBase(baseValue)
      return convertedValue
    },
    [getUnit]
  )
    
  // Effect to calculate initial value and on unit changes
  React.useEffect(() => {
    const fromVal = parseFloat(value1);
    if (!isNaN(fromVal)) {
        const result = convertValue(fromVal, unit1, unit2);
        if (result !== null) {
            setValue2(formatNumber(result));
        } else {
            setValue2('');
        }
    } else {
        setValue2('');
    }
  }, [unit1, unit2, value1, convertValue]);


  const handleValue1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue1(val)
    const num = parseFloat(val)
    if (!isNaN(num)) {
      const result = convertValue(num, unit1, unit2)
      if (result !== null) {
        setValue2(formatNumber(result))
      } else {
        setValue2("")
      }
    } else {
      setValue2("")
    }
  }

  const handleValue2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue2(val)
    const num = parseFloat(val)
    if (!isNaN(num)) {
      const result = convertValue(num, unit2, unit1)
      if (result !== null) {
        setValue1(formatNumber(result))
      } else {
        setValue1("")
      }
    } else {
      setValue1("")
    }
  }
  
  const handleSwap = () => {
    setUnit1(unit2);
    setUnit2(unit1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Card className="shadow-md">
            <CardContent className="p-4 flex flex-col gap-2">
                <Select value={unit1} onValueChange={setUnit1}>
                <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                    {converter.units.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                        {u.name}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
                <Input
                    type="number"
                    value={value1}
                    onChange={handleValue1Change}
                    placeholder="Enter value"
                    className="text-lg"
                />
            </CardContent>
        </Card>

        <Button variant="ghost" size="icon" className="mx-auto" onClick={handleSwap}>
            <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
        </Button>

        <Card className="shadow-md">
            <CardContent className="p-4 flex flex-col gap-2">
                <Select value={unit2} onValueChange={setUnit2}>
                <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                    {converter.units.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                        {u.name}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
                <Input
                    type="number"
                    value={value2}
                    onChange={handleValue2Change}
                    placeholder="Result"
                    className="text-lg"
                    readOnly={false} // Allow user to edit this field too
                />
            </CardContent>
        </Card>
    </div>
  )
}
