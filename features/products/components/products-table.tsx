"use client";

import { useMemo, useState, type ReactNode } from "react";
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
import { Badge } from "@/components/ui/badge";
import type { Product } from "../types";
import Image from "next/image";
import TableRowSkeleton from "./ProductTableRowSkeleton";
import { SliderSelect } from "./SliderSelect";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  enableReorder?: boolean;
  onReorder?: (productIds: string[]) => void;
  isReordering?: boolean;
}

function ProductCells({
  product,
  onEdit,
  onDelete,
  dragHandle,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  dragHandle?: ReactNode;
}) {
  const brandName =
    typeof product.brandId === "string" ? "-" : product?.brandId?.name.ka;
  const categoryName =
    typeof product.categoryId === "string" ? "-" : product?.categoryId?.name.ka;

  return (
    <>
      {dragHandle ? <TableCell className="w-10">{dragHandle}</TableCell> : null}
      <TableCell>
        <div className="relative w-24 h-16 border rounded-md overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name?.ka || product.name?.en || "პროდუქტი"}
            fill
            className="object-fit"
            sizes="96px"
          />
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium text-sm">{product.name.en}</div>
          <div className="text-xs text-muted-foreground">{product.name.ka}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm font-mono">{product.finaCode}</div>
      </TableCell>
      <TableCell>
        <div className="font-medium">
          {product.price} GEL
          {product.originalPrice ? (
            <span className="text-xs text-muted-foreground line-through ml-2">
              {product.originalPrice} GEL
            </span>
          ) : null}
        </div>
        {product.discount ? (
          <div className="text-xs text-destructive">-{product.discount}%</div>
        ) : null}
      </TableCell>
      <TableCell>
        <div className="text-sm">{brandName}</div>
      </TableCell>
      <TableCell>
        <div className="text-sm">{categoryName}</div>
      </TableCell>
      <TableCell>
        <div className="text-sm">{product.childCategoryId?.name.ka}</div>
      </TableCell>
      <TableCell>
        <Badge variant={product.quantity > 0 ? "default" : "outline"}>
          {product.quantity > 0
            ? `მარაგშია (${product.quantity})`
            : "არ არის მარაგში"}
        </Badge>
      </TableCell>
      <TableCell>
        <SliderSelect
          productId={product._id}
          currentValue={product.sliderNumber}
        />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(product)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(product._id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </>
  );
}

function SortableProductRow({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product._id });

  return (
    <TableRow
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <ProductCells
        product={product}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandle={
          <button
            className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
            {...attributes}
            {...listeners}
            aria-label="პროდუქტის გადაადგილება"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        }
      />
    </TableRow>
  );
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
  isLoading = false,
  enableReorder = false,
  onReorder,
  isReordering = false,
}: ProductsTableProps) {
  const [localOrder, setLocalOrder] = useState<Product[] | null>(null);
  const productIds = useMemo(() => new Set(products.map((product) => product._id)), [products]);
  const canUseLocalOrder =
    enableReorder &&
    !!localOrder &&
    localOrder.length === products.length &&
    localOrder.every((product) => productIds.has(product._id));
  const displayProducts = canUseLocalOrder ? localOrder : products;
  const itemIds = useMemo(
    () => displayProducts.map((product) => product._id),
    [displayProducts]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (!enableReorder) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = displayProducts.findIndex((item) => item._id === active.id);
    const newIndex = displayProducts.findIndex((item) => item._id === over.id);
    const reordered = arrayMove(displayProducts, oldIndex, newIndex);

    setLocalOrder(reordered);
    onReorder?.(reordered.map((item) => item._id));
  };

  return (
    <div className="rounded-md border">
      {enableReorder ? (
        <div className="px-4 py-2 bg-muted/50 text-sm text-muted-foreground border-b">
          {isReordering
            ? "თანმიმდევრობა ინახება..."
            : "გადაადგილეთ პროდუქტები drag-and-drop-ით, რათა შეცვალოთ რიგითობა."}
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              <TableRow>
                {enableReorder ? <TableHead className="w-10" /> : null}
                <TableHead>სურათი</TableHead>
                <TableHead>დასახელება (EN / KA)</TableHead>
                <TableHead>FINA კოდი</TableHead>
                <TableHead>ფასი</TableHead>
                <TableHead>ბრენდი</TableHead>
                <TableHead>კატეგორია</TableHead>
                <TableHead>სუბ კატეგორია</TableHead>
                <TableHead>მარაგი</TableHead>
                <TableHead>სლაიდერში</TableHead>
                <TableHead className="text-right">მოქმედებები</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRowSkeleton numberOfRows={10} />
              ) : displayProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={enableReorder ? 11 : 10}
                    className="h-24 text-center"
                  >
                    პროდუქტები ვერ მოიძებნა.
                  </TableCell>
                </TableRow>
              ) : enableReorder ? (
                <SortableContext
                  items={itemIds}
                  strategy={verticalListSortingStrategy}
                >
                  {displayProducts.map((product) => (
                    <SortableProductRow
                      key={product._id}
                      product={product}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </SortableContext>
              ) : (
                displayProducts.map((product) => (
                  <TableRow key={product._id}>
                    <ProductCells
                      product={product}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>
    </div>
  );
}
