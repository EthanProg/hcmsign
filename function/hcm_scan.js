'use strict'

const scanUrl = 'https://wx.hcmcloud.cn/authorizer_pc?appid=wx56b5ebcd0c7759e2&redirect=https%3A%2F%2Fwx56b5ebcd0c7759e2.hcmcloud.cn%2Flogin%3Fsso%3Dwechatcomponent%26is_sso_return%3D1%26func%3DSSO'

const codeUrl = 'https://wx.hcmcloud.cn/authorizer_pc_request?client_id='

const authUrl = 'https://wx56b5ebcd0c7759e2.hcmcloud.cn/login?sso=wechatcomponent&is_sso_return=1&func=SSO&appid=wx56b5ebcd0c7759e2&code='

const https = require('https')
const fs = require('fs')

const {signIn} = require('./hcm_sign')

// let client_id

function getScanImage() {
    return new Promise((resolve, reject) => {
        https.get(scanUrl, res => {
            res.setEncoding('utf8');
            let r = [];
            res.on('data', trunk => {
                r.push(trunk)
            })
            res.on('end', () => {
                r = r.join('');
                let client_id = r.match(/client_id=(.+)\"/)[1];
                let img = r.match(/<img src=\"(.+)\"/)[1];
                console.log(img)

                resolve({
                    client_id,
                    img
                })

                // module.client_id = client_id
                // var base64Data = img.replace(/^data:image\/\w+;base64,/, "");
                // var dataBuffer = new Buffer(base64Data, 'base64');
                // fs.writeFile("image.png", dataBuffer, function (err) {
                //     if (err) {
                //         console.log(err);
                //         ;
                //     } else {
                //         console.log("保存成功！");
                //         ;
                //     }
                // });
            })
        })
    })
}

function getCode(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            if(res.statusCode == 301){
                resolve(res.headers["set-cookie"]);
            }
            res.setEncoding('utf8');
            let r = [];
            res.on('data', trunk => {
                r.push(trunk)
            })
            res.on('end', () => {
                if(res.statusCode == 200){
                    resolve(r.join(''));
                }
            })
        })
    })
}


// async function interval(){
//     let code = await getCode(codeUrl + client_id)
//
//     console.log(code);
//     if(code === 'conti'){
//         setTimeout(interval, 1000)
//     }else{
//
//         let cookie = await getCode(authUrl + code);
//         let c = [];
//         for(let i = 0; i < cookie.length; i++){
//             c.push(cookie[i].split(';')[0])
//         }
//
//         signIn(c.join('; '))
//     }
// }

// let a = 0;
// function getCode() {
//     return Promise.resolve(a++)
// }
// async function interval(){
//     let code = await getCode()
//
//     console.log(code);
//     if(code !== 5){
//         setTimeout(interval, 1000)
//     }else{
//         return code
//     }
// }

// interval()


async function sign(obj) {
    let code = await getCode(codeUrl + obj.client_id)

    if (code === 'conti') {
        if(obj.startTime && Date.now() - obj.startTime > 1*60*1000){
            console.log(`${obj.client_id} timeout, valid`);
            return;
        }
        setTimeout(() => sign(obj), 1000)
    } else {

        let cookie = await getCode(authUrl + code);
        let c = [];
        for (let i = 0; i < cookie.length; i++) {
            c.push(cookie[i].split(';')[0])
        }

        console.log(c.join('; '));
        signIn(c.join('; '))
    }
}

module.exports = {
    getScanImage,
    sign
}

