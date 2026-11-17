// Enums
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ORGANIZER = 'ORGANIZER',
  STAFF = 'STAFF',
  BUYER = 'BUYER',
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TicketMode {
  GENERAL_ADMISSION = 'GENERAL_ADMISSION', // Quota based
  RESERVED_SEATING = 'RESERVED_SEATING',   // Seat map based
}

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  LOCKED = 'LOCKED',
  SOLD = 'SOLD',
  BLOCKED = 'BLOCKED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum TicketStatus {
  VALID = 'VALID',
  USED = 'USED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

// Event Bus Payload Types
export interface OrderPaidEvent {
  orderId: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  eventId: string;
  totalAmount: number;
  paidAt: string;
  items: Array<{
    ticketTypeId: string;
    seatId?: string;
    quantity: number;
    price: number;
    attendeeName?: string;
    attendeeEmail?: string;
    attendeeIdentity?: string;
  }>;
}

export interface SeatLockRequest {
  sessionId: string;
  seatId: string;
  userId: string;
  ttlSeconds: number;
}

