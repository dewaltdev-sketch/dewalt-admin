"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditorContent from "@/components/rich-text-editor-content";
import {
  useGetBrandContent,
  useUpdateBrandContent,
  type BrandContent,
} from "@/features/brandContent";

type BrandBlockState = {
  cardDescriptionKa: string;
  cardDescriptionEn: string;
  aboutContentKa: string;
  aboutContentEn: string;
};

type BrandFormState = {
  dewalt: BrandBlockState;
  stanley: BrandBlockState;
  blackDecker: BrandBlockState;
};

const createBrandState = (brand?: BrandContent["dewalt"]): BrandBlockState => ({
  cardDescriptionKa: brand?.cardDescription?.ka ?? "",
  cardDescriptionEn: brand?.cardDescription?.en ?? "",
  aboutContentKa: brand?.aboutContent?.ka ?? "",
  aboutContentEn: brand?.aboutContent?.en ?? "",
});

function BrandEditor({
  title,
  form,
  onChange,
}: {
  title: string;
  form: BrandBlockState;
  onChange: (field: keyof BrandBlockState, value: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          ლოგო და ბრენდის სახელი static-ია. აქედან იცვლება მხოლოდ ტექსტური
          ინფორმაცია.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>ბარათის მოკლე ტექსტი (ქართული)</Label>
            <Textarea
              value={form.cardDescriptionKa}
              onChange={(e) => onChange("cardDescriptionKa", e.target.value)}
              placeholder="Homepage ბრენდის ბარათის მოკლე ტექსტი"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>ბარათის მოკლე ტექსტი (English)</Label>
            <Textarea
              value={form.cardDescriptionEn}
              onChange={(e) => onChange("cardDescriptionEn", e.target.value)}
              placeholder="Short text for homepage brand card"
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>ბრენდის შესახებ (ქართული)</Label>
          <RichTextEditorContent
            value={form.aboutContentKa}
            onChange={(value) => onChange("aboutContentKa", value)}
            placeholder="ბრენდის შესახებ ტექსტი ქართულად"
          />
        </div>
        <div className="space-y-2">
          <Label>ბრენდის შესახებ (English)</Label>
          <RichTextEditorContent
            value={form.aboutContentEn}
            onChange={(value) => onChange("aboutContentEn", value)}
            placeholder="About the brand in English"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function BrandContentForm({ initial }: { initial: BrandContent }) {
  const updateBrandContent = useUpdateBrandContent();
  const [form, setForm] = useState<BrandFormState>({
    dewalt: createBrandState(initial.dewalt),
    stanley: createBrandState(initial.stanley),
    blackDecker: createBrandState(initial.blackDecker),
  });

  const updateBrandField = (
    brandKey: keyof BrandFormState,
    field: keyof BrandBlockState,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [brandKey]: {
        ...prev[brandKey],
        [field]: value,
      },
    }));
  };

  const onSave = async () => {
    await updateBrandContent.mutateAsync({
      dewalt: {
        cardDescription: {
          ka: form.dewalt.cardDescriptionKa,
          en: form.dewalt.cardDescriptionEn,
        },
        aboutContent: {
          ka: form.dewalt.aboutContentKa,
          en: form.dewalt.aboutContentEn,
        },
      },
      stanley: {
        cardDescription: {
          ka: form.stanley.cardDescriptionKa,
          en: form.stanley.cardDescriptionEn,
        },
        aboutContent: {
          ka: form.stanley.aboutContentKa,
          en: form.stanley.aboutContentEn,
        },
      },
      blackDecker: {
        cardDescription: {
          ka: form.blackDecker.cardDescriptionKa,
          en: form.blackDecker.cardDescriptionEn,
        },
        aboutContent: {
          ka: form.blackDecker.aboutContentKa,
          en: form.blackDecker.aboutContentEn,
        },
      },
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">ბრენდების ტექსტები</h2>
          <p className="text-sm text-muted-foreground">
            მართეთ homepage ბარათების ტექსტი და ბრენდების შიდა გვერდების
            კონტენტი.
          </p>
        </div>
        <Button onClick={onSave} disabled={updateBrandContent.isPending}>
          {updateBrandContent.isPending ? "შენახვა..." : "შენახვა"}
        </Button>
      </div>

      <BrandEditor
        title="DeWalt"
        form={form.dewalt}
        onChange={(field, value) => updateBrandField("dewalt", field, value)}
      />
      <BrandEditor
        title="Stanley"
        form={form.stanley}
        onChange={(field, value) => updateBrandField("stanley", field, value)}
      />
      <BrandEditor
        title="Black & Decker"
        form={form.blackDecker}
        onChange={(field, value) =>
          updateBrandField("blackDecker", field, value)
        }
      />
    </div>
  );
}

export default function BrandContentAdminPage() {
  const { data, isLoading, error } = useGetBrandContent();

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-destructive">
          ბრენდების ტექსტების ჩატვირთვის შეცდომა:{" "}
          {error instanceof Error ? error.message : "უცნობი შეცდომა"}
        </p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">იტვირთება...</p>
      </div>
    );
  }

  return (
    <BrandContentForm
      key={data.updatedAt ?? data._id ?? "brand-content"}
      initial={data}
    />
  );
}
