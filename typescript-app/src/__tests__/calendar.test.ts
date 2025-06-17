import { LiturgicalCalendar, LiturgicalSeason } from '../services/calendar';

test('Easter Sunday 2025 is identified correctly', () => {
  const info = LiturgicalCalendar.getDayInfo('2025-04-20');
  expect(info.season).toBe(LiturgicalSeason.EASTERTIDE);
  expect(info.celebration).toBe('Easter Sunday');
});
