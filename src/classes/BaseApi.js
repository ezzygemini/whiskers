const logger = require('ezzy-logger').logger;
const request = require('request');
const Suggestion = require('./Suggestion');
const Spirit = require('./Spirit');
const Api = require('ezzy-express-mvc/api');

const BEVMO_URL = 'http://bevmo.resultspage.com/search?' +
  'ts=rac-data' +
  '&SLILOCATION=97' +
  '&SLIFULFILLMENT=shipping' +
  '&w={word}' +
  '&rt=rac&dv=o' +
  '&showProducts=false' +
  '&strategy=swiftphrase' +
  '&searchIn=cat1' +
  '&searchInCount=5' +
  '&dynamic=true' +
  '&viewMore=SEE%20ALL%20PRODUCTS' +
  '&suggestionCount={count}' +
  '&showLogo=true' +
  '&suggestionAlign=right' +
  '&showDescription=false' +
  '&searchLabel=Search%20Suggestions' +
  '&productDisplay=grid' +
  '&cnt=4' +
  '&requested=-142628587' +
  '&productLabel=Products%20for%20%22{word}%22#';

const MAIN_SUGGESTION_REG = /suggestion\s*:\s*'([\w][\w\s\d]+)'/;
const ALL_SUGGESTIONS_REG = /data-suggested-term="([\w][\w\s\d]+)"/g;
const SUGGESTION_REG = /data-suggested-term="([\w][\w\s\d]+)"/;

class BaseApi extends Api {

  /**
   * Parses the bevmo responses into a set of SpiritModels
   * @param res
   * @returns {Suggestion[]}
   * @private
   */
  static _parseBevmoResponseIntoSuggestions(res) {
    let suggestions = [];
    const instances = [];
    const mainSuggestion = res.match(MAIN_SUGGESTION_REG);
    if (mainSuggestion) {
      suggestions.push(mainSuggestion[0]
        .replace(MAIN_SUGGESTION_REG, (a, b) => b));
    }
    suggestions = suggestions.concat((res
      .match(ALL_SUGGESTIONS_REG) || [])
      .filter(item => instances.indexOf(item) <= -1)
      .map(item => item.replace(SUGGESTION_REG, (a, b) => b)));
    return suggestions.map(name => new Suggestion(name));
  }

  /**
   * Gets the bevmo script
   * @param word
   * @param count
   * @returns {Promise.<Array>}
   */
  getBevmoSuggestions(word = '', count = 4) {
    if (!word) {
      return Promise.resolve([]);
    }
    const url = BEVMO_URL
      .replace(/{count}/g, count.toString())
      .replace(/{word}/g, count.toString());
    return new Promise((resolve, reject) => {
      logger.debug('Bevmo Request', url);
      request(url, (e, response, body) => {
        if (e) {
          return reject(e);
        }
        logger.debug('Bevmo Response', body);
        resolve(BaseApi._parseBevmoResponseIntoSuggestions(body));
      })
    });
  };

}

module.exports = BaseApi;
