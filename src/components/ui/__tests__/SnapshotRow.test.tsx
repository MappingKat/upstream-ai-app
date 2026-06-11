import { render, screen } from '@/test/test-utils';
import { SnapshotRowList } from '@/components/ui/SnapshotRow';
import type { SnapshotRow } from '@/lib/types';

describe('SnapshotRowList', () => {
  const baseRows: SnapshotRow[] = [
    { label: 'Population', value: '~270' },
    { label: 'Status', value: 'OK', status: 'ok' },
    { label: 'Warning', value: 'Low', status: 'warn' },
  ];

  it('renders all rows', () => {
    render(<SnapshotRowList rows={baseRows} />);
    expect(screen.getByText('Population')).toBeInTheDocument();
    expect(screen.getByText('~270')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('applies ok status color to value', () => {
    render(<SnapshotRowList rows={[{ label: 'Test', value: 'Good', status: 'ok' }]} />);
    const val = screen.getByText('Good');
    expect(val.className).toContain('text-green');
  });

  it('applies warn status color to value', () => {
    render(<SnapshotRowList rows={[{ label: 'Test', value: 'Bad', status: 'warn' }]} />);
    const val = screen.getByText('Bad');
    expect(val.className).toContain('text-yellow');
  });

  it('renders mode-specific rows via ModeVisible in "all" mode', () => {
    const rows: SnapshotRow[] = [
      { label: 'DW row', value: 'DW val', modeVisibility: 'dw' },
      { label: 'WW row', value: 'WW val', modeVisibility: 'ww' },
    ];
    // Default mode is 'all', so both should render
    render(<SnapshotRowList rows={rows} />);
    expect(screen.getByText('DW row')).toBeInTheDocument();
    expect(screen.getByText('WW row')).toBeInTheDocument();
  });
});
