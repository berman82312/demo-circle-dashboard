export const objectContainsKeyword = (target: object, keyword: string) => {
  for (const [key, value] of Object.entries(target)) {
    if (typeof value === 'object') {
      if (objectContainsKeyword(value, keyword)) {
        return true;
      }
    }
    else if (typeof value !== 'string') {
      const stringValue = String(value);
      if (stringValue.toLowerCase().includes(keyword)) {
        return true;
      }
    }
    else {
      if (value.toLowerCase().includes(keyword)) {
        return true;
      }
      if (key === 'date') {
        const date = new Date(value);
        if (date.toLocaleString().includes(keyword)) {
          return true;
        }
      }
    }
  }
  return false;
};
