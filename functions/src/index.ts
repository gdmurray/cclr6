import * as functions from 'firebase-functions'
import * as crypto from 'crypto'

const algorithm = 'aes-256-ctr'
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
import { google } from 'googleapis'

interface Hash {
    iv: string;
    content: string;
}


function getDecrypted(): string {
    const hash = {
        iv: functions.config().google.iv,
        content: '0522a3e89e1d98edc87518f7bf407f86af40c48662805823b4b8cde37dfb505f11ef748a65095efe199a0a84de896e584be0ab20ad16ac39f8d93fb83ffc3fe680001a1e23f27950e925598c1ccf176f69d48cb90ee29864a229d4ef680bf3872226e49a9c7ea51d8fc226013e8666d3820778fd9f8a9055fde7c836fd14fcc8022af9f9d795321a883c5589701a13bfb759e59842e286c5a14bcd3bfe2b9002c0395734ac0948b3a285f0f62bcaee7678b52b60c615492bfef3f648d0df8440ecb151e6494a8d17ecf224f45708738717f345aa88d73371b1ca771f0fefb3a29a5c8c56829b2427f88139dfce5da88e8ec2b4cf2202449e25b292aaa58c63cdf7dbac7eb16fb9651c64f95e612c50d10f33e3995742d79bc06a7bfda449836a21184609a2ec446c79b438943c8071fe104e507bb2ca872a354a3b75c31e8f265ec59de997e9b0d40db7bb1692e78b08ab80eb23987c1a226efe5d9d7723a88c17bc0d94f45cad4bf23a350b888454e86e69e22faf781591573c431e2ed3b7f6ff4f321aea2dcf8b41bf3d4b1324f34b8c946298bb629fa11f8414b466c92bfdab73e036dc5905649870844bc6a64814370b5744db0b11dc0b16f1ca7f5086bcacc4f7a2855fa91f3b7993fbc76206020c5e12dc514de17341fd31cc50db80df11fbf2881c0cf306f4d654ecc315c73b7e68223066c6fda0e2854276b60c2aa0480e34c94c4e64f5b56e8acce95208145ba441be473aeec3a320f1cd0a57d27cca432a1eb85351ea799b2c89dcf9b6b3bc3d8b75d73c6a4ebdd5ea0714e5bbd8484c4ec62bf179b8d8ed36d7b2a12b6109b0b4f1f1de04e8f7c9658bd8f010c8e965d9e698fa85ecdaae0ed035b39456e7e00c55f14afa7dfe1e0fb7fb21249beacc596786f501844542236a20bd3b0d13fd4c44acf513ea5286bc55e6bfd2959f54977af13efee4f5aa77925de9bf4225ce1c965131936f357e157804f53bccd0b391f61a7b77fca2cdd639800cf9a275278296ee87c49fdacf29f08438917a3eab2246046a2613c1344cb23bc6ca951dbb651cb0492195984d71fd6ae1c65d7a6ae7e59d9ba9d6a4718ae0fb8286079f35bc18d6fe962174c2b4e32e10ffeb1e23465e83c265cd95f9de8b5c8f14d79e7a99974680dfc5b3562a20c1f347f27aa1929ad85dfaa6589637c535f200ce24e8cec894eaf38517000ed41db62dd78b0518abeb67f4ca9a9f6f6bf2252b38152d1e3573c0235166255f3c72fec4fb65d395ae9b7a2650febdc75d0c1258dee88f640be408634935078b03a80b427516b79cf620788a707cf235c4d4c77ce24e3b95309e53776513fae7f7f0bccca8cf0048578fc9527aa0702762b3a8746164556a6f9a8765582742b4ffb82ad590a09e8d30e8c1bab047ac225dce4dd82a32547daa7298d202d9fdf998fd18d5ae6a64cfd903e6656229a01b335dcd419f977360b29dde74f70f742ca8c270009126567ee5da46ff84ad8cb87d70edef1752dfced6091635a943f101c19a563bd323dbda1df9fbce00e4c0ddad1033877213b21ea0d1a3d9b67e2869e4560876dae9ac302f9afecce4d8684103b45e6ad56f62e1bca899ca04961d09c80dedde2b5d7d8b36abb53817714a75e6faf319c9196860e51813a26305edd2dd09571bed286968c4560237722179e52f2cd359a357c6d55b4400f5c7a4162b51417d3b53838ecd38fe6204c8dea404a804990b78cb2ac58f8e8716eef0819edee978ead77fb8275af8f08196afbdec050ab372829731a53816e1b21365f76e584979d017966e7c90b00c5efd8f9b2f984c2b850e1d60943360348b3efed2bf9e4491ccc3600018e29d87c050e65b29619053613dd84b722a068f1bbe6d8f0fd4ec15a220b1aeb8a5fa442a9bca4a81ee34145359eaa783baa95330a721759603bb5a47ee071143f9a6306e45cb4e831edc65c707ac28a007a7996e332002682ac32419c0ff3324d8946040058f40cd5c27a5e8dfb5d9d19f02d215b7281c1248e2c139fa5bfaaa201f07538b392e65b03e0bc25e84cc301659c3b7d61460010c432eae78eea2ca8c95dacaeae980da66929590cec66b3713c4e9388b9948a92e3f932f3ebf94b28e73a27ec28a471fc2df63a2958f33bf8b6ff8708a6ef4dee6799a1f2bcd1bff75f5f8b8a5a80cd6fbb18e283a09fcc317da9fbc680cb85019c216a46473e7d3bc95e7fa3d834a6eb1c3f8a337f500903559ef006ec36fa7f155186eeff730b79bad66fd54fbf51015fe2ea5646a4d0917329702d7015731da6268ca5c2abce2a1a776be62845bceb2e2c0ba43c6aa23d78d86971e0d5d9f340cae1eb4f03c94441fa01fcf96dd4c7196bc035cb041289a4fc29b53c611003529fca071045ebaf04b60d1686ba8f9ec5296ccf0e96f13e4ef6250aaeaaeaa9be87cdae5c19d74b8c8c9f64ac250e8176730f08174b8545eb53968f0d42f7dd51922b362336480b2d9d24f429143daeb7b279ee0170f43e179b655d11282b2ee1a747ea88de40e6cb5f5a122f287ce1668194c35b1c42bd18bfb072732090769878e762d4910962a959dafb9fab4769101c025ed78a0adb739d360b63f23fc0b590c27531ad87d6fa25d740b9aa482374c3efaa6855a06b2b27566e44195d2a32f4264b90a427bbac1e8d1b571a57be8dfd6613900d18642101648d345aebf26a38e0e3149777ca053ac767d36395ecbe07b2940701ea80acb9c7db8f3a32f41a838fe75795f032157bd8a86152975012bb768bc21c8567f526654b10184e1664fb51bd673f8a91f6d9b3fe0d2c666c2bc1b5581c80fd433c6df9287cc80122813c502085e9b85718c01997861f6f53b30e951f6d18735d5dcc9fd0cb4b4ac59f2896875d14e8368957483cbc43522b2dd33d9ef58ac68b963688f868df461cfdcb4d032c3cda5c69b81d4061ef585c72891428b979ad05f38c0920f0fe06dba9334cae86e66d33bac8969fb7e6a582510f8a2adcf0d68758fdedf91a6031155b615f6ef2af335f0dcce2332010ecc087392a550a234e86a53bbf483e4eaa367542eee1ff19002f448c3b1949d6de06625f419c68ec2bdc06b2e8f767a9ebe4e29508e7856954ed165f80d9ff03de5f7e8c5fb0c2e760c2a60b881f68a6fde4000f5909a063521c00cf27504f6b48ae1cb9b84efd40a09c14cbd296630abfc897b0c2cd40d946e66'
    }
    const decrypt = (hash: Hash, secret: string): string => {

        const decipher = crypto.createDecipheriv(algorithm, secret, Buffer.from(hash.iv, 'hex'))

        const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

        return decrypted.toString()
    }

    return decrypt(hash, functions.config().google.secret)


}

