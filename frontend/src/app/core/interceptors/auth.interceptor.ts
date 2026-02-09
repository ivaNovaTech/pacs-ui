import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Grab the token from where you stored it (usually localStorage)
  const token = localStorage.getItem('token'); 

  // 2. Debug: Log to see if the interceptor is actually running
  console.log('Interceptor running for URL:', req.url);
  console.log('Token found:', token ? 'Yes' : 'No');

  // 3. If token exists, clone the request and add the header
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // 4. If no token, just pass the original request through
  return next(req);
};