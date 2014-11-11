import scrapy

from scraper.items import PinterestPost

class PinterestSpider(scrapy.Spider):
  name = 'pinterest'
  allowed_domains= ['http://www.pinterest.com/']
  start_urls = [
      'http://www.pinterest.com/all/womens_fashion/',
      'http://www.pinterest.com/all/mens_fashion/'
    ]

  def parse(self, response):
    for sel in response.xpath('//div[@class="pinWrapper"]'):
      item = PinterestPost()
      
      #Storing number of pins
      pinString = sel.xpath('div[@class="pinMeta "]//em[contains(@class, "socialMetaCount") and contains(@class, "repinCountSmall")]/text()').extract()
      #checks if the tag for number of pins is given
      if (len(pinString) == 0):
        pins = 0
      else:
        splitted = pinString[0].strip().split()
        pins = pinString[0].strip().split()[0].encode('utf8')
        
      item['pins'] = pins
      
      #Storing user that posted the pin
      userString = sel.xpath('div[@class="pinCredits"]//div[@class="creditName"]/text()').extract()
      
      #checks if the tag is available
      if (len(userString) == 0):
        user = ""
      else:
        user = userString[0].encode('utf8')
      
      item['user'] = user
      
      #Storing the image
      picString = sel.xpath('div[@class="pinImageActionButtonWrapper"]//img/@src').extract()[0].encode('utf8')
      item['img'] = picString
      
      yield item
      
    