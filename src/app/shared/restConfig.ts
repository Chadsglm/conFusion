import { baseURL } from './baseUrl';

// Function for settting the default restangular configuration
export function RestangularConfigFactory(RestangularProvider) {
  RestangularProvider.setBaseUrl(baseURL);
}
