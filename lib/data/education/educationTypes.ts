export type Education = {
  id: string;
  candidateId: string;
  school?: string;
  degree: 'BACHELORS' | 'MASTERS';
  fieldOfStudy?: string;
  orderIndex: number;
  createdAt: Date;
};
