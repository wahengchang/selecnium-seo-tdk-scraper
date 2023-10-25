const url = require('url');

const onlyDigitChar = (str = '') => {
    return str.replace(/[^a-zA-Z0-9]/gm, "")
}

const withoutEmoji = (str) => {
    return str.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
}

function removeDomainFromURL(inputURL) {
    if(typeof inputURL !== 'string')  return
    
    if(!inputURL) return 

    let parsedURL
    try {
        parsedURL = new URL(inputURL);
    }
    catch(e) {
        return inputURL
    }

    const path = parsedURL.pathname + parsedURL.search + parsedURL.hash;
    return path;
}

function extractUrlLastPage(urlString) {
  const parsedUrl = url.parse(urlString);
  const path = parsedUrl.pathname; // Extract the path from the parsed URL
  const pathSegments = path.split('/'); // Split the path into segments

  // Return the last segment (excluding any empty segments)
  return pathSegments.filter(segment => segment !== '').pop();
}

function extractUrlLang(urlString) {
    const parsedUrl = url.parse(urlString);
    const path = parsedUrl.pathname; // Extract the path from the parsed URL
    const pathSegments = path.split('/'); // Split the path into segments
  
    // Check if the second segment is a supported language
    const language = pathSegments[1];
    const supportedLanguages = ['en', 'en-GB', 'ja', 'vi', 'ru', 'es', 'tr', 'it', 'fr', 'de', 'zh-CN', 'zh-TW', 'pt', 'id', 'th', 'nl', 'pl', 'uk', 'sv', 'pt-PT', 'es-ES', 'uz'];
  
    if (supportedLanguages.includes(language)) {
      return language;
    } else {
      return '';
    }
  }
module.exports = {
    onlyDigitChar, 
    withoutEmoji,
    removeDomainFromURL,
    extractUrlLastPage,
    extractUrlLang,
}

