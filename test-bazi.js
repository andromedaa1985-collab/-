import { Solar, Lunar } from 'lunar-javascript';

const solar = Solar.fromYmdHms(1990, 5, 15, 14, 30, 0);
const lunar = solar.getLunar();
const bazi = lunar.getEightChar();

console.log("Year:", bazi.getYearGan(), bazi.getYearZhi());
console.log("Month:", bazi.getMonthGan(), bazi.getMonthZhi());
console.log("Day:", bazi.getDayGan(), bazi.getDayZhi());
console.log("Time:", bazi.getTimeGan(), bazi.getTimeZhi());

console.log("Day Master:", bazi.getDayGan());

console.log("Year Gan Ten God:", bazi.getYearShiShenGan());
console.log("Year Zhi Ten God:", bazi.getYearShiShenZhi());

console.log("Month Gan Ten God:", bazi.getMonthShiShenGan());
console.log("Month Zhi Ten God:", bazi.getMonthShiShenZhi());

console.log("Day Zhi Ten God:", bazi.getDayShiShenZhi());

console.log("Time Gan Ten God:", bazi.getTimeShiShenGan());
console.log("Time Zhi Ten God:", bazi.getTimeShiShenZhi());

console.log("Year Zhi Hidden Gan:", bazi.getYearHideGan());
console.log("Month Zhi Hidden Gan:", bazi.getMonthHideGan());
console.log("Day Zhi Hidden Gan:", bazi.getDayHideGan());
console.log("Time Zhi Hidden Gan:", bazi.getTimeHideGan());

console.log("Year ShenSha:", bazi.getYearShenSha());
console.log("Month ShenSha:", bazi.getMonthShenSha());
console.log("Day ShenSha:", bazi.getDayShenSha());
console.log("Time ShenSha:", bazi.getTimeShenSha());
console.log("WuXing Month:", bazi.getMonthWuXing());
console.log("WuXing Day:", bazi.getDayWuXing());
console.log("WuXing Time:", bazi.getTimeWuXing());
