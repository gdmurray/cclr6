import * as functions from 'firebase-functions'
import * as path from 'path'
import * as crypto from 'crypto'

import { getEmail } from './email/mail'
import * as firebaseAdmin from 'firebase-admin'

const algorithm = 'aes-256-ctr'

function getDecrypted(): string {
    const hash = {
        iv: functions.config().admin.iv,
        content: '7b2ddcc64ac684b61e90f92114fc75f7e3c5d2f65a23a8376d8e6360003ad5a5d52cf1b899493462eb9699b51166c83f6383a68d0ce72919913c9030b584ab63975737e73d7c91a0f3b88ad6df7b2042f392a47d522343ec7189e4841504303970dda18991d903bcd234cd6345d1b2c17593beda06d418f3c36c3d5c6f2daff3f3143706bb022213fc5fa8dfa86e4f60278064fbf46b5c80bae66a3f0cf229d0b60fb99bc4dcef38efc50f9061b67c7fc9f056e0f2b8df855ca263069e34e9403e969d742a1293f8ef26ecba2ae62d01b3aed605c734e644ea89577004d0e3a9c62e58f5e8691f327801227ae3d7834857ef69ff81a068ada13e801bdc01fa8f89c6080fe38c043ebb939b216788463ce78d5a211ef52198e41c05dec505e1fc7bf646e2be172927b82276c859c7864634098a2967e490ab206557ad2866437c7fd1822b22de392efb9abeb2904d40eea60508d94f88108f871f08539eb8a7a819b35d4aee23db16334d86f2caa76d7796760d7a8e43ae339bef6c0f8f626ba9ead9de7c76bd6c4815fb2e989c5245097793cb0d8791d0fac348b35a6d10aa2bd849d2308d4b0501529484695877960bc3fc242856196656685ec81c3a2b47ccf31afbee07dda41b37ecd49539d269e536162b672b158645d256c523d24bdb20cb87e8a46dd7cba65327959c4c82a33f5151d1f83f0c0ab4eebd929087cfc7fe5740bdb883c7ed5c22094d7cb2234512ec21d2fd43b888e755299ab56387e9c4c1b968cefcc219fe1620358caf607f7fc331cba45f064b3d46940be4ae919d388b499e842d581a5b3a88a2201f8ec7c96d5eae32fa3896c9efedcb0851ef8a0d371accee94a1ae8face86097350debf246968c2816b623ebbe06b6b413f824a238bb340d3a35b5c8cac6376e4debf3c000f994379abfe0c29b1343fabcafd8b0ffd5fcd7f7ceb87428e7208c94d96e5e5a5dfb3a343530a06ff5c50d8a4e10303eb8c0ff7b8e7fe59e990d8188f9e2cff618b369262b744ad7368c0b23a75b58c29a1958269d52187d1591dd10ad24cb4f8cf766b90e0d5ae89f67400e9d92b8057bc5751d3dd12973a071e5d35c2a8cec8219ce7034596433c3eab6fb3ec2ad0757791e7a7f5e8c0b5122b932f91bb88f0976214c9f01bfbf6d7a09179478e92aee18c6dde610b82c959d9add9d623cb0c044e593c509433fde10a4c5b47ee4f295bf622fd7fc4c04fd921e0a1a29de8879fd3423eca5e34b47d37561143b74d6362594a338c75458f200d19eb0238e5a3066ffca4872ca130221bfac9e05285dc21bd2d71c2fef066a7c1913364a05ff3bd65a8cfdbcf19aee1bbfb4d9bc1867e1f6cae4b2decabbb05bd0a4059b3ff2d84525e460baf6bb250bcb41ab5a941e3429841190955ea6034fcd07e1988adf03e8c27e741e7a703eb19e7cd32ae481f329a8263fba8f175b4f95945481f7d966aeb25006f5d870586d8c7740ad7b6ca7745b1efca63e4cce8336f0755718094673d46ed262a8412a1cd0ce52b3104927a8f99d98c0cd42686a16b5d41136352a13be3a34963f561278ece86146f63ae6e59939ecc6b516767d5c3b7035057fe5daf75b5e9df10bc7c9a9f7fbf5e74aa5fd16b3553bd738fc7d6a04460540f07b123a8b9949ad50941bb59815d83bdc16be62e04c2f1020f3a1728c477dbf7a3be8cfdcd0f06171061e508841a28d724ef12a11cfd3bd8a770f29814c7757d49f16fa10560c248e6f646a8a526927c0a1e987d449a6e06a86a828f61cfb43498036c8bcc31d6389c536c672433618ea00bdeaf6463b410599e043f81e29a19e22cdbb961cebea9c523099759082a631e0036a4035f2a4be0f5592a3155ff9d128f74ea5db4c458764b07a587972775936512c33552a041e569bbfe32131e2b8f42dfe622a810465175ced0fec861f3cb294b78972c204b7da6f4d58203ef0fd90005607505f65507182f4bf41dd982bc8a61ec0b3e65c2920fc519a7fde546a9e418dab4435a9ad90f7bf790a3a434a95c5fa950f6c138e90a9dac7f563c8473d3b36f5aaf6438a73b877e1593fe1d5f600b24bf1ef11a3ca2a683d23b0b8a6046ced13ce5feb11ea617269cc2410ccc94068b354ff9ba7090fcab673cd4c883c24b6f0fbb5eb02341dd1a27a07a53f745ee9fac53a9e50584427c38e7e46f13e03e54ad9d3ed46eb577d06cc5159f28068252fe037cfded79de6b9827cf1ec43da2ba50b65125993f76eb50416b40a99f18633d1ba06c2a7a9117b65b3cfe315264bda5ddae28eecdaabeb2d82312c8d8a37bc3fe40251e80e2c97d43fc904e279923bc327a142bf37f57da85e96bcaaeedc1084a810f0a531763e4c1768e2dadd886611e958256878232e1aba8d8d7b62a74a2a72a9b5b4fa3942b05f0568fd735e9c3121bb65b2eec29b4a640d2e68356effcd68fc6e9335746abc61059563e49fe5f2d34dbec2ea57b05d3826d26113039a554e2900943e22004f1cb26bce6a9db141a42f6468b792df14c5da30397da24d6acce5867309ae992f3971fe6ab36eda12aed248af1892b042e8def35f5f688c96f6522cb7c381fd044f0e0e503d9f72ebfcde8ca518585c0a0d34c31acc7e1069565c7dc47969e1a98a07a9b4a9949a5669f327a5f5f5e9a35c186f60e68f25735e56d063f2b3ea5d3df5aa742c49447062c43b8bc745f1cd3a98f080858f367d1572fe57dbde878809c83791f2e431e2bd2670dc0ba6fe5a5f02e38a2f91bc21a96472c42622a16e36b6e07d9a2808ca308331737d6c878035771c3e06bdfa003b54771915f6f957ce2af9f1fca7f0601496a3835d6ff16d1209781128909215de96b232ac31f28436837bc1df3c70d0e0ae663a6148bb11e0dcf33d2a7e10a12cb8b8e256477fc4eaf8a60aa95fdf83e8dd86127d9d67542ec834afab4152be33ddc304e0cf2af7608743c7735da3ec79820ffe6bde2a21b7401aad6dc92116c6a8752807f3ad2d1ce764ae1b97f1afc9e451e1b813f3d51520613ad94cf3910c8cece9f957c25de0ace497bf8cf9aa609e19c5d0df8b0edd50f2e397a89bfe1eb1db44d3605937cc107103468605f15d578695c80708ac22dbacf67809b06f617154d54de183d2974009ab05430e2eb4372148b0f2d2077e79c786b6ed90f41c6dfba32731b233022e003042d6fe5542f7ed2f927841b65a0aa2fe29b05a228190604cb209a3b58cd5f39b61c9573e2f78'
    }
    const decrypt = (hash: Hash, secret: string): string => {

        const decipher = crypto.createDecipheriv(algorithm, secret, Buffer.from(hash.iv, 'hex'))

        const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

        return decrypted.toString()
    }

    return decrypt(hash, functions.config().admin.key)
}

