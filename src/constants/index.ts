import * as LangEnUS from '../locales/en-US.json'
// import * as LangZhCN from '../locales/zh-CN.json'

import Config from '../config.json'
import AbiSFC from './abis/sfc.json'
import AbiErc20 from './abis/ERC20.json'
import AbiErc721 from './abis/ERC721.json'
import AbiErc1155 from './abis/ERC1155.json'

/**
 * multilingual 
 * @type key:value pair hashmap
 */
export const locales = {
    "en-US": LangEnUS,
    // "zh-CN": LangZhCN,
} as {[lang:string]:{[key:string]:string}}

/**
 * default locale
 * @type string
 */
export const DefaultLocale = "en-US"

/**
 * http port
 * @type number
 */

export const ZEROADDRESS = '0x0000000000000000000000000000000000000000'
export const MAXGASLIMIT = 1e5

export const config = Config
export const abiSFC = AbiSFC
export const abiErc20 = AbiErc20
export const abiErc721 = AbiErc721
export const abiErc1155 = AbiErc1155
