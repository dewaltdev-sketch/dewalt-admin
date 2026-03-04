"use client";

import { Fragment, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, Save } from "lucide-react";
import type { Order, OrderStatus, OrderUser, ProductSummary } from "../types";
import { useGetOrderById } from "../hooks/useGetOrderById";
import { useUpdateOrderStatus } from "../hooks/useUpdateOrderStatus";
import Image from "next/image";

function getStatusLabel(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "დრაფტი";
    case "paid":
      return "გადახდილი";
    case "shipped":
      return "მიწოდების პროცესშია";
    case "delivered":
      return "დასრულებული";
    case "failed":
      return "გაუქმებული";
    default:
      return status;
  }
}

function getStatusVariant(status: OrderStatus) {
  switch (status) {
    case "failed":
      return "destructive" as const;
    case "pending":
      return "outline" as const;
    case "paid":
      return "secondary" as const;
    case "shipped":
    case "delivered":
      return "default" as const;
    default:
      return "outline" as const;
  }
}

function getUserEmail(order: Order) {
  const user = order.userId as OrderUser | undefined;
  if (user && typeof user === "object" && "email" in user) return user.email;
  return order.email || "-";
}

function getCustomerId(order: Order) {
  const user = order.userId as OrderUser | undefined;
  if (user && typeof user === "object" && "_id" in user) return user._id;
  if (typeof order.userId === "string") return order.userId;
  return "არა ავტორიზებული";
}

function getProduct(itemProductId: string | ProductSummary) {
  if (!itemProductId || typeof itemProductId === "string") return undefined;
  return itemProductId;
}

