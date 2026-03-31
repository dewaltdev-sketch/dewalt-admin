"use client";

import { useState, useMemo } from "react";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Category } from "../types";

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onReorder?: (categoryIds: string[]) => void;
  isReordering?: boolean;
}

function SortableRow({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const brandIds = Array.isArray(category.brandIds) ? category.brandIds : [];

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-10">
        <button
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium text-sm">{category.name.en}</div>
          <div className="text-xs text-muted-foreground">
            {category.name.ka}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm font-mono">{category.slug}</div>
      </TableCell>
      <TableCell>
        <div className="text-xs">
          {brandIds.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {brandIds.map((brand) => (
                <span
                  key={brand._id}
                  className="inline-flex items-center px-2 py-1 rounded bg-muted text-xs"
                >
                  {brand.name.en}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">
              ბრენდი არ არის მინიჭებული
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(category)}
            title="რედაქტირება"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(category._id)}
            title="წაშლა"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function CategoriesTable({
  categories,
  onEdit,
  onDelete,
  onReorder,
  isReordering,
}: CategoriesTableProps) {
  const [localOrder, setLocalOrder] = useState<Category[] | null>(null);

  const displayCategories = localOrder ?? categories;
  const itemIds = useMemo(
    () => displayCategories.map((c) => c._id),
    [displayCategories]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = displayCategories.findIndex((c) => c._id === active.id);
    const newIndex = displayCategories.findIndex((c) => c._id === over.id);
    const reordered = arrayMove(displayCategories, oldIndex, newIndex);

    setLocalOrder(reordered);
    onReorder?.(reordered.map((c) => c._id));
  }

  return (
    <div className="rounded-md border">
      {isReordering && (
        <div className="px-4 py-2 bg-muted/50 text-sm text-muted-foreground border-b">
          თანმიმდევრობა ინახება...
        </div>
      )}
      <div className="overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>დასახელება (EN / KA)</TableHead>
                <TableHead>სლაგი</TableHead>
                <TableHead>ბრენდები</TableHead>
                <TableHead className="text-right">მოქმედებები</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    კატეგორიები ვერ მოიძებნა.
                  </TableCell>
                </TableRow>
              ) : (
                <SortableContext
                  items={itemIds}
                  strategy={verticalListSortingStrategy}
                >
                  {displayCategories.map((category) => (
                    <SortableRow
                      key={category._id}
                      category={category}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </SortableContext>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>
    </div>
  );
}
