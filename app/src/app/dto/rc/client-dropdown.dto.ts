export interface ClientDropDownDTO {
  clientId: string;
  label: string; // Used for dropdown display
  clientName?: string; // Made optional since it's not always used
  value?: string; // Optional value property for PrimeNG components
}
