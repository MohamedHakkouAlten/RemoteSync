/**
 * Data Transfer Objects for Response Wrapper
 * These interfaces define the shape of data exchanged with the API using the ResponseWrapper pattern
 */

import { HttpStatusCode } from '@angular/common/http';
import { RCReport } from '../models/report.model';
import { UserRotation } from '../models/rotation.model';

export interface PagedData {
 
  currentPage: number
  pageSize :number

  totalElements :number

  totalPages :number

}
export interface PagedRotation extends PagedData {
 
  assignedRotations :UserRotation[]


}
export interface PagedReports extends PagedData{
 
  reports :RCReport[]


}

// Base response wrapper interface
export interface ResponseWrapperDto<T> {
  status: 'success' | 'error' | 'warning' | 'info' | 'status';
  code: HttpStatusCode;
  data?: T;
  message?: string;
  errors?: ValidationErrorDto[];
  timestamp?: string;
  triggeredBy?: string;
}

// Validation error interface
export interface ValidationErrorDto {
  field: string;
  message: string;
}

// Success response wrapper
export interface SuccessResponseDto<T> extends ResponseWrapperDto<T> {
  status: 'success';
  data: T;
}

// Error response wrapper
export interface ErrorResponseDto extends ResponseWrapperDto<never> {
  status: 'error';
  message: string;
}

// Warning response wrapper
export interface WarningResponseDto extends ResponseWrapperDto<never> {
  status: 'warning';
  message: string;
}

// Info response wrapper
export interface InfoResponseDto extends ResponseWrapperDto<never> {
  status: 'info';
  message: string;
}

// Status response wrapper
export interface StatusResponseDto extends ResponseWrapperDto<never> {
  status: 'status';
  message: string;
}