export function OrdersTable({
  orders,
  isLoading,
}: {
  orders: Order[];
  isLoading?: boolean;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [nextStatus, setNextStatus] = useState<string>("");

  const detailsQuery = useGetOrderById(expandedId ?? undefined);
  const updateStatus = useUpdateOrderStatus();

  const expandedOrder = detailsQuery.data?.order;
  const ordersCountForUser = detailsQuery.data?.ordersCountForUser ?? 0;

  const statusValue = useMemo(() => {
    if (!expandedOrder) return "";
    return nextStatus || expandedOrder.status;
  }, [expandedOrder, nextStatus]);

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>სახელი გვარი</TableHead>
              <TableHead>თარიღი</TableHead>
              <TableHead>შეკვეთის ID</TableHead>
              <TableHead>მომხამრებლის ID</TableHead>
              <TableHead>მომხამრებლის ელ.ფოსტა</TableHead>

              <TableHead>სტატუსი</TableHead>
              <TableHead className="text-right">ჯამი</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  იტვირთება...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  შეკვეთები ვერ მოიძებნა.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <Fragment key={order._id}>
                  <TableRow
                    className="cursor-pointer"
                    onClick={() => {
                      setExpandedId((prev) =>
                        prev === order._id ? null : order._id
                      );
                      setNextStatus("");
                    }}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {expandedId === order._id ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>
                          {order.name} {order.surname}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.uuid || "-"}
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate">
                      {getCustomerId(order)}
                    </TableCell>
                    <TableCell className="max-w-[260px] truncate">
                      {getUserEmail(order)}
                    </TableCell>
                    {/* <TableCell>
                      <Badge
                        variant={isPaid(order.status) ? "default" : "outline"}
                      >
                        {isPaid(order.status) ? "Completed" : "Pending"}
                      </Badge>
                    </TableCell> */}
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      GEL {order.total}
                    </TableCell>
                  </TableRow>

                  {expandedId === order._id && (
                    <TableRow>
                      <TableCell colSpan={8} className="bg-muted/30">
                        {detailsQuery.isLoading || !expandedOrder ? (
                          <div className="py-4 text-sm text-muted-foreground">
                            დეტალები იტვირთება...
                          </div>
                        ) : detailsQuery.isError ? (
                          <div className="py-4 text-sm text-destructive">
                            დეტალების ჩატვირთვა ვერ მოხერხდა.
                          </div>
                        ) : (
                          <div className="space-y-4 py-4">
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">
                                  შეკვეთის ID:{" "}
                                  <span className="font-medium text-foreground">
                                    {expandedOrder.uuid}
                                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  მომხმარებელი:{" "}
                                  <span className="font-medium text-foreground">
                                    {expandedOrder.name} {expandedOrder.surname}
                                  </span>
                                  <span className="ml-2 text-muted-foreground">
                                    ({getUserEmail(expandedOrder)})
                                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  შეკვეთების რაოდენობა ამ მომხმარებელზე:{" "}
                                  <span className="font-medium text-foreground">
                                    {ordersCountForUser}
                                  </span>
                                </div>
                              </div>

                              <div className="flex w-full flex-col gap-3 md:w-auto md:min-w-[280px]">
                                <div className="space-y-2">
                                  <Label>სტატუსის შეცვლა</Label>
                                  <Select
                                    value={statusValue}
                                    onValueChange={(v) => setNextStatus(v)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="აირჩიეთ სტატუსი" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {/* <SelectItem value="pending">
                                        pending
                                      </SelectItem> */}
                                      <SelectItem value="paid">
                                        გადახდილი
                                      </SelectItem>
                                      <SelectItem value="shipped">
                                        მიწოდების პროცესშია
                                      </SelectItem>
                                      <SelectItem value="delivered">
                                        მიწოდებული
                                      </SelectItem>
                                      <SelectItem value="cancelled">
                                        გაუქმებული
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateStatus.mutate({
                                      orderId: expandedOrder._id,
                                      status: statusValue,
                                    });
                                  }}
                                  disabled={
                                    updateStatus.isPending ||
                                    !statusValue ||
                                    statusValue === expandedOrder.status
                                  }
                                >
                                  <Save className="mr-2 h-4 w-4" />
                                  {updateStatus.isPending
                                    ? "ინახება..."
                                    : "სტატუსის შენახვა"}
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                              <div className="rounded-md border bg-background p-3">
                                <div className="text-xs text-muted-foreground">
                                  კონტაქტი
                                </div>
                                <div className="mt-1 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">
                                      ტელ:
                                    </span>{" "}
                                    {expandedOrder.phone}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      პირადი №:
                                    </span>{" "}
                                    {expandedOrder.personalId}
                                  </div>
                                </div>
                              </div>
                              <div className="rounded-md border bg-background p-3">
                                <div className="text-xs text-muted-foreground">
                                  მისამართი
                                </div>
                                <div className="mt-1 text-sm">
                                  {expandedOrder.address}
                                </div>
                              </div>
                              <div className="rounded-md border bg-background p-3">
                                <div className="text-xs text-muted-foreground">
                                  თანხები
                                </div>
                                <div className="mt-1 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">
                                      ღირებულება:
                                    </span>{" "}
                                    GEL {expandedOrder.subtotal}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      მიწოდების ფასი:
                                    </span>{" "}
                                    GEL {expandedOrder.deliveryPrice}
                                  </div>
                                  <div className="font-semibold">
                                    ჯამი: GEL {expandedOrder.total}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="rounded-md border bg-background">
                              <div className="border-b px-3 py-2 text-sm font-medium">
                                პროდუქტები ({expandedOrder.items?.length ?? 0})
                              </div>
                              <div className="divide-y">
                                {(expandedOrder.items || []).map(
                                  (item, idx) => {
                                    const p = getProduct(item.productId);
                                    return (
                                      <div
                                        key={`${expandedOrder._id}-${idx}`}
                                        className="flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-start sm:justify-between"
                                      >
                                        <div className="min-w-0 flex   gap-2">
                                          <Image
                                            src={item?.image || ""}
                                            alt={""}
                                            width={160}
                                            height={160}
                                            className="h-[100px] w-[100px] rounded-md object-cover"
                                          />
                                          <div>
                                            <div className="text-sm font-medium">
                                              {typeof item?.name === "string"
                                                ? item?.name
                                                : item?.name?.en}
                                            </div>
                                            <div className="text-sm font-medium">
                                              {typeof item?.name === "string"
                                                ? item?.name
                                                : item?.name?.ka}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                              fina კოდი:{" "}
                                              {item?.finaCode
                                                ? ` ${item.finaCode}`
                                                : "არ მოიძებნა"}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                              {typeof item?.productId ===
                                              "string"
                                                ? `პროდუქტის Id: ${item?.productId}`
                                                : null}
                                              {typeof item?.productId ===
                                                "object" &&
                                              "_id" in item?.productId
                                                ? `პროდუქტის Id: ${item?.productId?._id}`
                                                : null}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="shrink-0 text-sm">
                                          <div className="text-muted-foreground">
                                            {item.quantity} × GEL{" "}
                                            {item.unitPrice}
                                          </div>
                                          <div className="font-semibold">
                                            GEL {item.lineTotal}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
