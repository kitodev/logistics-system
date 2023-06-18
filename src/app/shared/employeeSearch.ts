
export const employeeSearch: (term: string, item: EmployeeDto) => boolean = (
  term: string,
  item: EmployeeDto
) => {
  function normalize(text: string): string {
    return text.toLowerCase().normalize('NFKD').replace(/[^\w]/g, '');
  }

  term = normalize(term);
  const firstName = normalize(item.firstName);
  const lastName = normalize(item.lastName);
  return (
    `${firstName}${lastName}`.indexOf(term) > -1 ||
    `${lastName}${firstName}`.indexOf(term) > -1
  );
};
