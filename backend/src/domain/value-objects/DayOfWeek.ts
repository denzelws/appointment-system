export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const DayOfWeek = {
  isValid(day: number): day is DayOfWeek {
    return day >= 0 && day <= 6 && Number.isInteger(day);
  },

  getLabel(day: DayOfWeek): string {
    const labels: Record<DayOfWeek, string> = {
      0: "Domingo",
      1: "Segunda-feira",
      2: "Terça-feira",
      3: "Quarta-feira",
      4: "Quinta-feira",
      5: "Sexta-feira",
      6: "Sábado",
    };
    return labels[day];
  },
} as const;
