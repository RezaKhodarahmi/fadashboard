export default {
  meEndpoint: 'http://localhost:3200/api/v1/auth/refresh',

  loginEndpoint: 'http://localhost:3200/api/v1/auth/login',

  // meEndpoint: 'http://idtech.ca:3200/api/v1/auth/refresh',
  // loginEndpoint: 'http://idtech.ca:3200/api/v1/auth/login',

  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken'
}
