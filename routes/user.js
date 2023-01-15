const express = require('express')

const router = express.Router()
const user_handler = require('../router_handler/user')
const cors = require('cors')



router.get('/Search',user_handler.Search)

router.get("/callback", user_handler.callback);

router.get("/login", user_handler.login);

router.get("/revoke",user_handler.revoke);

router.get("/tweetswith", user_handler.tweetsWithPoll);

router.get("/tweetswithout", user_handler.tweetsWithoutPoll);




module.exports = router