import { Solar } from 'lunar-javascript';
const solar = Solar.fromYmdHms(2011, 4, 14, 19, 3, 0);
const lunar = solar.getLunar();
const baZi = lunar.getEightChar();
console.log("Year ShenSha:", baZi.getYearShenSha());
console.log("Month ShenSha:", baZi.getMonthShenSha());
console.log("Day ShenSha:", baZi.getDayShenSha());
console.log("Time ShenSha:", baZi.getTimeShenSha());
