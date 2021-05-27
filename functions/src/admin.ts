import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as crypto from 'crypto'
import * as firebaseAdmin from 'firebase-admin'

const algorithm = 'aes-256-ctr'


interface Hash {
    iv: string;
    secret: string;
    content: string;
}

export const accounts: { FIREBASE: Hash, GOOGLE: Hash } = {
    FIREBASE: {
        iv: functions.config().admin.iv,
        secret: functions.config().admin.key,
        content: '7b2ddcc64ac684b61e90f92114fc75f7e3c5d2f65a23a8376d8e6360003ad5a5d52cf1b899493462eb9699b51166c83f6383a68d0ce72919913c9030b584ab63975737e73d7c91a0f3b88ad6df7b2042f392a47d522343ec7189e4841504303970dda18991d903bcd234cd6345d1b2c17593beda06d418f3c36c3d5c6f2daff3f3143706bb022213fc5fa8dfa86e4f60278064fbf46b5c80bae66a3f0cf229d0b60fb99bc4dcef38efc50f9061b67c7fc9f056e0f2b8df855ca263069e34e9403e969d742a1293f8ef26ecba2ae62d01b3aed605c734e644ea89577004d0e3a9c62e58f5e8691f327801227ae3d7834857ef69ff81a068ada13e801bdc01fa8f89c6080fe38c043ebb939b216788463ce78d5a211ef52198e41c05dec505e1fc7bf646e2be172927b82276c859c7864634098a2967e490ab206557ad2866437c7fd1822b22de392efb9abeb2904d40eea60508d94f88108f871f08539eb8a7a819b35d4aee23db16334d86f2caa76d7796760d7a8e43ae339bef6c0f8f626ba9ead9de7c76bd6c4815fb2e989c5245097793cb0d8791d0fac348b35a6d10aa2bd849d2308d4b0501529484695877960bc3fc242856196656685ec81c3a2b47ccf31afbee07dda41b37ecd49539d269e536162b672b158645d256c523d24bdb20cb87e8a46dd7cba65327959c4c82a33f5151d1f83f0c0ab4eebd929087cfc7fe5740bdb883c7ed5c22094d7cb2234512ec21d2fd43b888e755299ab56387e9c4c1b968cefcc219fe1620358caf607f7fc331cba45f064b3d46940be4ae919d388b499e842d581a5b3a88a2201f8ec7c96d5eae32fa3896c9efedcb0851ef8a0d371accee94a1ae8face86097350debf246968c2816b623ebbe06b6b413f824a238bb340d3a35b5c8cac6376e4debf3c000f994379abfe0c29b1343fabcafd8b0ffd5fcd7f7ceb87428e7208c94d96e5e5a5dfb3a343530a06ff5c50d8a4e10303eb8c0ff7b8e7fe59e990d8188f9e2cff618b369262b744ad7368c0b23a75b58c29a1958269d52187d1591dd10ad24cb4f8cf766b90e0d5ae89f67400e9d92b8057bc5751d3dd12973a071e5d35c2a8cec8219ce7034596433c3eab6fb3ec2ad0757791e7a7f5e8c0b5122b932f91bb88f0976214c9f01bfbf6d7a09179478e92aee18c6dde610b82c959d9add9d623cb0c044e593c509433fde10a4c5b47ee4f295bf622fd7fc4c04fd921e0a1a29de8879fd3423eca5e34b47d37561143b74d6362594a338c75458f200d19eb0238e5a3066ffca4872ca130221bfac9e05285dc21bd2d71c2fef066a7c1913364a05ff3bd65a8cfdbcf19aee1bbfb4d9bc1867e1f6cae4b2decabbb05bd0a4059b3ff2d84525e460baf6bb250bcb41ab5a941e3429841190955ea6034fcd07e1988adf03e8c27e741e7a703eb19e7cd32ae481f329a8263fba8f175b4f95945481f7d966aeb25006f5d870586d8c7740ad7b6ca7745b1efca63e4cce8336f0755718094673d46ed262a8412a1cd0ce52b3104927a8f99d98c0cd42686a16b5d41136352a13be3a34963f561278ece86146f63ae6e59939ecc6b516767d5c3b7035057fe5daf75b5e9df10bc7c9a9f7fbf5e74aa5fd16b3553bd738fc7d6a04460540f07b123a8b9949ad50941bb59815d83bdc16be62e04c2f1020f3a1728c477dbf7a3be8cfdcd0f06171061e508841a28d724ef12a11cfd3bd8a770f29814c7757d49f16fa10560c248e6f646a8a526927c0a1e987d449a6e06a86a828f61cfb43498036c8bcc31d6389c536c672433618ea00bdeaf6463b410599e043f81e29a19e22cdbb961cebea9c523099759082a631e0036a4035f2a4be0f5592a3155ff9d128f74ea5db4c458764b07a587972775936512c33552a041e569bbfe32131e2b8f42dfe622a810465175ced0fec861f3cb294b78972c204b7da6f4d58203ef0fd90005607505f65507182f4bf41dd982bc8a61ec0b3e65c2920fc519a7fde546a9e418dab4435a9ad90f7bf790a3a434a95c5fa950f6c138e90a9dac7f563c8473d3b36f5aaf6438a73b877e1593fe1d5f600b24bf1ef11a3ca2a683d23b0b8a6046ced13ce5feb11ea617269cc2410ccc94068b354ff9ba7090fcab673cd4c883c24b6f0fbb5eb02341dd1a27a07a53f745ee9fac53a9e50584427c38e7e46f13e03e54ad9d3ed46eb577d06cc5159f28068252fe037cfded79de6b9827cf1ec43da2ba50b65125993f76eb50416b40a99f18633d1ba06c2a7a9117b65b3cfe315264bda5ddae28eecdaabeb2d82312c8d8a37bc3fe40251e80e2c97d43fc904e279923bc327a142bf37f57da85e96bcaaeedc1084a810f0a531763e4c1768e2dadd886611e958256878232e1aba8d8d7b62a74a2a72a9b5b4fa3942b05f0568fd735e9c3121bb65b2eec29b4a640d2e68356effcd68fc6e9335746abc61059563e49fe5f2d34dbec2ea57b05d3826d26113039a554e2900943e22004f1cb26bce6a9db141a42f6468b792df14c5da30397da24d6acce5867309ae992f3971fe6ab36eda12aed248af1892b042e8def35f5f688c96f6522cb7c381fd044f0e0e503d9f72ebfcde8ca518585c0a0d34c31acc7e1069565c7dc47969e1a98a07a9b4a9949a5669f327a5f5f5e9a35c186f60e68f25735e56d063f2b3ea5d3df5aa742c49447062c43b8bc745f1cd3a98f080858f367d1572fe57dbde878809c83791f2e431e2bd2670dc0ba6fe5a5f02e38a2f91bc21a96472c42622a16e36b6e07d9a2808ca308331737d6c878035771c3e06bdfa003b54771915f6f957ce2af9f1fca7f0601496a3835d6ff16d1209781128909215de96b232ac31f28436837bc1df3c70d0e0ae663a6148bb11e0dcf33d2a7e10a12cb8b8e256477fc4eaf8a60aa95fdf83e8dd86127d9d67542ec834afab4152be33ddc304e0cf2af7608743c7735da3ec79820ffe6bde2a21b7401aad6dc92116c6a8752807f3ad2d1ce764ae1b97f1afc9e451e1b813f3d51520613ad94cf3910c8cece9f957c25de0ace497bf8cf9aa609e19c5d0df8b0edd50f2e397a89bfe1eb1db44d3605937cc107103468605f15d578695c80708ac22dbacf67809b06f617154d54de183d2974009ab05430e2eb4372148b0f2d2077e79c786b6ed90f41c6dfba32731b233022e003042d6fe5542f7ed2f927841b65a0aa2fe29b05a228190604cb209a3b58cd5f39b61c9573e2f78'
    },
    GOOGLE: {
        iv: functions.config().google.iv,
        secret: functions.config().google.key,
        content: '0522a3e89e1d98edc87518f7bf407f86af40c48662805823b4b8cde37dfb505f11ef748a65095efe199a0a84de896e584be0ab20ad16ac39f8d93fb83ffc3fe680001a1e23f27950e925598c1ccf176f69d48cb90ee29864a229d4ef680bf3872226e49a9c7ea51d8fc226013e8666d3820778fd9f8a9055fde7c836fd14fcc8022af9f9d795321a883c5589701a13bfb759e59842e286c5a14bcd3bfe2b9002c0395734ac0948b3a285f0f62bcaee7678b52b60c615492bfef3f648d0df8440ecb151e6494a8d17ecf224f45708738717f345aa88d73371b1ca771f0fefb3a29a5c8c56829b2427f88139dfce5da88e8ec2b4cf2202449e25b292aaa58c63cdf7dbac7eb16fb9651c64f95e612c50d10f33e3995742d79bc06a7bfda449836a21184609a2ec446c79b438943c8071fe104e507bb2ca872a354a3b75c31e8f265ec59de997e9b0d40db7bb1692e78b08ab80eb23987c1a226efe5d9d7723a88c17bc0d94f45cad4bf23a350b888454e86e69e22faf781591573c431e2ed3b7f6ff4f321aea2dcf8b41bf3d4b1324f34b8c946298bb629fa11f8414b466c92bfdab73e036dc5905649870844bc6a64814370b5744db0b11dc0b16f1ca7f5086bcacc4f7a2855fa91f3b7993fbc76206020c5e12dc514de17341fd31cc50db80df11fbf2881c0cf306f4d654ecc315c73b7e68223066c6fda0e2854276b60c2aa0480e34c94c4e64f5b56e8acce95208145ba441be473aeec3a320f1cd0a57d27cca432a1eb85351ea799b2c89dcf9b6b3bc3d8b75d73c6a4ebdd5ea0714e5bbd8484c4ec62bf179b8d8ed36d7b2a12b6109b0b4f1f1de04e8f7c9658bd8f010c8e965d9e698fa85ecdaae0ed035b39456e7e00c55f14afa7dfe1e0fb7fb21249beacc596786f501844542236a20bd3b0d13fd4c44acf513ea5286bc55e6bfd2959f54977af13efee4f5aa77925de9bf4225ce1c965131936f357e157804f53bccd0b391f61a7b77fca2cdd639800cf9a275278296ee87c49fdacf29f08438917a3eab2246046a2613c1344cb23bc6ca951dbb651cb0492195984d71fd6ae1c65d7a6ae7e59d9ba9d6a4718ae0fb8286079f35bc18d6fe962174c2b4e32e10ffeb1e23465e83c265cd95f9de8b5c8f14d79e7a99974680dfc5b3562a20c1f347f27aa1929ad85dfaa6589637c535f200ce24e8cec894eaf38517000ed41db62dd78b0518abeb67f4ca9a9f6f6bf2252b38152d1e3573c0235166255f3c72fec4fb65d395ae9b7a2650febdc75d0c1258dee88f640be408634935078b03a80b427516b79cf620788a707cf235c4d4c77ce24e3b95309e53776513fae7f7f0bccca8cf0048578fc9527aa0702762b3a8746164556a6f9a8765582742b4ffb82ad590a09e8d30e8c1bab047ac225dce4dd82a32547daa7298d202d9fdf998fd18d5ae6a64cfd903e6656229a01b335dcd419f977360b29dde74f70f742ca8c270009126567ee5da46ff84ad8cb87d70edef1752dfced6091635a943f101c19a563bd323dbda1df9fbce00e4c0ddad1033877213b21ea0d1a3d9b67e2869e4560876dae9ac302f9afecce4d8684103b45e6ad56f62e1bca899ca04961d09c80dedde2b5d7d8b36abb53817714a75e6faf319c9196860e51813a26305edd2dd09571bed286968c4560237722179e52f2cd359a357c6d55b4400f5c7a4162b51417d3b53838ecd38fe6204c8dea404a804990b78cb2ac58f8e8716eef0819edee978ead77fb8275af8f08196afbdec050ab372829731a53816e1b21365f76e584979d017966e7c90b00c5efd8f9b2f984c2b850e1d60943360348b3efed2bf9e4491ccc3600018e29d87c050e65b29619053613dd84b722a068f1bbe6d8f0fd4ec15a220b1aeb8a5fa442a9bca4a81ee34145359eaa783baa95330a721759603bb5a47ee071143f9a6306e45cb4e831edc65c707ac28a007a7996e332002682ac32419c0ff3324d8946040058f40cd5c27a5e8dfb5d9d19f02d215b7281c1248e2c139fa5bfaaa201f07538b392e65b03e0bc25e84cc301659c3b7d61460010c432eae78eea2ca8c95dacaeae980da66929590cec66b3713c4e9388b9948a92e3f932f3ebf94b28e73a27ec28a471fc2df63a2958f33bf8b6ff8708a6ef4dee6799a1f2bcd1bff75f5f8b8a5a80cd6fbb18e283a09fcc317da9fbc680cb85019c216a46473e7d3bc95e7fa3d834a6eb1c3f8a337f500903559ef006ec36fa7f155186eeff730b79bad66fd54fbf51015fe2ea5646a4d0917329702d7015731da6268ca5c2abce2a1a776be62845bceb2e2c0ba43c6aa23d78d86971e0d5d9f340cae1eb4f03c94441fa01fcf96dd4c7196bc035cb041289a4fc29b53c611003529fca071045ebaf04b60d1686ba8f9ec5296ccf0e96f13e4ef6250aaeaaeaa9be87cdae5c19d74b8c8c9f64ac250e8176730f08174b8545eb53968f0d42f7dd51922b362336480b2d9d24f429143daeb7b279ee0170f43e179b655d11282b2ee1a747ea88de40e6cb5f5a122f287ce1668194c35b1c42bd18bfb072732090769878e762d4910962a959dafb9fab4769101c025ed78a0adb739d360b63f23fc0b590c27531ad87d6fa25d740b9aa482374c3efaa6855a06b2b27566e44195d2a32f4264b90a427bbac1e8d1b571a57be8dfd6613900d18642101648d345aebf26a38e0e3149777ca053ac767d36395ecbe07b2940701ea80acb9c7db8f3a32f41a838fe75795f032157bd8a86152975012bb768bc21c8567f526654b10184e1664fb51bd673f8a91f6d9b3fe0d2c666c2bc1b5581c80fd433c6df9287cc80122813c502085e9b85718c01997861f6f53b30e951f6d18735d5dcc9fd0cb4b4ac59f2896875d14e8368957483cbc43522b2dd33d9ef58ac68b963688f868df461cfdcb4d032c3cda5c69b81d4061ef585c72891428b979ad05f38c0920f0fe06dba9334cae86e66d33bac8969fb7e6a582510f8a2adcf0d68758fdedf91a6031155b615f6ef2af335f0dcce2332010ecc087392a550a234e86a53bbf483e4eaa367542eee1ff19002f448c3b1949d6de06625f419c68ec2bdc06b2e8f767a9ebe4e29508e7856954ed165f80d9ff03de5f7e8c5fb0c2e760c2a60b881f68a6fde4000f5909a063521c00cf27504f6b48ae1cb9b84efd40a09c14cbd296630abfc897b0c2cd40d946e66'
    }

}

export function getDecrypted(hash: Hash): string {
    const decrypt = (hash: Hash, secret: string): string => {

        const decipher = crypto.createDecipheriv(algorithm, secret, Buffer.from(hash.iv, 'hex'))

        const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

        return decrypted.toString()
    }

    return decrypt(hash, hash.secret)
}

const serviceAccount = JSON.parse(getDecrypted(accounts.FIREBASE))

admin.initializeApp({
    credential: firebaseAdmin.credential.cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key
    })
})

export default admin