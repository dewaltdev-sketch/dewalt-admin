"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Save } from "lucide-react";
import {
  CategoriesTable,
  CategoryForm,
  AssignToBrandDialog,
} from "@/features/categories";
import {
  useGetCategories,
  useDeleteCategory,
  useCreateCategory,
  useUpdateCategory,
  useReorderCategories,
} from "@/features/categories";
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/features/categories/types";

export default function CategoriesListPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    Category | undefined
  >();

  const { data: categories, isLoading, error } = useGetCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const reorderCategories = useReorderCategories();

  const handleCreate = () => {
    setEditingCategory(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("დარწმუნებული ხართ, რომ გსურთ ამ კატეგორიის წაშლა?")) {
      deleteCategory.mutate(id);
    }
  };

  const handleReorder = (categoryIds: string[]) => {
    reorderCategories.mutate({ categoryIds });
  };

  const handleOpenAssignDialog = () => {
    setIsAssignDialogOpen(true);
  };

  const handleCreateCategory = async (data: CreateCategoryDto) => {
    await createCategory.mutateAsync(data);
  };

  const handleUpdateCategory = async (id: string, data: UpdateCategoryDto) => {
    await updateCategory.mutateAsync({ id, data });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">
          კატეგორიების ჩატვირთვის შეცდომა:{" "}
          {error instanceof Error ? error.message : "უცნობი შეცდომა"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">კატეგორიები</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            მართეთ კატეგორიები და მიაკუთვნეთ ბრენდებს
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleOpenAssignDialog}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            ბრენდზე მინიჭება
          </Button>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            კატეგორიის დამატება
          </Button>
        </div>
      </div>

      {/* Brand Selection for Assignment */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Assign Categories to Brand</CardTitle>
          <CardDescription>
            Select a brand to assign categories to it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <BrandSelector
              brands={brands}
              value={selectedBrandForAssign}
              onValueChange={setSelectedBrandForAssign}
              id="brand-select-assign"
            />
          </div>
        </CardContent>
      </Card> */}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin" /> კატეგორიები იტვირთება...
        </div>
      ) : (
        <CategoriesTable
          categories={categories || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
          isReordering={reorderCategories.isPending}
        />
      )}

      {/* Create/Edit Category Dialog */}
      <CategoryForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        category={editingCategory}
        onCreate={handleCreateCategory}
        onUpdate={handleUpdateCategory}
        isCreating={createCategory.isPending}
        isUpdating={updateCategory.isPending}
      />

      {/* Assign Categories to Brand Dialog */}

      <AssignToBrandDialog
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        categories={categories || []}
      />
    </div>
  );
}
