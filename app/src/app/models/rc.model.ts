/**
 * Response wrapper for API responses
 */
export interface ResponseWrapperDto<T> {
  data: T;
  message: string;
  success: boolean;
}

/**
 * Project dropdown data transfer object
 */
export interface ProjectDropDownDTO {
  id: string;
  name: string;
}

/**
 * RC Associate data transfer object
 */
export interface RcAssociateDTO {
  id: string;
  name: string;
  email?: string;
  role?: string;
}

/**
 * Search criteria for RC associates
 */
export interface RcSearchAssociateDTO {
  fullName?: string;
  email?: string;
  role?: string;
}
