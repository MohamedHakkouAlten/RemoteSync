export interface Client {
  clientId: string;
  label: string;
  address?: string;
  email?: string;
  name?: string;
  sector?: string;
  deleted?: boolean;
  ice?: string;
}
