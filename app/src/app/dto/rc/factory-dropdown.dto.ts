export interface FactoryDropDownDTO {
  factoryId: string;
  label: string; // Used for dropdown display
  factoryName?: string; // Made optional since it's not always used
  value?: string; // Optional value property for PrimeNG components
}
