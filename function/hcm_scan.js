

const scanUrl = 'https://wx.hcmcloud.cn/authorizer_pc?appid=wx56b5ebcd0c7759e2&redirect=https%3A%2F%2Fwx56b5ebcd0c7759e2.hcmcloud.cn%2Flogin%3Fsso%3Dwechatcomponent%26is_sso_return%3D1%26func%3DSSO'


const https = require('https')

https.get(scanUrl, res => {
    res.setEncoding('utf8');
    let r = [];
    res.on('data', trunk => {
        r.push(trunk)
    })
    res.on('end', () => {
        // if(res.statusCode == 200)
        //     resolve(JSON.parse(r.join('')));

        r = r.join('');
        let client_id = r.match(/client_id=(.+)\"/)[1];
        let img = r.match(/<img src=\"(.+)\"/)[1];
    })
})

function getCode() {
    let i = setInterval( () => {
        return new Promise((resolve, reject) => {
            https.get(scanUrl, res => {
                res.setEncoding('utf8');
                let r = [];
                res.on('data', trunk => {
                    r.push(trunk)
                })
                res.on('end', () => {
                    if(res.statusCode == 200){

                    }
                    resolve(r.join(''));
                })
            })
        })
    })

}

