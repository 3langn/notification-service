export enum ENUM_ROUTING_KEY {
  PING = "ping",
  PLACE_ORDER = "place_order",
}

export enum ENUM_EXCHANGE {
  NOTIFICATION = "notification_exchange",
  PING = "amq.direct",
}

export enum ENUM_QUEUE {
  NOTIFICATION = "notification_queue",
  PING = "ping_queue",
}

export const MapQueueWithExchange = {
  [ENUM_QUEUE.NOTIFICATION]: ENUM_EXCHANGE.NOTIFICATION,
  [ENUM_QUEUE.PING]: ENUM_EXCHANGE.PING,
};
