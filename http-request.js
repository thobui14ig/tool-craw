const axios = require('axios')

async function getProxyActive() {
    const res = await axios.get('http://160.25.232.64:7000/proxy/get-proxy-active')

    return res?.data
}


module.exports = {
    getProxyActive
}