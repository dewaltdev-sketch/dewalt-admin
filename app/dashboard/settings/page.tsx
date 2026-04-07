"use client";

import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetSettings,
  useUpdateSettings,
  type Settings,
} from "@/features/settings";

type SettingsFormState = {
  contactPhone: string;
  contactPhone2: string;
  contactEmail: string;
  contactFacebook: string;
  contactInstagram: string;
  contactAddressKa: string;
  contactAddressEn: string;
  freeDeliveryEnabled: boolean;
  deliveryTbilisiPrice: string;
  deliveryTbilisiFreeOver: string;
  deliveryRegionPrice: string;
  deliveryRegionFreeOver: string;
};

const toNum = (value: string, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

function SettingsForm({
  initial,
  defaults,
}: {
  initial: Settings;
  defaults: {
    deliveryTbilisiPrice: number;
    deliveryTbilisiFreeOver: number;
    deliveryRegionPrice: number;
    deliveryRegionFreeOver: number;
  };
}) {
  const updateSettings = useUpdateSettings();

  const [form, setForm] = useState<SettingsFormState>(() => ({
    contactPhone: initial.contactPhone ?? "",
    contactPhone2: initial.contactPhone2 ?? "",
    contactEmail: initial.contactEmail ?? "",
    contactFacebook: initial.contactFacebook ?? "",
    contactInstagram: initial.contactInstagram ?? "",
    contactAddressKa: initial.contactAddress?.ka ?? "",
    contactAddressEn: initial.contactAddress?.en ?? "",
    freeDeliveryEnabled: initial.freeDeliveryEnabled ?? true,
    deliveryTbilisiPrice: String(
      initial.deliveryTbilisiPrice ?? defaults.deliveryTbilisiPrice
    ),
    deliveryTbilisiFreeOver: String(
      initial.deliveryTbilisiFreeOver ?? defaults.deliveryTbilisiFreeOver
    ),
    deliveryRegionPrice: String(
      initial.deliveryRegionPrice ?? defaults.deliveryRegionPrice
    ),
    deliveryRegionFreeOver: String(
      initial.deliveryRegionFreeOver ?? defaults.deliveryRegionFreeOver
    ),
  }));

  const onChange =
    (key: keyof SettingsFormState) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const onSave = async () => {
    const addrKa = form.contactAddressKa.trim();
    const addrEn = form.contactAddressEn.trim();

    await updateSettings.mutateAsync({
      contactPhone: form.contactPhone.trim() || undefined,
      contactPhone2: form.contactPhone2.trim() || undefined,
      contactEmail: form.contactEmail.trim() || undefined,
      contactFacebook: form.contactFacebook.trim() || undefined,
      contactInstagram: form.contactInstagram.trim() || undefined,
      contactAddress:
        addrKa.length || addrEn.length ? { ka: addrKa, en: addrEn } : undefined,
      freeDeliveryEnabled: form.freeDeliveryEnabled,
      deliveryTbilisiPrice: toNum(
        form.deliveryTbilisiPrice,
        defaults.deliveryTbilisiPrice
      ),
      deliveryTbilisiFreeOver: toNum(
        form.deliveryTbilisiFreeOver,
        defaults.deliveryTbilisiFreeOver
      ),
      deliveryRegionPrice: toNum(
        form.deliveryRegionPrice,
        defaults.deliveryRegionPrice
      ),
      deliveryRegionFreeOver: toNum(
        form.deliveryRegionFreeOver,
        defaults.deliveryRegionFreeOver
      ),
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">სეთინგები</h2>
          <p className="text-sm text-muted-foreground">
            შეცვალეთ საკონტაქტო ინფორმაცია და მიწოდების პირობები.
          </p>
        </div>
        <Button onClick={onSave} disabled={updateSettings.isPending}>
          {updateSettings.isPending ? "შენახვა..." : "შენახვა"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>კონტაქტი</CardTitle>
          <CardDescription>
            ტელეფონები, ელფოსტა, Facebook, Instagram და მისამართი.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">ტელეფონი</Label>
              <Input
                id="contactPhone"
                placeholder="+995..."
                value={form.contactPhone}
                onChange={onChange("contactPhone")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone2">ტელეფონი 2</Label>
              <Input
                id="contactPhone2"
                placeholder="+995..."
                value={form.contactPhone2}
                onChange={onChange("contactPhone2")}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contactEmail">ელფოსტა</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="info@..."
                value={form.contactEmail}
                onChange={onChange("contactEmail")}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contactFacebook">Facebook</Label>
              <Input
                id="contactFacebook"
                placeholder="https://facebook.com/..."
                value={form.contactFacebook}
                onChange={onChange("contactFacebook")}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contactInstagram">Instagram</Label>
              <Input
                id="contactInstagram"
                placeholder="https://instagram.com/..."
                value={form.contactInstagram}
                onChange={onChange("contactInstagram")}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contactAddressKa">მისამართი (ქართული)</Label>
              <Input
                id="contactAddressKa"
                placeholder="თბილისი..."
                value={form.contactAddressKa}
                onChange={onChange("contactAddressKa")}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contactAddressEn">მისამართი (English)</Label>
              <Input
                id="contactAddressEn"
                placeholder="Tbilisi..."
                value={form.contactAddressEn}
                onChange={onChange("contactAddressEn")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>მიწოდება</CardTitle>
          <CardDescription>
            ფასი და უფასო მიწოდების ზღვარი (GEL).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-5 flex items-center gap-3">
            <Checkbox
              id="freeDeliveryEnabled"
              checked={form.freeDeliveryEnabled}
              onCheckedChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  freeDeliveryEnabled: checked === true,
                }))
              }
            />
            <Label htmlFor="freeDeliveryEnabled" className="cursor-pointer">
              უფასო მიწოდება (ჩართვა/გამორთვა)
            </Label>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg border p-4 space-y-4">
              <div className="font-medium">თბილისი</div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deliveryTbilisiPrice">ფასი (GEL)</Label>
                  <Input
                    id="deliveryTbilisiPrice"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={form.deliveryTbilisiPrice}
                    onChange={onChange("deliveryTbilisiPrice")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryTbilisiFreeOver">
                    უფასო ზღვარი (GEL)
                  </Label>
                  <Input
                    id="deliveryTbilisiFreeOver"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={form.deliveryTbilisiFreeOver}
                    onChange={onChange("deliveryTbilisiFreeOver")}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {form.freeDeliveryEnabled
                  ? "თუ შეკვეთის თანხა ≥ ზღვარი, მიწოდება იქნება უფასო."
                  : "უფასო მიწოდება გამორთულია."}
              </p>
            </div>

            <div className="rounded-lg border p-4 space-y-4">
              <div className="font-medium">რეგიონები</div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deliveryRegionPrice">ფასი (GEL)</Label>
                  <Input
                    id="deliveryRegionPrice"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={form.deliveryRegionPrice}
                    onChange={onChange("deliveryRegionPrice")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryRegionFreeOver">
                    უფასო ზღვარი (GEL)
                  </Label>
                  <Input
                    id="deliveryRegionFreeOver"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={form.deliveryRegionFreeOver}
                    onChange={onChange("deliveryRegionFreeOver")}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {form.freeDeliveryEnabled
                  ? "თუ შეკვეთის თანხა ≥ ზღვარი, მიწოდება იქნება უფასო."
                  : "უფასო მიწოდება გამორთულია."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  const { data, isLoading, error } = useGetSettings();

  const defaults = useMemo(
    () => ({
      deliveryTbilisiPrice: 10,
      deliveryTbilisiFreeOver: 150,
      deliveryRegionPrice: 15,
      deliveryRegionFreeOver: 300,
    }),
    []
  );

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">
          პარამეტრების ჩატვირთვის შეცდომა:{" "}
          {error instanceof Error ? error.message : "უცნობი შეცდომა"}
        </p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">იტვირთება...</p>
      </div>
    );
  }

  return (
    <SettingsForm
      key={data.updatedAt ?? data._id ?? "settings"}
      initial={data}
      defaults={defaults}
    />
  );
}
