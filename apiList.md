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

<!-- Notes -->

/users/me/feed?page=1&limit=10 => .skip(0).limit(10) => 1 to 10
/users/me/feed?page=2&limit=10 => .skip(10).limit(10) => 11 to 20
/users/me/feed?page=3&limit=10 => .skip(20).limit(10) => 21 to 30

logic for skip = (page - 1) \* limit
