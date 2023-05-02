export enum ENUM_ROUTING_KEY {
  PING = "ping",
  PLACE_ORDER = "place_order",
}

export enum ENUM_EXCHANGE {
  NOTIFICATION = "notification_exchange",
}

export enum ENUM_QUEUE {
  NOTIFICATION = "notification_queue",
}

export const MapQueueWithExchange = {
  [ENUM_QUEUE.NOTIFICATION]: ENUM_EXCHANGE.NOTIFICATION,
};