export const createNewTeam = functions.database.ref('/teams').onCreate(async data => {
    functions.logger.debug('RECEIVED INVOCATION', data)
    const decrypted =  JSON.parse(getDecrypted())
    const sheetId = '1bPwL9B_0s7VpQzgZqk9mOyXJqOwsJoTRryGt-vW8hgU'
    const changeData = data.val()
    const scopes = ['https://www.googleapis.com/auth/spreadsheets']
    const googleAccount = decrypted
    const jwt = new google.auth.JWT(
        googleAccount.client_email,
        undefined,
        // we need to replace the escaped newline characters
        // https://stackoverflow.com/questions/50299329/node-js-firebase-service-account-private-key-wont-parse
        googleAccount.private_key.replace(/\\n/g, '\n'),
        scopes
    )
    const sheets = google.sheets({ version: 'v4', auth: jwt })
    let values = [
        [JSON.stringify(changeData)]
    ]
    let resource = {
        values
    }

    await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'A2',
        valueInputOption: 'RAW',
        requestBody: resource
    })
    functions.logger.debug('WE HIT HERE')

})
export const copyTeamsToSheet = functions.database.ref('/teams').onUpdate(async change => {
    functions.logger.debug('RECEIVED INVOCATION')
    const decrypted =  JSON.parse(getDecrypted())
    const sheetId = '1bPwL9B_0s7VpQzgZqk9mOyXJqOwsJoTRryGt-vW8hgU'
    const data = change.after.val()
    const scopes = ['https://www.googleapis.com/auth/spreadsheets']
    const googleAccount = decrypted
    const jwt = new google.auth.JWT(
        googleAccount.client_email,
        undefined,
        // we need to replace the escaped newline characters
        // https://stackoverflow.com/questions/50299329/node-js-firebase-service-account-private-key-wont-parse
        googleAccount.private_key.replace(/\\n/g, '\n'),
        scopes
    )
    const sheets = google.sheets({ version: 'v4', auth: jwt })
    let values = [
        [JSON.stringify(data)]
    ]
    let resource = {
        values
    }

    await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'A2',
        valueInputOption: 'RAW',
        requestBody: resource
    })
    functions.logger.debug('WE HIT HERE')
    functions.logger.info(data, { structuredData: true })
})