const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export default (date) => {
  date = new Date(date);
  const year = date.getFullYear();
  let month = MONTHS[date.getMonth()];
  let day = date.getDate().toString();
  return month + " " + day + ", " + year;
};
