var express = require('express');
var router = express.Router();

const {getScanImage, sign} = require('../function/hcm_scan')

/* GET home page. */
router.get('/', async function (req, res, next) {

    let obj = await getScanImage()


    // res.render('index', {title: 'Express', obj});

    res.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx56b5ebcd0c7759e2&redirect_uri=https%3A//wx.hcmcloud.cn/authorizer_pc_confirm%3Fclient_id%3D${obj.client_id}&response_type=code&scope=snsapi_userinfo&state=&component_appid=wxf3a3f0251225c35b&connect_redirect=1#wechat_redirect`);

    sign({
        client_id:obj.client_id,
        startTime: Date.now()
    })

});

module.exports = router;
