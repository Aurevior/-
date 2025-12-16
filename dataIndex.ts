import { Question } from './types';
import { questions as q1_100 } from './data';
import { questions101_200 } from './data1';
import { questions201_300 } from './data2';
import { questions301_400 } from './data3';
import { questions401_500 } from './data4';
import { questions501_600 } from './data5';
import { questions601_700 } from './data6';

// Import future parts here as they are created
// ...

// Aggregate all questions
export const allQuestions: Question[] = [
  ...q1_100,
  ...questions101_200,
  ...questions201_300,
  ...questions301_400,
  ...questions401_500,
  ...questions501_600,
  ...questions601_700,
];

// Extract unique categories and sources dynamically
export const categories = Array.from(new Set(allQuestions.map(q => q.category)));
export const sources = Array.from(new Set(allQuestions.map(q => q.source)));
