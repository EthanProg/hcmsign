
const https = require('https');

const md5 = require('crypto').createHash("md5");

const body = {
    latitude:"36.662501898872",
    longitude:"117.129300401476",
    accuracy:33,
    // timestamp: Date.now(),
    // hash:"cb48994b256facf63e9366902adb0a67"
}
const n = 'hcm cloud'

// body.hash = require('crypto').createHash("md5")
//     .update([body.latitude, body.longitude, body.accuracy, body.timestamp, n].join(''))
//     .digest('hex')


//https://wx56b5ebcd0c7759e2.hcmcloud.cn/api/attend.signin.geocheck
const options = {
    host: 'wx56b5ebcd0c7759e2.hcmcloud.cn',
    // path: '/api/attend.signin.geocheck',
    method: 'POST',
    timeout: 15000,
    headers: {
        'Origin': 'https://wx56b5ebcd0c7759e2.hcmcloud.cn',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
        'Content-Type': 'application/json;charset=UTF-8',
        'Referer': 'https://wx56b5ebcd0c7759e2.hcmcloud.cn/',
        // 'Content-Length': Buffer.byteLength(JSON.stringify(body))
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
    // timestamp:1516424332136,
    state:2,
    // hash:"6f840eb6a3cfa155c1bbbd9fe5929185"
}

function httpPost(body, op) {

    // console.log(options);
    // console.log(typeof body === 'object' ? JSON.stringify(body): body);
    return new Promise( (resolve, reject) => {
        const req = https.request(op || options, (res) => {

            console.log(`STATUS: ${res.statusCode}`);
            // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);


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
                else{
                    console.log(JSON.parse(r.join('')));
                    reject(JSON.parse(r.join('')))
                }
            })
        })

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        })
        req.write(typeof body === 'object' ? JSON.stringify(body): body)
        req.end()
    })
}

async function signIn(cookie) {

    let b = JSON.parse(JSON.stringify(body))

    b.timestamp = Date.now()
    b.hash = require('crypto').createHash("md5")
        .update([b.latitude, b.longitude, b.accuracy, b.timestamp, n].join(''))
        .digest('hex')

    let op = Object.assign( JSON.parse(JSON.stringify(options)),{
        path: '/api/attend.signin.geocheck',
        headers: Object.assign(JSON.parse(JSON.stringify(options.headers)),{
            'Cookie': cookie,
            'Content-Length': Buffer.byteLength(JSON.stringify(b))
        })
    })

    let check = await httpPost(b, op);

    console.log(check);

    b = JSON.parse(JSON.stringify(sign))

    b.timestamp = check.result.timestamp

    b.hash = require('crypto').createHash("md5")
        .update([b.location_id, b.type, b.latitude, b.longitude, b.beacon, b.timestamp, n].join(''))
        .digest('hex')


    op = Object.assign( JSON.parse(JSON.stringify(options)),{
        path: '/api/attend.signin.create',
        headers: Object.assign(JSON.parse(JSON.stringify(options.headers)),{
            'Cookie': cookie,
            'Content-Length': Buffer.byteLength(JSON.stringify(b))
        })
    })

    let s = await httpPost(b, op);

    console.log(s);
    try {
        if(s.result.success === true)
            return ' sign ok'
    }catch(e){

    }
    return ' sign error'

}


module.exports = {
    signIn,
}



