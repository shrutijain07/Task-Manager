export interface Task {
    _id?: string;
    title: string;
    description?: string;
    status: 'pending' | 'completed';
    createdAt?: Date;
  }
  