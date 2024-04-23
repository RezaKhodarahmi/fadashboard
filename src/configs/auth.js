import BASE_URL from '../api/BASE_URL'

export default {
<<<<<<< HEAD
  meEndpoint: `${BASE_URL}/auth/refresh`,
  loginEndpoint: `${BASE_URL}/auth/login`,
=======
  // meEndpoint: 'http://localhost:3200/api/v1/auth/refresh',

  // loginEndpoint: 'http://localhost:3200/api/v1/auth/login',

  meEndpoint: 'https://fanavaran.ca:3200/api/v1/auth/refresh',
  loginEndpoint: 'https://fanavaran.ca:3200/api/v1/auth/login',
>>>>>>> 365402a5586a7c4b5c2d5f2024768b66064672aa

  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken'
}
