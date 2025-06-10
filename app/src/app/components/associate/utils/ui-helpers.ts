import { ProjectStatus } from '../../../dto/project-status.enum';
import { ProjectDTO } from '../../../dto/aio/project.dto';

/**
 * UI helper functions for associate components
 * Contains reusable methods for UI-related operations
 */
export class AssociateUIHelpers {
  /**
   * Returns the color for the progress bar based on project status
   */
  static getProgressBarColor(status?: ProjectStatus): string {
    if (!status) return '#6c757d'; // gray default

    // Check for status values
    switch (status) {
      case ProjectStatus.COMPLETED:
        return '#28a745'; // green
      case ProjectStatus.CANCELLED:
      case ProjectStatus.INACTIVE:
        return '#6c757d'; // gray
      case ProjectStatus.ACTIVE:
        return '#FF8C00'; // orange
      default:
        return '#FF8C00'; // default fallback for unknown status
    }
  }

  /**
   * Returns the severity class for PrimeNG badges based on project status
   */
  static getStatusSeverity(status?: ProjectStatus): string {
    if (!status) return 'info';

    switch (status) {
      case ProjectStatus.COMPLETED:
        return 'success';
      case ProjectStatus.ACTIVE:
        return 'info';
      case ProjectStatus.CANCELLED:
        return 'danger';
      case ProjectStatus.INACTIVE:
        return 'secondary';
      default:
        return 'info';
    }
  }

  /**
   * Returns a CSS class based on the business sector
   */
  static getSectorClass(sector?: string): string {
    if (!sector) return 'retail'; // default

    const lowerSector = sector.toLowerCase();
    if (lowerSector.includes('retail')) return 'retail';
    if (lowerSector.includes('tour') || lowerSector.includes('hotel') || lowerSector.includes('travel')) return 'tourism';
    if (lowerSector.includes('manufact') || lowerSector.includes('industr')) return 'manufacturing';

    return 'retail'; // default fallback
  }

  /**
   * Formats a date range for display
   */
  static formatDateRange(startDate?: string, endDate?: string): string {
    if (!startDate) return 'No date';

    const start = new Date(startDate);
    const formattedStart = start.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    if (!endDate) return `From ${formattedStart}`;

    const end = new Date(endDate);
    const formattedEnd = end.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return `${formattedStart} - ${formattedEnd}`;
  }
}
