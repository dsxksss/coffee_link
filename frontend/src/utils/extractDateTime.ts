function extractDateTime(dateTimeString:string):string {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const extractedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
  return extractedDateTime;
}

export {extractDateTime}