# Dev Tinder Api

### authRouter // done

- POST /auth/signup
- POST /auth/login
- POST /auth/logout

### connectionRequestRouter //done

- POST /requests/:toUserId/interested
- POST /requests/:toUserId/ignored

- PUT /requests/:requestId/accepted
- PUT /requests/:requestId/rejected

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
