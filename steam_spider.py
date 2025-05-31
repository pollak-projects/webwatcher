import requests
import json
from bs4 import BeautifulSoup

def check_stock():

    def parse(self, response):
        # Look for out of stock text 
        out_of_stock_elements = response.xpath('//div[contains(@class, "out_of_stock") or contains(text(), "Out of Stock")]')
        if not out_of_stock_elements:
            print("No out of stock elements found")
            exit(0)
        
        result = {
            'out_of_stock': len(out_of_stock_elements) > 0,
            'timestamp': response.headers.get('Date', b'').decode('utf-8')
        }
          # Write result to a file that Node.js can read
        try:
            with open('stock_status.json', 'w') as f:
                json.dump(result, f, indent=2)
                f.flush()
                os.fsync(f.fileno())  # Ensure the file is written to disk
            print("Status written successfully")
        except Exception as e:
            print(f"Error writing status: {e}")
            exit(1)

if __name__ == '__main__':
    process = CrawlerProcess({
        'LOG_ENABLED': False,
        'COOKIES_ENABLED': True
    })
    
    process.crawl(SteamDeckSpider)
    process.start()
