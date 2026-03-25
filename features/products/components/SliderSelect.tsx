"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateSliderNumber } from "../hooks/useUpdateSliderNumber";

interface SliderSelectProps {
  productId: string;
  currentValue: number | null | undefined;
}

export function SliderSelect({ productId, currentValue }: SliderSelectProps) {
  const { mutate, isPending } = useUpdateSliderNumber();

  const value = currentValue ? String(currentValue) : "none";

  const handleChange = (newValue: string) => {
    const sliderNumber = newValue === "none" ? null : Number(newValue);
    mutate({ id: productId, sliderNumber });
  };

  return (
    <Select value={value} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="w-[90px] h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">არცერთი</SelectItem>
        <SelectItem value="1">1</SelectItem>
        <SelectItem value="2">2</SelectItem>
        <SelectItem value="3">3</SelectItem>
        <SelectItem value="4">4</SelectItem>
        <SelectItem value="5">5</SelectItem>
      </SelectContent>
    </Select>
  );
}
