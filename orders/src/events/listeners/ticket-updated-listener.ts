import { Message } from "node-nats-streaming"
import { Subjects, Listener, TicketUpdatedEvent } from "@cygnetops/common"
import { queueGroupName } from "./queue-group-name"
import { Ticket } from "../../models/ticket"
export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
  queueGroupName = queueGroupName
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price } = data
    const ticket = await Ticket.findOne({
      _id: data.id,
      version: data.version - 1,
    })
    if (!ticket) throw new Error("Ticket not found")
    ticket.set({ title, price })
    await ticket.save()
    msg.ack()
  }
}
