-- Phase 3 performance indexes. Idempotent so this can be applied after migration-history reconciliation.
CREATE INDEX IF NOT EXISTS "Ticket_requesterId_idx" ON "Ticket"("requesterId");
CREATE INDEX IF NOT EXISTS "Ticket_assigneeId_idx" ON "Ticket"("assigneeId");
CREATE INDEX IF NOT EXISTS "Ticket_departmentId_idx" ON "Ticket"("departmentId");
CREATE INDEX IF NOT EXISTS "Ticket_status_idx" ON "Ticket"("status");
CREATE INDEX IF NOT EXISTS "Ticket_priority_idx" ON "Ticket"("priority");
CREATE INDEX IF NOT EXISTS "Ticket_createdAt_idx" ON "Ticket"("createdAt");
CREATE INDEX IF NOT EXISTS "Ticket_assigneeId_status_updatedAt_idx" ON "Ticket"("assigneeId", "status", "updatedAt");
CREATE INDEX IF NOT EXISTS "Ticket_departmentId_status_updatedAt_idx" ON "Ticket"("departmentId", "status", "updatedAt");
CREATE INDEX IF NOT EXISTS "Ticket_status_priority_createdAt_idx" ON "Ticket"("status", "priority", "createdAt");
CREATE INDEX IF NOT EXISTS "Comment_ticketId_idx" ON "Comment"("ticketId");
