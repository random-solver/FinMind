export interface UserProfileRecord {
  userId: string;
  email: string;
  fullName: string;
  phone?: string;
  transactions: Array<{ id: string; amount: number; description: string }>;
}

export interface AuditLogEntry {
  eventId: string;
  userId: string;
  action: 'PII_EXPORT' | 'PII_IRREVERSIBLE_DELETE';
  timestamp: string;
  status: 'COMPLETED';
}

export class GdprPrivacyManager {
  private store = new Map<string, UserProfileRecord>();
  private auditTrail: AuditLogEntry[] = [];

  registerUserData(record: UserProfileRecord): void {
    this.store.set(record.userId, JSON.parse(JSON.stringify(record)));
  }

  exportUserDataPackage(userId: string): { exportedAt: string; format: 'JSON'; data: UserProfileRecord } {
    const record = this.store.get(userId);
    if (!record) {
      throw new Error(`User ${userId} not found`);
    }
    const now = new Date().toISOString();
    this.auditTrail.push({
      eventId: `evt_${Date.now()}_exp`,
      userId,
      action: 'PII_EXPORT',
      timestamp: now,
      status: 'COMPLETED',
    });
    return {
      exportedAt: now,
      format: 'JSON',
      data: JSON.parse(JSON.stringify(record)),
    };
  }

  irreversiblyDeleteUserData(userId: string): { deleted: boolean; auditEntry: AuditLogEntry } {
    if (!this.store.has(userId)) {
      throw new Error(`User ${userId} not found`);
    }
    this.store.delete(userId);
    const entry: AuditLogEntry = {
      eventId: `evt_${Date.now()}_del`,
      userId,
      action: 'PII_IRREVERSIBLE_DELETE',
      timestamp: new Date().toISOString(),
      status: 'COMPLETED',
    };
    this.auditTrail.push(entry);
    return { deleted: true, auditEntry: entry };
  }

  getAuditTrail(userId?: string): AuditLogEntry[] {
    return userId ? this.auditTrail.filter((a) => a.userId === userId) : [...this.auditTrail];
  }
}
