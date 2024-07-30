import { Injectable } from '@nestjs/common';

@Injectable()
export class AstrologyService {
  private horoscopes = [
    { name: 'Aries', startDate: '03-21', endDate: '04-19' },
    { name: 'Taurus', startDate: '04-20', endDate: '05-20' },
    { name: 'Gemini', startDate: '05-21', endDate: '06-20' },
    { name: 'Cancer', startDate: '06-21', endDate: '07-22' },
    { name: 'Leo', startDate: '07-23', endDate: '08-22' },
    { name: 'Virgo', startDate: '08-23', endDate: '09-22' },
    { name: 'Libra', startDate: '09-23', endDate: '10-22' },
    { name: 'Scorpio', startDate: '10-23', endDate: '11-21' },
    { name: 'Sagittarius', startDate: '11-22', endDate: '12-21' },
    { name: 'Capricorn', startDate: '12-22', endDate: '01-19' },
    { name: 'Aquarius', startDate: '01-20', endDate: '02-18' },
    { name: 'Pisces', startDate: '02-19', endDate: '03-20' },
  ];

  private zodiacs = [
    // { name: 'Rat', startYear: 2020, cycle: 12 },
    // { name: 'Ox', startYear: 2021, cycle: 12 },
    // { name: 'Tiger', startYear: 2022, cycle: 12 },
    // { name: 'Rabbit', startYear: 2023, cycle: 12 },
    // { name: 'Dragon', startYear: 2024, cycle: 12 },
    // { name: 'Snake', startYear: 2025, cycle: 12 },
    // { name: 'Horse', startYear: 2026, cycle: 12 },
    // { name: 'Goat', startYear: 2027, cycle: 12 },
    // { name: 'Monkey', startYear: 2028, cycle: 12 },
    // { name: 'Rooster', startYear: 2029, cycle: 12 },
    // { name: 'Dog', startYear: 2030, cycle: 12 },
    // { name: 'Pig', startYear: 2031, cycle: 12 },

    { name: 'Rat' },
    { name: 'Ox' },
    { name: 'Tiger' },
    { name: 'Rabbit' },
    { name: 'Dragon' },
    { name: 'Snake' },
    { name: 'Horse' },
    { name: 'Goat' },
    { name: 'Monkey' },
    { name: 'Rooster' },
    { name: 'Dog' },
    { name: 'Pig' },
  ];

  determineHoroscope(date: Date): string {
    const monthDay = date.toISOString().slice(5, 10);
    return (
      this.horoscopes.find(
        (h) =>
          (monthDay >= h.startDate && monthDay <= h.endDate) ||
          (h.startDate > h.endDate &&
            (monthDay >= h.startDate || monthDay <= h.endDate)),
      )?.name || 'Unknown'
    );
  }

  determineZodiac(date: Date): string {
    const year = date.getFullYear();
    const cycleLength = 12;

    // Hitung posisi siklus berdasarkan tahun
    const cyclePosition =
      (((year - 1924) % cycleLength) + cycleLength) % cycleLength;
    return this.zodiacs[cyclePosition]?.name || 'Unknown';
  }
}
