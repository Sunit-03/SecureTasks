# Authentication API

## POST /auth/signup

Creates a new user.

### Request Body

{
  "email": "test@test.com",
  "password": "123456"
}

### Response

{
  "user": {},
  "accessToken": "..."
}