type CRCPayload = {
  distance: number | string | undefined;
  kmPrice: number | string | undefined;
  transporterAmount: number | string | undefined;
};
export function calculateRideCostsByKm({ distance, kmPrice, transporterAmount }: CRCPayload) {
  const costs = Number(distance ?? 0) * Number(kmPrice ?? 0) * Number(transporterAmount ?? 0);
  return Math.round(costs / 5) * 5;
}
