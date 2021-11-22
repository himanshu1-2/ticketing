import Queue from "bull"
import { ExpirationCompletePublisher } from "../events/publisher/expiration-complete-publisher"
import { natsWrapper } from "../nats-wrapper"
interface Payload {
  orderId: string
}
export const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
})

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  })
})
