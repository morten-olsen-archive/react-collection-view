import React from 'react';

class ErrorApi {
  logError() {
    global.console.error(new Error('Using scroll API on element without scroll wrapper'));
  }
  getScrollContainer() {
    this.logError();
    return <div />;
  }
  addEventListener() {
    this.logError();
  }
  removeEventListener() {
    this.logError();
  }
  scrollTo() {
    this.logError();
  }
}

export default new ErrorApi();
