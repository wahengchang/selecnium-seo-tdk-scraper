# Selenium SEO TDK Scraper
This is a Node.js script designed for scraping SEO-related data from web pages. The scraper is equipped with two efficient scraping methods: Server-Side Rendering (SSR) and Client-Side Rendering (CSR). With support for both SSR and CSR techniques, this tool enables you to extract vital Title, Description, H1, H2, H3 information from websites, regardless of the rendering method employed.

## Usage
To utilize the scraper, follow these steps:

1. Prepare a url.txt file containing a list of URLs you wish to scrape, with each URL on a separate line.
2. Run the script, which will read the URLs from the url.txt file.
3. The scraper will employ the appropriate scraping method (SSR or CSR) based on the website's rendering technique.
4. The extracted SEO data, including the Title, Description, and Keywords, will be saved in a CSV format.
5. The CSV file will be generated, containing the scraped data for each URL.
![image](https://github.com/wahengchang/selecnium-seo-tdk-scraper/assets/5538753/f3d29675-3834-4f78-a1bc-33440482e6ce)


## SSR (Server-Side Rendering) Method
The SSR method leverages Selenium WebDriver to automate a headless Chrome browser. It creates a browser instance, navigates to the specified URL, and retrieves the page source containing the TDK information. You can find the function:
```
./utils/webdriver.js/ 
fetchHtml
```
The headless mode ensures that the rendering process is performed on the server side, making it suitable for websites that generate HTML content before sending it to the client.

## CSR (Client-Side Rendering) Method
The CSR method utilizes Puppeteer, a powerful Node.js library for controlling a headless Chrome browser. It launches a headless browser instance, sets up request interception to mimic the behavior of a CSR application, and navigates to the target URL. It then retrieves the rendered page content, including the TDK information. This method is ideal for websites that rely on client-side JavaScript to dynamically generate content.You can find the function:
```
./utils/webdriver.js/ 
fetchSsrHtml
```

With the combined power of SSR and CSR scraping methods, this repository's Selenium SEO TDK Scraper provides a versatile solution for extracting TDK information from websites regardless of their rendering approach.


## Installation
To use this application, make sure you have Node.js installed on your system. Then, follow these steps:

Clone the repository: git clone https://github.com/your-username/selenium-seo-tdk-scraper.git.
Navigate to the project directory: cd selenium-seo-tdk-scraper.

## Installation
Clone the repository:

### Copy
```
$ git clone https://github.com/wahengchang/selecnium-seo-tdk-scraper.git
```

### Install the dependencies:

```
$ yarn init
// or npm install
```

## Run
Paste your target urls in the file `utls.txt`, the script will read the urls here, then run the scraper.
![image](https://github.com/wahengchang/selecnium-seo-tdk-scraper/assets/5538753/39fcb584-5b32-49e0-a156-66efac401fa1)

Then Run
```
$ node index.js
```

## Output Result
The final result will be save as a csv file, locates in `./2023-10-25_audit`, all the html will be saved under this directory.

![image](https://github.com/wahengchang/selecnium-seo-tdk-scraper/assets/5538753/6f163a6b-a926-4150-9ab4-2b07ae3efca0)
