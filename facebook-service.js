const { default: axios } = require("axios");
const { getProxyActive } = require("./http-request");
const { getHeaderComment, getBodyComment, getHttpAgent, handleDataComment } = require("./utils");

async function getCommentPublic(link) {
    const postIdString = `feedback:${link.post_id_v1}`;
    const encodedPostId = Buffer.from(postIdString, 'utf-8').toString('base64');
    const proxy = await getProxyActive()
    const headers = getHeaderComment();
    const body = getBodyComment(encodedPostId);
    const httpsAgent = getHttpAgent(proxy)

    const resRe = await axios.post(`https://www.facebook.com/api/graphql`, body, {
        headers,
        httpsAgent
    })

    const comment = handleDataComment(resRe)
    if(link.post_id_v1 === "122096306474859230") console.log("🚀 ~ getCommentPublic ~ res:", comment)
    return comment
}

module.exports = {
    getCommentPublic
}