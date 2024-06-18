export interface User {
  id: string; name: string; email: string;
  role: 'admin'|'manager'|'member';
  createdAt: Date; updatedAt: Date;
}
















