const cheerio = require('cheerio');

const gtag = (html) => {
    const codeList = [
        // ['ua',  /UA-[a-zA-Z0-9]+-\d+/g],
        ['ga4',  /G-[a-zA-Z0-9]+/g],
        ['gtm',  /GTM-[a-zA-Z0-9]+/g],
    ]
    const json = {}

    for(let j=0;j<codeList.length;j++) {
        const [key, regex] = codeList[j]
        const _matches = html.match(regex)
        const matches = [...new Set(_matches)]
        json[`${key}Count`] = `\"${matches.length}\"`
        json[`${key}Ids`] = `\"${matches.join(',')}\"`
    }

    return json
}

const extractTextBySelect = (html,selectStr, attr) => {
    const $ = cheerio.load(html);

    if(attr) return $(selectStr).attr(attr)
    
    return $(selectStr).text()
}
const title = (html) => {
    const $ = cheerio.load(html);
    return $('title').text()
}
const description = (html) => {
    const $ = cheerio.load(html);
    return $('meta[name="description"]').attr('content')
}
const canonical = (html) => {
    const $ = cheerio.load(html);
    return $('link[rel="canonical"]').attr('href')
}
const countAndText = (html, pattern) => {
    const $ = cheerio.load(html);
    let count = 0 
    let textString = ''

    $(pattern).each((index, element)=>{
        count +=1 
        textString += `${$(element).text()} ,`
    })

    return {
        [`${pattern}Count`]: count, 
        [`${pattern}Text`]: `\"${textString}\"`
    }
}
const h2 = (html) => {
    return countAndText(html, 'h2')
}
const h1 = (html) => {
    return countAndText(html, 'h1')
}
const h3 = (html) => {
    return countAndText(html, 'h3')
}

const structureData = (html) => {
    const $ = cheerio.load(html);

    const isBreadcrumb = html.includes('@type":"BreadcrumbList')
    const isBlogPosting = html.includes('@type":"BlogPosting')
    const isArticle = html.includes('@type":"Article')
    const isFaq = html.includes('@type":"FAQPage')
    const isLogo = html.includes('@type":"Organization')

    const isSsr = !(
        html.includes('You need to enable JavaScript to run this app')
        || html.includes('window.__NUXT__=')
    )

    return {
        isBreadcrumb,
        isBlogPosting,
        isArticle,
        isFaq,
        isLogo,
        isSsr
    }
}

const size = (html) => {
    const encoder = new TextEncoder();
    return encoder.encode(html).length/1024/1024
}

const structureDataAnalyzer = (html, config = {}) => {
    const {isRaw = false} = config
    const $ = cheerio.load(html);
    let countStructureData = 0 
    const structureDataList = []

    const sdParser = (json) => {
        const type = json['@type']
        const raw = isRaw ? JSON.stringify(json) : `\"${JSON.stringify(json).replaceAll('"',``)}\"`
        if(type === 'BreadcrumbList') {
            return {
                [type]: true,
                [type+'List']: json.itemListElement.length,
                [type+'raw']:raw,
            }
        }
        if(type === 'FAQPage') {
            return {
                [type]: true,
                [type+'List']: json.mainEntity.length,
                [type+'raw']:raw,
            }
        }
        if(type === 'Article' || type === 'BlogPosting') {
            return {
                [type]: true,
                [type+'raw']:raw,
            }
        }
    }

    $('[type=application/ld+json]').each((index, element)=>{
        countStructureData +=1 
        try {
            structureDataList.push(sdParser(JSON.parse($(element).text())))
        }
        catch (e) {
            console.log('$(element).text(): ', $(element).text())
            console.log(e)
        }
    })

    return {
        countStructureData,
        structureDataList
    }
}

const breadcrumb = (html) => {
    const sdList = structureDataAnalyzer(html, {isRaw: true})

    if(sdList.countStructureData <=0) return

    for(let i =0;i<sdList.structureDataList.length; i++) {
        const item = sdList.structureDataList[i]
        if(item && item['BreadcrumbList']) return JSON.parse(item['BreadcrumbListraw'])
    }

    return
}

module.exports = {
    gtag,
    title,
    description,
    structureData,
    size,
    canonical,
    structureDataAnalyzer,
    h1,
    h2,
    h3,
    breadcrumb,
    extractTextBySelect,
}