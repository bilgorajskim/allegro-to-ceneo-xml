'use strict'

function innerText (value) {
  return value.replace(/<(?:.|\n)*?>/gm, '')
}

const fs = require('fs')
var Promise = require('bluebird')
var builder = require('xmlbuilder')
var xml = builder.create('offers', {version: '1.0', encoding: 'UTF-8'})
xml.attribute('version', '1')
xml.attribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
var cheerio = require('cheerio')
var Xray = require('x-ray')
var x = Xray({
  filters: {
    innerText: innerText,
    noBrackets: value => value.replace('(', '').replace(')', '')
  }
})

module.exports = {
  fetchOffers: function (url, output = null) {
    let items = []
    function fetchOfferDetails (url) {
      return new Promise((resolve, reject) => {
        x(url, {
          name: 'h1.title',
          id: 'h1.title > small | noBrackets',
          price: 'div.price@data-price',
          attributes: '.attributes-container@html',
          breadcrumbs: ['#breadcrumbs-list span'],
          description: '.description-container@html',
          images: ['.img-container .img-responsive@data-img-large']
        })(function (err, obj) {
          if (err) {
            return reject(err)
          }
          try {
            if (!obj || !obj.attributes) {
              return reject(new Error('Failed to parse page'))
            }
            let attributes = {}
            let $ = cheerio.load(obj.attributes)
            let lis = $('ul.offer-attributes').find('li')
            lis.each((i, elem) => {
              let attrName = $(elem).find('.attribute-name').text()
              let attrValue = $(elem).find('.attribute-value').text()
              if (attrName === 'waga (z opakowaniem):') {
                attributes.weight = attrValue.replace(' [kg]', '')
              }
            })
            let cat = obj.breadcrumbs.join(' / ')
            let o = xml.ele('o', {
              id: obj.id,
              price: obj.price,
              url
            })
            if (attributes.hasOwnProperty('weight')) {
              o.attribute('weight', attributes.weight)
            }
            o.ele('cat', []).cdata(cat.trim())
            o.ele('name', []).cdata(obj.name.replace(/\([0-9]{10,20}\)/i, '').trim())
            let descDOM = cheerio.load(obj.description)
            descDOM('style').remove()
            o.ele('desc', []).cdata(descDOM.text().trim().substring(0, 29999))
            o.ele('imgs', [])
                            .ele('main', {url: obj.images[0]})
            o.ele('attrs', [])
            resolve()
          } catch (e) {
            reject(e)
          }
        })
      })
    }

    function fetchPage (url, pageNumber) {
      x(url + '&p=' + pageNumber, {
        shopName: '.user-info',
        currentPage: '.pagination-top input@value',
        items: ['#opbox-listing div > h2 > a@href']
      })(function (err, obj) {
        if (err) {
          return console.error(err)
        }
        if (obj.items.length > 1 && parseInt(obj.currentPage) === pageNumber) {
          items.push(...obj.items)
          fetchPage(url, pageNumber + 1)
        } else {
          if (items < 1) {
            return console.error('Failed to fetch offers: no offers found')
          }
          Promise.each(items, fetchOfferDetails).then(() => {
            xml = xml.end({pretty: true})
            if (xml === '') return
            if (output) {
              fs.writeFile(output, xml)
            } else {
              console.log(xml)
            }
          }).catch(err => {
            console.error('Failed to fetch offers: ', err)
          })
        }
      })
    }
    fetchPage(url, 1)
  }
}
