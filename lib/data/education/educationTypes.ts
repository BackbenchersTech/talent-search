export type Education = {
  id: string;
  candidateId: string;
  school?: string;
  degree: 'BACHELORS' | 'MASTERS';
  fieldOfStudy?: string;
  orderIndex: number;
  createdAt: Date;
};

export const DEGREE_LABELS: Record<Education['degree'], string> = {
  BACHELORS: "Bachelor's",
  MASTERS: "Master's",
};
