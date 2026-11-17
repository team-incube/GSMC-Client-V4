// 학번 "2216"을 "2학년 2반 16번"으로 바꾼다. 형식이 다르면 받은 값을 그대로 돌려준다.
export function formatStudentNumber(studentNumber: string) {
  const match = /^(\d)(\d)(\d{2})$/.exec(studentNumber);
  if (!match) return studentNumber;
  const [, grade, classNumber, number] = match;
  return `${grade}학년 ${classNumber}반 ${Number(number)}번`;
}
