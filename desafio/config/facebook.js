import 'dotenv/config'

let fb_config = {
    facebookid: process.env.FACEBOOKID,
    facebooksecret: process.env.FACEBOOKSECRET,
    facebook_callback: process.env.FACEBOOK_CALLBACK
}

export { fb_config }
   