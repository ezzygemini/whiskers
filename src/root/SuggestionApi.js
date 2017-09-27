const BaseApi = require('../classes/BaseApi');

module.exports = class WhiskeysApi extends BaseApi {

  /**
   * Handles the su
   * @param basics
   * @param word
   * @returns {Promise.<TResult>}
   */
  doGet(basics, word){
    return this.getBevmoSuggestions(word)
      .then(
        suggestions => this.sendData(basics, suggestions),
        () => this.internalServerError(basics)
      );
  }

};
