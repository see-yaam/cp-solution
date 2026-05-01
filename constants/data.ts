export interface Problem {
  letter: string;
  name: string;
}

export interface Sheet {
  id: string;
  name: string;
  contestId: string;
  problems: Problem[];
}

// Generate a generic A-Z problem list for placeholders
const generateGenericProblems = (): Problem[] => {
  const problems: Problem[] = [];
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);
    problems.push({ letter, name: `Problem ${letter}` });
  }
  return problems;
};

export const CURRICULUM: Sheet[] = [
  {
    id: "sheet-1",
    name: "01. Sheet #1 (Data type - Conditions)",
    contestId: "219158",
    problems: [
      { letter: "A", name: "Say Hello With C++" },
      { letter: "B", name: "Basic Data Types" },
      { letter: "C", name: "Simple Calculator" },
      { letter: "D", name: "Difference" },
      { letter: "E", name: "Area of a Circle" },
      { letter: "F", name: "Digits Summation" },
      { letter: "G", name: "Summation from 1 to N" },
      { letter: "H", name: "Two numbers" },
      { letter: "I", name: "Welcome for you with Conditions" },
      { letter: "J", name: "Multiples" },
      { letter: "K", name: "Max and Min" },
      { letter: "L", name: "The Brothers" },
      { letter: "M", name: "Capital or Small or Digit" },
      { letter: "N", name: "Char" },
      { letter: "O", name: "Calculator" },
      { letter: "P", name: "First digit !" },
      { letter: "Q", name: "Coordinates of a Point" },
      { letter: "R", name: "Age in Days" },
      { letter: "S", name: "Interval" },
      { letter: "T", name: "Sort Numbers" },
      { letter: "U", name: "Float or int" },
      { letter: "V", name: "Comparison" },
      { letter: "W", name: "Mathematical Expression" },
      { letter: "X", name: "Two intervals" },
      { letter: "Y", name: "The last 2 digits" },
      { letter: "Z", name: "Hard Compare" },
    ],
  },
  {
    id: "contest-1",
    name: "02. Contest #1",
    contestId: "219158",
    problems: generateGenericProblems().slice(0, 5), // Usually contests have fewer problems
  },
  {
    id: "sheet-2",
    name: "03. Sheet #2 (Loops)",
    contestId: "219447",
    problems: generateGenericProblems(),
  },
  {
    id: "contest-2",
    name: "04. Contest #2",
    contestId: "219432",
    problems: generateGenericProblems().slice(0, 5),
  },
  {
    id: "sheet-3",
    name: "05. Sheet #3 (Arrays)",
    contestId: "219774",
    problems: generateGenericProblems(),
  },
  {
    id: "contest-3",
    name: "06. Contest #3.1",
    contestId: "219774", // Placeholder if unknown
    problems: generateGenericProblems().slice(0, 5),
  },
  {
    id: "sheet-4",
    name: "07. Sheet #4 (Strings)",
    contestId: "219856",
    problems: generateGenericProblems(),
  },
  {
    id: "sheet-5",
    name: "08. Sheet #5 (Functions)",
    contestId: "219920",
    problems: generateGenericProblems(),
  },
  {
    id: "sheet-6",
    name: "09. Sheet #6 (Math - Geometry)",
    contestId: "223339", // Example, change as needed
    problems: generateGenericProblems(),
  },
  {
    id: "sheet-7",
    name: "10. Sheet #7 (Recursion)",
    contestId: "223339",
    problems: generateGenericProblems(),
  },
  {
    id: "sheet-8",
    name: "11. Sheet #8 (General easy)",
    contestId: "223339",
    problems: generateGenericProblems(),
  },
  {
    id: "sheet-9",
    name: "12. Sheet #9 (General medium)",
    contestId: "223339",
    problems: generateGenericProblems(),
  },
  {
    id: "sheet-10",
    name: "13. Sheet #10 (General Hard)",
    contestId: "223339",
    problems: generateGenericProblems(),
  },
];
