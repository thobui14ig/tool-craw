const { HttpsProxyAgent } = require("https-proxy-agent");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

function getHttpAgent(proxy) {
    const proxyArr = proxy?.proxyAddress.split(':')
    const agent = `http://${proxyArr[2]}:${proxyArr[3]}@${proxyArr[0]}:${proxyArr[1]}`
    const httpsAgent = new HttpsProxyAgent(agent);

    return httpsAgent;
}

const getHeaderComment = () => {
  return {
    authority: 'www.facebook.com',
    method: 'POST',
    path: '/api/graphql/',
    scheme: 'https',
    accept: '*/*',
    'accept-language':
      'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
    'content-type': 'application/x-www-form-urlencoded',
    dpr: '1.25',
    cookie:
      'dpr=1.25; sb=VEdzZ-YVx2zM4XwojJTWKbIc; datr=VEdzZyiQElyyh9HuzjaD5FQL; wd=816x722',
    origin: "https://www.facebook.com",
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    'viewport-width': '982',
    'x-asbd-id': '129477',
    'x-fb-friendly-name': 'CommentListComponentsRootQuery',
    'x-fb-lsd': 'AVqpeqKFLLc',
  };
};

const getBodyComment = (postId) => {
  return {
    av: '0',
    __aaid: '0',
    __user: '0',
    __a: '1',
    __req: 'h',
    dpr: '1',
    __ccg: 'GOOD',
    __rev: '1019099659',
    __s: 'nvbf2u:n9bd15:vnouit',
    __hsi: '7454361444484971104',
    __dyn:
      '7xeUmwlEnwn8yEqxemh0no6u5U4e1Nxt3odEc8co2qwJyE24wJwpUe8hw2nVE4W0te1Rw8G11wBz83WwgEcEhwnU2lwv89k2C1Fwc60D85m1mzXw8W58jwGzE2ZwJK14xm3y1lU5O0Gpo8o1mpEbUGdwda3e0Lo4q58jwTwNwLwFg2Xwkoqwqo4eE7W1iwo8uwjUy2-2K0UE',
    __csr:
      'glgLblEoxcJiT9dmdiqkBaFcCKmWEKHCJ4LryoG9KXx6V4VECaG4998yuimayo-49rDz4fyKcyEsxCFohheVoogOt1aVo-5-iVKAh4yV9bzEC4E8FaUcUSi4UgzEnw7Kw1Gp5xu7AQKQ0-o4N07QU2Lw0TDwfu04MU1Gaw4Cw6CxiewcG0jqE2IByE1WU0DK06f8F31E03jTwno1MS042pA2S0Zxaxu0B80x6awnEx0lU3AwzxG3u0Ro1YE1Eo-32ow34wCw9608vwVo19k059U0LR08MNu8kc05lCabxG0UUjBwaadBweq0y8kwdh0kS0gq2-0Dokw1Te0O9o1rsMS1GKl1MM0JSeCa014aw389o1pOwr8dU0Pu0Cix60gR04YweK1raqagS0UA08_o1bFjj0fS42weG0iC0dwwvUuyJ05pw4Goog1680iow2a8',
    __comet_req: '15',
    lsd: 'AVqpeqKFLLc',
    jazoest: '2929',
    __spin_r: '1019099659',
    __spin_b: 'trunk',
    __spin_t: '1735603773',
    fb_api_caller_class: 'RelayModern',
    fb_api_req_friendly_name: 'CommentListComponentsRootQuery',
    variables: `{
        "commentsIntentToken": "RECENT_ACTIVITY_INTENT_V1",
        "feedLocation": "PERMALINK",
        "feedbackSource": 2,
        "focusCommentID": null,
        "scale": 1,
        "useDefaultActor": false,
        "id": "${postId}",
        "__relay_internal__pv__IsWorkUserrelayprovider": false
      }`,
    server_timestamps: 'true',
    doc_id: '9051058151623566',
  };
};


function decodeCommentId(encodedStr) {
    try {
        const decoded = Buffer.from(encodedStr, 'base64').toString('utf-8');

        const match = decoded.match(/^comment:.*_(\d+)$/);

        if (match && match[1]) {
            return match[1];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Lỗi giải mã comment ID:', error.message);
        return null;
    }
}


function normalizePhoneNumber(text) {
    const match = text.match(/o\d{3}[.\s]?\d{4}[.\s]?\d{2}/i);
    if (match) {
        return match[0]
            .replace(/^o/i, '0')
            .replace(/[.\s]/g, '');
    }
    return null;
}

function extractPhoneNumber(text) {
    // Ưu tiên bắt theo pattern dạng `o123 4567 89` trước
    const normalized = normalizePhoneNumber(text);
    if (normalized) return normalized;

    // Sau đó mới dùng backup: loại bỏ ký tự và tìm theo đầu số
    let cleanedText = text.replace(/o/gi, '0');
    cleanedText = cleanedText.replace(/[^0-9]/g, '');

    const validNetworkCodes = [
        '099', '098', '097', '096', '095', '094', '093', '092', '091', '090',
        '089', '088', '087', '086', '085', '083', '082',
        '081', '080', '079', '078', '077', '076', '075', '074',
        '073', '072', '071', '070', '069', '068', '067', '066',
        '065', '064', '063', '062', '061', '060',
        '059', '058', '057', '056', '055', '054', '053', '052', '051', '050',
        '039', '038', '037', '036', '035', '034', '033', '032', '031', '030'
    ];

    for (const code of validNetworkCodes) {
        const index = cleanedText.indexOf(code);
        if (index !== -1) {
            const phoneNumber = cleanedText.slice(index, index + 10);
            if (phoneNumber.length === 10) {
                return phoneNumber;
            }
        }
    }

    return null;
}

const handleDataComment = (response) => {
    const comment =
        response?.data?.data?.node?.comment_rendering_instance_for_feed_location
            ?.comments.edges?.[0]?.node;
    if (!comment) return null
    const commentId = decodeCommentId(comment?.id) ?? comment?.id

    const commentMessage =
        comment?.preferred_body && comment?.preferred_body?.text
            ? comment?.preferred_body?.text
            : 'Sticker';

    const phoneNumber = extractPhoneNumber(commentMessage);
    const userNameComment = comment?.author?.name;
    const commentCreatedAt = dayjs(comment?.created_time * 1000).utc().format('YYYY-MM-DD HH:mm:ss');
    const serialized = comment?.discoverable_identity_badges_web?.[0]?.serialized;
    let userIdComment = serialized ? JSON.parse(serialized).actor_id : comment?.author.id
    const totalCount = response?.data?.data?.node?.comment_rendering_instance_for_feed_location?.comments?.total_count
    const totalLike = response?.data?.data?.node?.comment_rendering_instance_for_feed_location?.comments?.count
    userIdComment = userIdComment

    return {
        commentId,
        userNameComment,
        commentMessage,
        phoneNumber,
        userIdComment,
        commentCreatedAt,
        totalCount,
        totalLike
    };
}

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    getHttpAgent,
    getHeaderComment,
    getBodyComment,
    handleDataComment,
    delay
}