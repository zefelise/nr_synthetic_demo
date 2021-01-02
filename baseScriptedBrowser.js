'use strict';
const _ = require('lodash');
const libs = require('./lib');



class BaseScriptedBrowser {
  /**
   * Initialize required parameter
   */
  constructor(config) {
    this.logger = new libs.Logger();
    this.config = config;
    $browser.addHeaders(libs.Utils.syntheticAgentHeader);
    $browser
      .manage()
      .timeouts()
      .implicitlyWait(10000);
    $browser
      .manage()
      .window()
      .setSize(1920, 1080);
  }

  login(component = 'home', app = 'build') {
    const loginUrl = `${this.config.baseDocsUrl}/${app}/${component}/projects/${this.config.projectId}`;
    return $browser
      .get(loginUrl)
      .then(() => {
        this.logger.logWithEvents('Launch ACS Web', false);
        $browser
          .waitForAndFindElement($driver.By.id('userName'))
          .then((elem) => {
            return elem.sendKeys($secure.DOCS_USER_NAME);
          })
          .then(() => {
            $browser.waitForAndFindElement($driver.By.id('verify_user_btn')).then((elem) => {
              return elem.click();
            });
          });
        $browser.sleep(500);
        $browser.waitForAndFindElement($driver.By.id('password'), 3000).then((elem) => {
          return elem.sendKeys($secure.DOCS_USER_PASSWORD);
        });
      })
      .then(() => {
        $browser.waitForAndFindElement($driver.By.id('btnSubmit')).then((elem) => {
          return elem.click();
        });
      })
      .then(() => {
        $browser.sleep(500);
        return $browser
          .waitForAndFindElement($driver.By.xpath("//ul[@data-testid='SideNavigationList']//span[contains(text(),'Files')][1]"), 80000)
          .then(() => {
            this.logger.logWithEvents('Show left panel');
            startTime = Date.now();
          });
      })
      .then(() => {
        // add this logic because there is a BIM360 training toast appears after user login on Prod US which prevent further action if not close it.
        $browser
          .findElement($driver.By.xpath("//div[@id='pendo-guide-container']//button[contains(text(),'Skip tour')][1]"))
          .then((elem) => {
            this.logger.logWithTime(`Find the Skip tour button`);
            return elem.click();
          })
          .catch(() => this.logger.logWithTime(`Not find the Skip tour button`));
      })
      .catch((error) => {
        this.logger.logWithTime(`Error caught in login: ${error}`);
        this.logger.logWithTime('========================================================');
        throw error;
      });
  };

  loginToBuildFiles() {
    return this.login('files')
      .then(()=> {
        return $browser
            .waitForAndFindElement($driver.By.xpath("//div[contains(@class, 'Title') and contains(text(),'Files')]"), 20000)
            .then(() => {
              this.logger.logWithEvents('Show Files Title', false);
            });
      })
      .then(()=> {
        return $browser
            .waitForAndFindElement($driver.By.xpath("//div[contains(@data-testid, 'node-label')]//div[contains(text(), 'For the Field')][1]"), 20000)
            .then(() => {
              this.logger.logWithEvents('Show Root Folder Tree', false);
            });
      })
      .then(()=> {
        return $browser
            .waitForAndFindElement($driver.By.css("div.MatrixTable__table-main  > div.MatrixTable__body"))
            .then(() => {
              this.logger.logWithEvents('Show Matrix table', false);
            });
      })
      .then(()=> {
        return $browser
            .waitForAndFindElement($driver.By.xpath("//div[@class='MatrixTable__row-cell']//div[contains(@class, 'DocumentNameStyles')]//span[text()='02 - pdf - 1 page.pdf']"))
            .then(() => {
              this.logger.logWithEvents('Show Documents', false);
            });
      });
  }
}

module.exports = BaseScriptedBrowser;