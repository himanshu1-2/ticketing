import { Publisher, TicketCreatedEvent, Subjects } from "@cygnetops/common"
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}
