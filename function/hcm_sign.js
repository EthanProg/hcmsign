
const https = require('https');

const md5 = require('crypto').createHash("md5");

const body = {
    latitude:"36.662501898872",
    longitude:"117.129300401476",
    accuracy:33,
    timestamp: Date.now(),
    hash:"cb48994b256facf63e9366902adb0a67"
}
const n = 'hcm cloud'

body.hash = require('crypto').createHash("md5")
    .update([body.latitude, body.longitude, body.accuracy, body.timestamp, n].join(''))
    .digest('hex')


//https://wx56b5ebcd0c7759e2.hcmcloud.cn/api/attend.signin.geocheck
const options = {
    host: 'wx56b5ebcd0c7759e2.hcmcloud.cn',
    path: '/api/attend.signin.geocheck',
    method: 'POST',
    headers: {
        'Origin': 'https://wx56b5ebcd0c7759e2.hcmcloud.cn',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
        'Content-Type': 'application/json;charset=UTF-8',
        'Referer': 'https://wx56b5ebcd0c7759e2.hcmcloud.cn/',
        'Cookie': 'token="2|1:0|10:1516438930|5:token|56:ZGE1YjVjMTBhOTkxOTBkOWM3ZjkxMTk4MGI5YWMyZDM5NTczMDdiMg==|785c98336bb14abcd5b962ecaca30a99661882ed01fbd4806bfdd96fcb0b2bdd"',
        'Content-Length': Buffer.byteLength(JSON.stringify(body))
    },
    rejectUnauthorized: false,
};


const sign = {
    location_id:4573,
    type:3,
    latitude:"36.662330",
    longitude:"117.129321",
    beacon:"",
    information:"{\"source\":\"browser\",\"accuracy\":33}",
    timestamp:1516424332136,
    state:2,
    hash:"6f840eb6a3cfa155c1bbbd9fe5929185"
}

function httpPost(body, op) {

    // console.log(options);
    console.log(typeof body === 'object' ? JSON.stringify(body): body);
    return new Promise( (resolve, reject) => {
        https.request(op || options, (res) => {

            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);


            if(res.statusCode == 301){
                resolve(res.headers["set-cookie"][0].split(';')[0]);
            }
            res.setEncoding('utf8');
            let r = [];
            res.on('data', trunk => {
                r.push(trunk)
            })
            res.on('end', () => {
                if(res.statusCode == 200)
                    resolve(JSON.parse(r.join('')));
            })
        }).write(typeof body === 'object' ? JSON.stringify(body): body)
    })
}

async function signIn(cookie) {

    if(cookie){
        Object.assign(options,{
            headers: Object.assign(options.headers,{
                'Cookie': cookie
            })
        })
    }

    console.log("signIn")
    let check = await httpPost(body);


    console.log(check);

    sign.timestamp = check.result.timestamp;

    sign.hash = require('crypto').createHash('md5')
        .update([sign.location_id, sign.type, sign.latitude, sign.longitude, sign.beacon, sign.timestamp, n].join(''))
        .digest('hex')


    Object.assign(options,{
        path: '/api/attend.signin.create',
        headers: Object.assign(options.headers,{
            'Content-Length': Buffer.byteLength(JSON.stringify(sign))
        })

    })

    // console.log(option);
    // console.log(options);
    // console.log(Buffer.byteLength(JSON.stringify(sign)));

    let s = await httpPost(sign);

    console.log(s);

}


// async function hcmLogin(user, pass) {
//     let body = `mobile=${user}&password=${pass}`
//     const op = JSON.parse(JSON.stringify(options))
//     Object.assign(op,{
//         path: '/login',
//         headers: Object.assign(options.headers,{
//             'Content-Type':'application/x-www-form-urlencoded',
//             'Content-Length': Buffer.byteLength(body)
//         })
//     })
//
//     let cookie = await httpPost(body, op);
//
//     Object.assign(options,{
//         headers: Object.assign(options.headers,{
//             'Cookie': cookie
//         })
//     })
//
//     // console.log(options);
//     return 1
// }

module.exports = {
    signIn,
}
// hcmLogin("18678868693","123456").then( (t) => {
//     console.log(t);
//     signIn()
// })



