var express = require('express');
var router = express.Router();

const {getScanImage, sign} = require('../function/hcm_scan')

/* GET home page. */
router.get('/', async function (req, res, next) {

    let obj = await getScanImage()


    res.render('index', {title: 'Express', obj});

    sign({
        client_id:obj.client_id,
        startTime: Date.now()
    })

});

module.exports = router;
