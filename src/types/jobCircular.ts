export interface JobCategory {
  id: string;
  name: string;
  order: number;
  createdAt: string;
}

export interface JobRequirement {
  id: string;
  categoryId: string;
  categoryName: string;
  jobTitle: string;
  vacancy: string;
  salary: string;
  location: string;
  dutyHours: string;
  experience: string;
  ageLimit: string;
  education: string;
  requirements: string[];
  benefits: string[];
  deadline: string;
  description: string;
  status: 'Active' | 'Closed';
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  categoryId: string;
  categoryName: string;
  jobTitle: string;
  fullName: string;
  phone: string;
  email?: string;
  age: string;
  education: string;
  experience: string;
  presentAddress: string;
  nidOrPassport: string;
  notes?: string;
  resumeFileName?: string;
  resumeDataUrl?: string;
  status: 'Pending' | 'Under Review' | 'Shortlisted' | 'Approved' | 'Rejected';
  appliedAt: string;
}
