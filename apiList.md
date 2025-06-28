# Dev Tinder Api

### authRouter

- POST /auth/signup
- POST /auth/login
- POST /auth/logout

### connectionRequestRouter

- POST /requests/:userId/interested
- POST /requests/:userId/ignored
- POST /requests/:userId/accepted
- POST /requests/:userId/rejected

### userRouter

- GET /users/me/requests
- GET /users/me/connections
- GET /users/me/feed
- POST /users/:userId/block

### profileRouter

- GET /profile
- PATCH /profile
- PUT /profile/password
- PUT /profile/username
