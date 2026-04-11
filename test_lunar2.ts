import { Solar } from 'lunar-javascript';
const solar = Solar.fromYmdHms(2002, 4, 29, 17, 58, 0);
const lunar = solar.getLunar();
const baZi = lunar.getEightChar();
console.log("Year:", baZi.getYear());
console.log("Month:", baZi.getMonth());
console.log("Day:", baZi.getDay());
console.log("Time:", baZi.getTime());

const getShenShaStr = (shenShaArray: any) => {
  if (!shenShaArray) return "";
  if (Array.isArray(shenShaArray)) {
    return shenShaArray.map(s => typeof s === 'string' ? s : (s.getName ? s.getName() : JSON.stringify(s))).join('、');
  }
  return String(shenShaArray);
};

console.log("Year ShenSha:", getShenShaStr(baZi.getYearShenSha()));
console.log("Month ShenSha:", getShenShaStr(baZi.getMonthShenSha()));
console.log("Day ShenSha:", getShenShaStr(baZi.getDayShenSha()));
console.log("Time ShenSha:", getShenShaStr(baZi.getTimeShenSha()));
