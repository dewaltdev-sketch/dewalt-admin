"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable, useGetOrders } from "@/features/orders";

const limit = 20;

type OrdersTab =
  | "all"
  | "drafts"
  | "to_process"
  | "completed"
  | "cancelled"
  | "on_delivery";

function tabToStatus(tab: OrdersTab): string | undefined {
  switch (tab) {
    case "drafts":
      return "pending";
    case "to_process":
      return "paid";
    case "on_delivery":
      return "shipped";
    case "completed":
      return "delivered";
    case "cancelled":
      return "cancelled";
    case "all":
    default:
      return undefined;
  }
}

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<OrdersTab>("all");
  const [uuid, setUuid] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");

  const status = tabToStatus(tab);

  const { data, isLoading, error } = useGetOrders({
    page,
    limit,
    status,
    uuid: uuid || undefined,
    id: id || undefined,
    email: email || undefined,
  });

  const orders = data?.data || [];

  const hasActiveFilters = useMemo(() => {
    return Boolean(status || uuid || id || email);
  }, [status, uuid, id, email]);

  const handleFilterChange = () => {
    setPage(1);
  };

  const handleClearFilters = () => {
    setTab("all");
    setUuid("");
    setId("");
    setEmail("");
    setPage(1);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">
          შეკვეთების ჩატვირთვის შეცდომა:{" "}
          {error instanceof Error ? error.message : "უცნობი შეცდომა"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>შეკვეთები</CardTitle>
              <CardDescription>
                შეკვეთების სია და ფილტრაცია სტატუსით, Final ID/ID-ით და
                მომხმარებლის ელ.ფოსტით.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4 mb-6">
            <Tabs
              value={tab}
              onValueChange={(v) => {
                setTab(v as OrdersTab);
                handleFilterChange();
              }}
            >
              <TabsList className="flex flex-wrap justify-start h-auto">
                <TabsTrigger value="all">ყველა</TabsTrigger>
                {/* <TabsTrigger value="drafts">გადაუხდელი</TabsTrigger> */}
                <TabsTrigger value="to_process">გადახდილი</TabsTrigger>
                <TabsTrigger value="on_delivery">
                  მიწოდების პროცესშია
                </TabsTrigger>
                <TabsTrigger value="completed">მიწოდებული</TabsTrigger>
                <TabsTrigger value="cancelled">გაუქმებული</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="uuid">შეკვეთის ID</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="uuid"
                    placeholder="ORD-2026..."
                    value={uuid}
                    onChange={(e) => {
                      setUuid(e.target.value);
                      handleFilterChange();
                    }}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="id">შეკვეთის ID</Label>
                <Input
                  id="id"
                  placeholder="id"
                  value={id}
                  onChange={(e) => {
                    setId(e.target.value);
                    handleFilterChange();
                  }}
                />
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="email">მომხმარებლის ელ.ფოსტა</Label>
                <Input
                  id="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    handleFilterChange();
                  }}
                />
              </div>

              {hasActiveFilters && (
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="w-full"
                  >
                    <X className="mr-2 h-4 w-4" />
                    ფილტრების გასუფთავება
                  </Button>
                </div>
              )}
            </div>
          </div>

          <OrdersTable orders={orders} isLoading={isLoading} />

          {data && data.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1}-
                {Math.min(page * limit, data.total)} of {data.total} orders
              </div>
              <Pagination
                currentPage={page}
                totalPages={data.totalPages}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
