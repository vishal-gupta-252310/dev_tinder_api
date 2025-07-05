# Dev Tinder Api

### authRouter // done

- POST /auth/signup
- POST /auth/login
- POST /auth/logout

### connectionRequestRouter

- POST /requests/:toUserId/interested
- POST /requests/:toUserId/ignored

- POST /requests/:toUserId/accepted
- POST /requests/:toUserId/rejected

### userRouter

- GET /users/me/requests
- GET /users/me/connections
- GET /users/me/feed
- POST /users/:userId/block

### profileRouter // done

- GET /profile
- PATCH /profile
- PUT /profile/password
- PUT /profile/username
