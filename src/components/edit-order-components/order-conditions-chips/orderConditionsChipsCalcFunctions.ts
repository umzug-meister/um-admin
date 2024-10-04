import { Address } from 'um-types';

export function isLocalMovement(from: Address, to: Address) {
  return from.address?.includes('München') && to.address?.includes('München');
}

export function getParkingsSlotsAmount(from: Address, to: Address) {
  return Number(from.parkingSlot || 0) + Number(to.parkingSlot || 0);
}

type CRCPayload = {
  distance: number | string | undefined;
  kmPrice: number | string | undefined;
  transporterAmount: number | string | undefined;
};
export function calculateRideCostsByKm({ distance, kmPrice, transporterAmount }: CRCPayload) {
  const costs = Number(distance ?? 0) * Number(kmPrice ?? 0) * Number(transporterAmount ?? 0);
  return Math.round(costs / 5) * 5;
}
