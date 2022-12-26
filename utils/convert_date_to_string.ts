import moment from 'moment';

function convertDateToString(dateString: string): string {
  const dateTime = moment(dateString, moment.ISO_8601).milliseconds(0);
  const now = moment();

  const diff = now.diff(dateTime);
  const calDuration = moment.duration(diff);
  const years = calDuration.years();
  const month = calDuration.months();
  const days = calDuration.days();
  const hour = calDuration.hours();
  const minutes = calDuration.minutes();
  const secends = calDuration.seconds();

  if (
    years === 0 &&
    month === 0 &&
    days === 0 &&
    hour === 0 &&
    minutes === 0 &&
    secends !== undefined &&
    (secends === 0 || secends < 1)
  ) {
    return '0초';
  }
  if (years === 0 && month === 0 && days === 0 && hour === 0 && minutes === 0 && secends) {
    return `${Math.floor(secends)}초`;
  }
  if (years === 0 && month === 0 && days === 0 && hour === 0) {
    return `${minutes}분`;
  }
  if (years === 0 && month === 0 && days === 0) {
    return `${hour}시간`;
  }
  if (years === 0 && month === 0) {
    return `${days}일`;
  }
  if (years === 0) {
    return `${month}개월`;
  }
  return `${years}년`;
}

export default convertDateToString;
