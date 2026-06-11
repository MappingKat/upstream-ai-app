import { district } from '@/data/district';
import { users } from '@/data/users';
import { navSections } from '@/data/navigation';
import { focusItem, trendStats, timelineSections, snapshotRows } from '@/data/home';
import { integrations } from '@/data/integrations';

describe('district data', () => {
  it('has correct name', () => {
    expect(district.name).toBe('Town of Alma');
  });

  it('has PWS ID', () => {
    expect(district.pwsId).toBe('CO0147001');
  });

  it('has CDPS permit', () => {
    expect(district.cdpsPermit).toBe('COG591177');
  });

  it('has population', () => {
    expect(district.population).toBe(270);
  });

  it('has DW and WW system classes', () => {
    expect(district.dwSystemClass).toBeTruthy();
    expect(district.wwSystemClass).toBeTruthy();
  });
});

describe('users data', () => {
  it('has operator user', () => {
    expect(users.operator.initials).toBe('BJ');
    expect(users.operator.name).toBe('Bobby Jensen');
    expect(users.operator.roleLabel).toContain('Operator');
  });

  it('has manager user', () => {
    expect(users.manager.initials).toBe('KW');
    expect(users.manager.name).toBe('Kat White');
    expect(users.manager.roleLabel).toContain('Public Works');
  });
});

describe('navigation data', () => {
  it('has 3 sections', () => {
    expect(navSections).toHaveLength(3);
  });

  it('sections are Compliance, Operations, Reference', () => {
    expect(navSections.map(s => s.title)).toEqual(['Compliance', 'Operations', 'Reference']);
  });

  it('Compliance has 4 items', () => {
    expect(navSections[0].items).toHaveLength(4);
  });

  it('DMR Prep is WW-only', () => {
    const dmr = navSections[0].items.find(i => i.label === 'DMR Prep');
    expect(dmr?.modeVisibility).toBe('ww');
  });

  it('MOR Prep is DW-only', () => {
    const mor = navSections[0].items.find(i => i.label === 'MOR Prep');
    expect(mor?.modeVisibility).toBe('dw');
  });

  it('all nav items have href', () => {
    navSections.forEach(section => {
      section.items.forEach(item => {
        expect(item.href).toBeTruthy();
        expect(item.href.startsWith('/')).toBe(true);
      });
    });
  });

  it('Lab Samples is marked as new', () => {
    const lab = navSections[1].items.find(i => i.label === 'Lab Samples');
    expect(lab?.isNew).toBe(true);
  });
});

describe('home data', () => {
  describe('focusItem', () => {
    it('has required fields', () => {
      expect(focusItem.eyebrow).toBeTruthy();
      expect(focusItem.title).toBeTruthy();
      expect(focusItem.subtitle).toBeTruthy();
      expect(focusItem.ctaLabel).toBeTruthy();
      expect(focusItem.ctaHref).toBeTruthy();
      expect(['warn', 'ok']).toContain(focusItem.variant);
    });
  });

  describe('trendStats', () => {
    it('has 4 stats', () => {
      expect(trendStats).toHaveLength(4);
    });

    it('each stat has required fields', () => {
      trendStats.forEach(stat => {
        expect(stat.label).toBeTruthy();
        expect(stat.value).toBeDefined();
        expect(stat.unit).toBeTruthy();
        expect(stat.delta).toBeDefined();
        expect(['up', 'down', 'flat']).toContain(stat.delta.direction);
        expect(stat.note).toBeTruthy();
        expect(stat.accentColor).toBeTruthy();
      });
    });

    it('has one WW-only and one DW-only stat', () => {
      const wwStats = trendStats.filter(s => s.modeVisibility === 'ww');
      const dwStats = trendStats.filter(s => s.modeVisibility === 'dw');
      expect(wwStats).toHaveLength(1);
      expect(dwStats).toHaveLength(1);
    });
  });

  describe('timelineSections', () => {
    it('has 3 sections', () => {
      expect(timelineSections).toHaveLength(3);
    });

    it('sections are imminent, upcoming, future', () => {
      expect(timelineSections.map(s => s.variant)).toEqual(['imminent', 'upcoming', 'future']);
    });

    it('each section has items with required fields', () => {
      timelineSections.forEach(section => {
        expect(section.items.length).toBeGreaterThan(0);
        section.items.forEach(item => {
          expect(item.date.day).toBeGreaterThan(0);
          expect(item.date.month).toBeTruthy();
          expect(item.title).toBeTruthy();
          expect(item.subtitle).toBeTruthy();
        });
      });
    });

    it('all timeline items have mode visibility set', () => {
      timelineSections.forEach(section => {
        section.items.forEach(item => {
          expect(['dw', 'ww']).toContain(item.modeVisibility);
        });
      });
    });
  });

  describe('snapshotRows', () => {
    it('has 7 rows', () => {
      expect(snapshotRows).toHaveLength(7);
    });

    it('each row has label and value', () => {
      snapshotRows.forEach(row => {
        expect(row.label).toBeTruthy();
        expect(row.value).toBeTruthy();
      });
    });

    it('has DW and WW specific rows', () => {
      const dwRows = snapshotRows.filter(r => r.modeVisibility === 'dw');
      const wwRows = snapshotRows.filter(r => r.modeVisibility === 'ww');
      expect(dwRows.length).toBeGreaterThan(0);
      expect(wwRows.length).toBeGreaterThan(0);
    });
  });
});

describe('integrations data', () => {
  it('has 5 integrations', () => {
    expect(integrations).toHaveLength(5);
  });

  it('each integration has required fields', () => {
    integrations.forEach(integ => {
      expect(integ.name).toBeTruthy();
      expect(['healthy', 'warn', 'down']).toContain(integ.status);
      expect(integ.statusText).toBeTruthy();
      expect(integ.meta.length).toBeGreaterThan(0);
    });
  });

  it('has exactly 1 warn status (Lab inbox)', () => {
    const warns = integrations.filter(i => i.status === 'warn');
    expect(warns).toHaveLength(1);
    expect(warns[0].name).toBe('Lab inbox (CAL)');
  });

  it('has 4 healthy integrations', () => {
    expect(integrations.filter(i => i.status === 'healthy')).toHaveLength(4);
  });
});
