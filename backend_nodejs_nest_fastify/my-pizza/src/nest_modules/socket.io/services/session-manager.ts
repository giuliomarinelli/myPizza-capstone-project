import { UUID } from "crypto";

export class SessionManager {
    constructor() { }
    userId: UUID
    sessionIds: Set<string> = new Set()
}