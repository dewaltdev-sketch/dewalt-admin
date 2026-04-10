"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Save } from "lucide-react";
import {
  ChildCategoriesTable,
  ChildCategoryForm,
  AssignToBrandCategoryDialog,
} from "@/features/categories";
import {
  useGetChildCategories,
  useDeleteChildCategory,
  useCreateChildCategory,
  useUpdateChildCategory,
  useReorderChildCategories,
} from "@/features/categories";
import type {
  ChildCategory,
  CreateChildCategoryDto,
  UpdateChildCategoryDto,
} from "@/features/categories/types";

export default function ChildCategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingChildCategory, setEditingChildCategory] = useState<
    ChildCategory | undefined
  >();

  const { data: childCategories, isLoading, error } = useGetChildCategories();
  const createChildCategory = useCreateChildCategory();
  const updateChildCategory = useUpdateChildCategory();
  const deleteChildCategory = useDeleteChildCategory();
  const reorderChildCategories = useReorderChildCategories();

  const handleCreate = () => {
    setEditingChildCategory(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (childCategory: ChildCategory) => {
    setEditingChildCategory(childCategory);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("დარწმუნებული ხართ, რომ გსურთ ამ ქვე-კატეგორიის წაშლა?")) {
      deleteChildCategory.mutate(id);
    }
  };

  const handleCreateChildCategory = async (data: CreateChildCategoryDto) => {
    await createChildCategory.mutateAsync(data);
  };

  const handleUpdateChildCategory = async (
    id: string,
    data: UpdateChildCategoryDto
  ) => {
    await updateChildCategory.mutateAsync({ id, data });
  };

  const handleReorder = (childCategoryIds: string[]) => {
    reorderChildCategories.mutate({ childCategoryIds });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">
          ქვე-კატეგორიების ჩატვირთვის შეცდომა:{" "}
          {error instanceof Error ? error.message : "უცნობი შეცდომა"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">ქვე-კატეგორიები</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            მართეთ ქვე-კატეგორიები ცალკე და შემდეგ მიაკუთვნეთ ბრენდებსა და
            კატეგორიებს. „ყველა“ სიაში რომ გამოჩნდეს, შექმენით ქვე-კატეგორია
            სლაგით{" "}
            <span className="font-mono text-foreground">all</span> — პროდუქტების
            გვერდზე ეს ფილტრი ქვე-კატეგორიას არ შემოიფარგლება და ყველა ქვე
            ქვეშ გამოჩნდება.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAssignDialogOpen(true)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            ბრენდზე და კატეგორიაზე მინიჭება
          </Button>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            ქვე-კატეგორიის დამატება
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin" /> ქვე-კატეგორიები იტვირთება...
        </div>
      ) : (
        <ChildCategoriesTable
          childCategories={childCategories || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
          isReordering={reorderChildCategories.isPending}
        />
      )}

      {/* Create/Edit Child Category Dialog */}
      <ChildCategoryForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        childCategory={editingChildCategory}
        onCreate={handleCreateChildCategory}
        onUpdate={handleUpdateChildCategory}
        isCreating={createChildCategory.isPending}
        isUpdating={updateChildCategory.isPending}
      />

      {/* Assign Child Categories to Brand + Category Dialog */}
      <AssignToBrandCategoryDialog
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        childCategories={childCategories || []}
      />
    </div>
  );
}
