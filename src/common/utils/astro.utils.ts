import { ZODIAC_SIGNS, ELEMENTS } from '../constants/astro.constants';

export class AstroUtils {
  /**
   * Вычисляет знак зодиака по дате рождения
   */
  static calculateZodiacSign(birthDate: Date): string {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC_SIGNS.ARIES;
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC_SIGNS.TAURUS;
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC_SIGNS.GEMINI;
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC_SIGNS.CANCER;
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_SIGNS.LEO;
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_SIGNS.VIRGO;
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC_SIGNS.LIBRA;
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC_SIGNS.SCORPIO;
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIAC_SIGNS.SAGITTARIUS;
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZODIAC_SIGNS.CAPRICORN;
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC_SIGNS.AQUARIUS;
    return ZODIAC_SIGNS.PISCES;
  }

  /**
   * Вычисляет элемент по знаку зодиака
   */
  static calculateElement(zodiacSign: string): string {
    const fireSigns = [ZODIAC_SIGNS.ARIES, ZODIAC_SIGNS.LEO, ZODIAC_SIGNS.SAGITTARIUS];
    const earthSigns = [ZODIAC_SIGNS.TAURUS, ZODIAC_SIGNS.VIRGO, ZODIAC_SIGNS.CAPRICORN];
    const airSigns = [ZODIAC_SIGNS.GEMINI, ZODIAC_SIGNS.LIBRA, ZODIAC_SIGNS.AQUARIUS];
    const waterSigns = [ZODIAC_SIGNS.CANCER, ZODIAC_SIGNS.SCORPIO, ZODIAC_SIGNS.PISCES];

    if (fireSigns.includes(zodiacSign as any)) return ELEMENTS.FIRE;
    if (earthSigns.includes(zodiacSign as any)) return ELEMENTS.EARTH;
    if (airSigns.includes(zodiacSign as any)) return ELEMENTS.AIR;
    if (waterSigns.includes(zodiacSign as any)) return ELEMENTS.WATER;

    return ELEMENTS.FIRE; // fallback
  }

  /**
   * Вычисляет совместимость между знаками зодиака
   */
  static calculateZodiacCompatibility(sign1: string, sign2: string): number {
    if (sign1 === sign2) return 100; // Один и тот же знак

    const zodiacOrder = [
      ZODIAC_SIGNS.ARIES,
      ZODIAC_SIGNS.TAURUS,
      ZODIAC_SIGNS.GEMINI,
      ZODIAC_SIGNS.CANCER,
      ZODIAC_SIGNS.LEO,
      ZODIAC_SIGNS.VIRGO,
      ZODIAC_SIGNS.LIBRA,
      ZODIAC_SIGNS.SCORPIO,
      ZODIAC_SIGNS.SAGITTARIUS,
      ZODIAC_SIGNS.CAPRICORN,
      ZODIAC_SIGNS.AQUARIUS,
      ZODIAC_SIGNS.PISCES,
    ];

    const index1 = zodiacOrder.indexOf(sign1 as any);
    const index2 = zodiacOrder.indexOf(sign2 as any);

    if (index1 === -1 || index2 === -1) return 0;

    const distance = Math.min(
      Math.abs(index1 - index2),
      Math.abs(index1 - index2 + 12),
      Math.abs(index1 - index2 - 12),
    );

    // Соседние знаки - хорошая совместимость
    if (distance === 1) return 75;
    // Через один знак - средняя совместимость
    if (distance === 2) return 60;
    // Противоположные знаки - сложная совместимость
    if (distance === 6) return 25;
    // Остальные - нейтральная совместимость
    return 50;
  }

  /**
   * Вычисляет текущий сезон
   */
  static getCurrentSeason(): string {
    const month = new Date().getMonth() + 1;

    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }

  /**
   * Вычисляет день недели по дате
   */
  static getDayOfWeek(date: Date): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  }

  /**
   * Проверяет, является ли дата полнолунием
   */
  static isFullMoon(date: Date): boolean {
    // Упрощенная проверка - в реальном проекте используется Swiss Ephemeris
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Примерные даты полнолуний (упрощенно)
    const fullMoonDates = [
      { month: 1, day: 6 },
      { month: 2, day: 5 },
      { month: 3, day: 7 },
      { month: 4, day: 6 },
      { month: 5, day: 5 },
      { month: 6, day: 4 },
      { month: 7, day: 3 },
      { month: 8, day: 2 },
      { month: 9, day: 1 },
      { month: 10, day: 1 },
      { month: 11, day: 30 },
      { month: 12, day: 30 },
    ];

    return fullMoonDates.some(fm => fm.month === month && Math.abs(fm.day - day) <= 1);
  }

  /**
   * Вычисляет возраст по дате рождения
   */
  static calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
