export const uniqueArray = (val: any[]) => {
  return val.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
};
