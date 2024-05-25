import { Injectable } from '@nestjs/common';
import { SessionManager } from './session-manager';
import { UUID } from 'crypto';

@Injectable()
export class SessionService {

    private readonly sessionTracker: Set<SessionManager> = new Set()

    public get getSessionTracker(): Set<SessionManager> {
        return this.sessionTracker
    }

    public isOnLine(userId: UUID): boolean {
        for (const sessionManager of this.sessionTracker) {
            if (sessionManager.userId === userId) return true
        }
        return false
    }

    public addSession(userId: UUID, sessionId: string): void {
        if (this.isOnLine(userId)) {
            for (const sessionManager of this.sessionTracker) {
                if (sessionManager.userId === userId) {
                    sessionManager.sessionIds.add(sessionId)
                    break
                }
            }
        } else {
            const sessionManager = new SessionManager()
            sessionManager.userId = userId
            sessionManager.sessionIds.add(sessionId)
            this.sessionTracker.add(sessionManager)
        }
    }

    public getClientIdsFromUserId(userId: UUID): Set<string> | null {
        if (!this.isOnLine(userId)) return null
        for (const sessionManager of this.sessionTracker) {
            if (sessionManager.userId === userId) return sessionManager.sessionIds
        }
    }

    public removeSession(sessionId: string): void {
        
        for (const sessionManager of this.sessionTracker) {
            if (sessionManager.sessionIds.has(sessionId)) {
                sessionManager.sessionIds.delete(sessionId)
                if (sessionManager.sessionIds.size === 0) this.sessionTracker.delete(sessionManager)
                break
            }
        }
        
    }

}