const serviceAccount = JSON.parse(getDecrypted())

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key
    })
})

export const sendEmail = functions.https.onRequest(async (req, res) => {
    if (req.method === 'POST') {
        const authToken = req.cookies.token
        const user = await firebaseAdmin.auth().verifyIdToken(authToken)
        if (user) {
            console.log(user)
        } else {
            res.status(403).end()
        }
        const { template, variables, emailAddress } = req.body
        try {
            const email = getEmail()
            email.send({
                template: path.resolve(`src/email/${template}`),
                message: {
                    to: emailAddress
                },
                locals: variables
            })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }

        res.status(200).json({ message: 'Sent' })
    } else {
        res.status(405).end()
    }

})

// https://firebase.google.com/docs/functions/typescript

// import { google } from 'googleapis'

interface Hash {
    iv: string;
    content: string;
}

//
// export const createNewTeam = functions.database.ref('/teams').onCreate(async data => {
//     functions.logger.debug('RECEIVED INVOCATION', data)
//     const decrypted =  JSON.parse(getDecrypted())
//     const sheetId = '1bPwL9B_0s7VpQzgZqk9mOyXJqOwsJoTRryGt-vW8hgU'
//     const changeData = data.val()
//     const scopes = ['https://www.googleapis.com/auth/spreadsheets']
//     const googleAccount = decrypted
//     const jwt = new google.auth.JWT(
//         googleAccount.client_email,
//         undefined,
//         // we need to replace the escaped newline characters
//         // https://stackoverflow.com/questions/50299329/node-js-firebase-service-account-private-key-wont-parse
//         googleAccount.private_key.replace(/\\n/g, '\n'),
//         scopes
//     )
//     const sheets = google.sheets({ version: 'v4', auth: jwt })
//     let values = [
//         [JSON.stringify(changeData)]
//     ]
//     let resource = {
//         values
//     }
//
//     await sheets.spreadsheets.values.append({
//         spreadsheetId: sheetId,
//         range: 'A2',
//         valueInputOption: 'RAW',
//         requestBody: resource
//     })
//     functions.logger.debug('WE HIT HERE')
//
// })
// export const copyTeamsToSheet = functions.database.ref('/teams').onUpdate(async change => {
//     functions.logger.debug('RECEIVED INVOCATION')
//     const decrypted =  JSON.parse(getDecrypted())
//     const sheetId = '1bPwL9B_0s7VpQzgZqk9mOyXJqOwsJoTRryGt-vW8hgU'
//     const data = change.after.val()
//     const scopes = ['https://www.googleapis.com/auth/spreadsheets']
//     const googleAccount = decrypted
//     const jwt = new google.auth.JWT(
//         googleAccount.client_email,
//         undefined,
//         // we need to replace the escaped newline characters
//         // https://stackoverflow.com/questions/50299329/node-js-firebase-service-account-private-key-wont-parse
//         googleAccount.private_key.replace(/\\n/g, '\n'),
//         scopes
//     )
//     const sheets = google.sheets({ version: 'v4', auth: jwt })
//     let values = [
//         [JSON.stringify(data)]
//     ]
//     let resource = {
//         values
//     }
//
//     await sheets.spreadsheets.values.append({
//         spreadsheetId: sheetId,
//         range: 'A2',
//         valueInputOption: 'RAW',
//         requestBody: resource
//     })
//     functions.logger.debug('WE HIT HERE')
//     functions.logger.info(data, { structuredData: true })
// })