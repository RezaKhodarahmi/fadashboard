import BASE_URL from '../api/BASE_URL'

export default {
  meEndpoint: `${BASE_URL}/auth/refresh`,
  loginEndpoint: `${BASE_URL}/auth/login`,

  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken'
}
