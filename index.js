(async () => {
    const fs = require('fs')
    const { checkDirExistThenCreate, checkFileExistThenCreate } = require('./utils/file')
    const { onlyDigitChar,removeDomainFromURL } = require('./utils/string')
    const csv = require('./utils/csv')
    const htmlAnalyzer = require('./utils/htmlAnalyzer')
    const webdriver = require('./utils/webdriver')

    const TODAY_DATE_STRING = new Date().toISOString().slice(0, 10)

    const _urlInTxt = fs.readFileSync('./urls.txt', 'utf8')
    const urlInTxt = _urlInTxt.split('\n')
    

    const dirName = `./${TODAY_DATE_STRING}_audit`
    checkDirExistThenCreate(dirName)

    // 1 -=-=-=-= download url to html 
    for(let i=0;i<urlInTxt.length;i++){
        const url = urlInTxt[i]
        const filename = onlyDigitChar(url)

        if (fs.existsSync(`./${dirName}/${filename}.html`)) {
            console.log(`[DOWNLOAD SKIP] ${i}/${urlInTxt.length-1}, ${url}`)
            continue
        }

        console.log(`[START][${i}/${urlInTxt.length}] ${url}`)
        const rawHtml = await webdriver.fetchHtml(url,{isHeadless: false})
        // const rawHtml = await webdriver.fetchSsrHtml(url, {isHeadless: false})
        fs.writeFileSync(`${dirName}/${filename}.html`, rawHtml, 'utf8')
    }

    // 2 -=-=-=-= 
    function findDuplication(arr) {
        var counts = {};
        
        for (var i = 0; i < arr.length; i++) {
          var num = arr[i];
          counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
        
        var duplicates = {};
        
        for (var num in counts) {
          if (counts[num] > 1) {
            duplicates[num] = counts[num];
          }
        }
        
        return duplicates;
      }
    
    const json = []
    const titleList = []
    const descriptionList = []
    for(let i=0;i<urlInTxt.length;i++){
        const url = urlInTxt[i]
        console.log(`[ANALYSIS][${i}/${urlInTxt.length}] ${url}`)

        const filename = onlyDigitChar(url)
        const html = fs.readFileSync(`${dirName}/${filename}.html`, 'utf8')

        const title = `\"${htmlAnalyzer.title(html)}\"`
        const description = `\"${htmlAnalyzer.description(html)}\"`
        const canonical = htmlAnalyzer.canonical(html)
        const h1 = htmlAnalyzer.h1(html)
        const h2 = htmlAnalyzer.h2(html)
        const h3 = htmlAnalyzer.h3(html)
        const isRedirect = !(removeDomainFromURL(url) === removeDomainFromURL(canonical))
        
        const size = htmlAnalyzer.size(html)

        const {countStructureData, structureDataList} = htmlAnalyzer.structureDataAnalyzer(html)
        let data = {
            url,
            title,
            description,
            canonical,
            isRedirect,
            ...h1,
            ...h2,
            ...h3,
            size,
            ...htmlAnalyzer.gtag(html),
            ...htmlAnalyzer.structureData(html),
            countStructureData,
        }
        structureDataList.forEach(item =>{
            data = {
                ...data,
                ...item
            }
        })
        json.push(data)
        titleList.push(title)
        descriptionList.push(description)
    }

    console.log('Duplicate Title: ',findDuplication(titleList))
    console.log('Duplicate Description: ',findDuplication(descriptionList))

    const normalizedJson = csv.normalizeJsonForCsv(json)
    csv.writeJsonToCsv(`${dirName}/final.csv`, normalizedJson,'utf8')
})()