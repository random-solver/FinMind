import { GdprPrivacyManager } from '../lib/gdprPrivacyWorkflow';

describe('GdprPrivacyManager', () => {
  it('exports user PII package, permanently deletes data, and records audit logs', () => {
    const mgr = new GdprPrivacyManager();
    mgr.registerUserData({
      userId: 'u_101',
      email: 'alice@example.com',
      fullName: 'Alice Example',
      transactions: [{ id: 'tx1', amount: 120, description: 'Grocery' }],
    });

    const pkg = mgr.exportUserDataPackage('u_101');
    expect(pkg.data.email).toBe('alice@example.com');

    const del = mgr.irreversiblyDeleteUserData('u_101');
    expect(del.deleted).toBe(true);
    expect(() => mgr.exportUserDataPackage('u_101')).toThrow();
    expect(mgr.getAuditTrail('u_101')).toHaveLength(2);
  });
});
