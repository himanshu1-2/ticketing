import { Message } from "node-nats-streaming"
import { Subjects, Listener, OrderCreatedEvent } from "@cygnetops/common"
import { queueGroupName } from "./queue-group-name"
import { Ticket } from "../../models/ticket"
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher"
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
  queueGroupName = queueGroupName
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)
    if (!ticket) throw new Error("ticket not found")

    ticket.set({ orderId: data.id })
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      orderId: ticket.orderId,
      version: ticket.version,
    })
    await ticket.save()
    msg.ack()
  }
}
