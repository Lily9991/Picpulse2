# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class ScraperItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass

class PinterestPost(scrapy.Item):
  user = scrapy.Field() # user name who posted picture
  link = scrapy.Field() # link to post
  pic = scrapy.Field() # link to picture
  desc = scrapy.Field() # description
  pins = scrapy.Field() # number of pins
  likes = scrapy.Field() # number of likes
  img = scrapy.Field() #URL for the image for pinterest




