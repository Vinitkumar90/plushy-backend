## profileRouter
- GET/profie/view
- PATCH/profile/edit
- PATCH/profile/password //forget password api

## connectionRequestRouter
- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

## userRouter
- GET /user/requests/received
- GET /user/connections
- GET /user/feed - get you the profiel of other users on platform

Status: while swipping -> [ignored , interested]   judgement of request ->  [accepted , rejected ]


/feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10)
/feed?page=2?limit=10 => 11-20 => .skip(10) & .limit(10)
/feed?page=3?limit=10 => 21-30 => .skip(20) & .limit(10)
/feed?page=4?limit=10 => 31-40 => .skip(30) & .limit(10)

//skip for page=1 => page-1*limit = 1- 1 * 10 = 0 ...so skip first 0 documents
//skip for page=2 => 2-1*10 = 10 ...so skip first 10 documents