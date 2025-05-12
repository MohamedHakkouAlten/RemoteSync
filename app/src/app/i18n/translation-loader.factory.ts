import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  // Use the public folder path for the translation files
  // This path is specified in the angular.json assets configuration
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}
