const { Client, auth } =require("twitter-api-sdk") ;

const bearerToken = "AAAAAAAAAAAAAAAAAAAAAOKvNwEAAAAAoWNV8XrBS7KsdCqAZ6GHEkWZXm8%3D0pUlsutplEvsnmu9NQLbSjjvGq1zTs7YFKSxDtQr3bQHitkpN5"

const client = new Client(bearerToken)

const authClient = new auth.OAuth2User({
    client_id: 'cWExWFgtQzFGeUZSMHp2NnVrZHI6MTpjaQ',
    client_secret: 'o9UHNWcXZZU-RChMo8_W3FSYY6Sd2lurIIGvVhGUggdGWqbQJz',
    callback: 'http://127.0.0.1:3000/api/callback',
    scopes: ["tweet.read","tweet.write","users.read"],
});
const clientAuth = new Client(authClient);

const STATE = "my-state";


exports.Search = (req,res) => {
    const data = (req.query)
    const value = eval('data.query')

    var start = undefined
    var end = undefined
    if (data.startdate != undefined) {
        const dates = new Date(data.startdate)
        start = dates.toISOString()
    }
    if (data.enddate != undefined) {
        const dated = new Date(data.enddate)
        end = dated.toISOString()
    }

    const Num = parseInt(data.max_result)


    async function abc() {

        const jsTweets = await client.tweets.tweetsFullarchiveSearch( {
            'query':value,

            'expansions':[
                "geo.place_id",
                "attachments.media_keys"
            ],

            "place.fields":[
                "contained_within",
                "geo"
            ],
            "media.fields":[
                "type",
                "url",
                "alt_text"
            ],
            'start_time': start,
            'end_time': end,
            'max_results': Num
        })
        res.send(jsTweets);
    }
    abc()

}

exports.callback = async (req,res) => {
    try {
        const {code, state} = req.query;
        if (state !== STATE) return res.status(500).send("State isn't matching");
        await authClient.requestAccessToken(code);
        res.redirect("http://127.0.0.1:8080?sondaggio=true");
    } catch (error) {
        console.log(error);
    }
}

exports.login = async (req,res)=>{
    const authUrl = authClient.generateAuthURL({
        state: STATE,
        code_challenge_method: "s256",
    });

    res.redirect(authUrl);
}
exports.revoke = async (req,res)=>{
    try {
        const response = await authClient.revokeAccessToken();
        res.send(response);
    } catch (error) {
        console.log(error);
    }
}
exports.tweetsWithPoll = async (req, res)=>{
    const param = req.query
    const text = eval('param.text')

    const scelte = eval('param.scelte')
    try {
        const response = await clientAuth.tweets.createTweet({
            'text':text,

            'poll': {
                'options': [scelte[0],scelte[1]],
                'duration_minutes': 120,
            },
        });
        res.send(response);
    } catch (error) {
        console.log("tweets error", error);
    }
}
exports.tweetsWithoutPoll = async (req, res)=>{
    const param = req.query
    const text = eval('param.text')
    try {
        const response = await clientAuth.tweets.createTweet({
            'text':text,
        });
        res.send(response);
    } catch (error) {
        console.log("tweets error", error);
    }
}
