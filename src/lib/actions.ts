
'use server';

import type { QuizQuestion } from './types';

type Answers = Record<string, string>;

export async function submitQuiz(answers: Answers, questions: QuizQuestion[]) {
  try {
    let correctCount = 0;
    const results = questions.map((q) => {
      const userAnswer = answers[q.id];
      const correctAnswerOption = q.options.find((o) => o.id === q.correctAnswerId);
      const correctAnswer = correctAnswerOption ? correctAnswerOption.text : '';
      const isCorrect = userAnswer === correctAnswer;
      if (isCorrect) {
        correctCount++;
      }
      return {
        questionId: q.id,
        question: q.question,
        userAnswer: userAnswer,
        correctAnswer: correctAnswer || '',
        isCorrect: isCorrect,
        explanation: q.explanation,
      };
    });

    const overallScore = Math.round((correctCount / questions.length) * 100);

    return {
      success: true,
      results,
      overallScore,
    };
  } catch (error) {
    console.error("Quiz submission failed:", error);
    return { success: false, error: "Failed to process your quiz results." };
  }
}
