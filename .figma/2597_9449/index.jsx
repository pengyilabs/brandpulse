import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.createContentStep1}>
      <div className={styles.createContentModal}>
        <div className={styles.container}>
          <img src="../image/ms7h1w99-b71tnjg.svg" className={styles.icon} />
        </div>
        <div className={styles.container2}>
          <p className={styles.modalTitle}>Create Content</p>
          <p className={styles.modalSubtitle}>How to Create</p>
        </div>
        <div className={styles.button}>
          <img src="../image/ms7h1w99-qwg42lh.svg" className={styles.icon} />
        </div>
      </div>
      <div className={styles.container9}>
        <div className={styles.container4}>
          <div className={styles.container3}>
            <p className={styles.a1}>1</p>
          </div>
          <p className={styles.howToCreate}>How to Create</p>
        </div>
        <div className={styles.container6}>
          <div className={styles.container5}>
            <p className={styles.a2}>2</p>
          </div>
          <p className={styles.contentType}>Content Type</p>
        </div>
        <div className={styles.container8}>
          <div className={styles.container7}>
            <div className={styles.container5}>
              <p className={styles.a2}>3</p>
            </div>
            <p className={styles.contentType}>Sources & Assets</p>
          </div>
        </div>
        <div className={styles.container6}>
          <div className={styles.container5}>
            <p className={styles.a2}>4</p>
          </div>
          <p className={styles.contentType}>Configuration</p>
        </div>
        <div className={styles.container6}>
          <div className={styles.container5}>
            <p className={styles.a2}>5</p>
          </div>
          <p className={styles.contentType}>Review</p>
        </div>
      </div>
      <div className={styles.container17}>
        <div className={styles.container10}>
          <p className={styles.howWouldYouLikeToCre}>
            How would you like to create content?
          </p>
          <p className={styles.startFreshOrPullSett}>
            Start fresh or pull settings from an existing campaign.
          </p>
        </div>
        <div className={styles.containerMargin2}>
          <div className={styles.button2}>
            <div className={styles.container11}>
              <img src="../image/ms7h1w9a-n2xckvv.svg" className={styles.icon2} />
            </div>
            <div className={styles.container13}>
              <p className={styles.brandNew}>Brand New</p>
              <p className={styles.startFresh}>Start Fresh</p>
              <div className={styles.container12}>
                <p className={styles.allFieldsStartEmptyB}>
                  All fields start empty. Build from scratch with no pre-filled
                  settings.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.button3}>
            <div className={styles.container14}>
              <img src="../image/ms7h1w9a-h8r1m9b.svg" className={styles.icon2} />
            </div>
            <div className={styles.container15}>
              <p className={styles.brandNew}>From Existing Campaign</p>
              <p className={styles.preFilledSettings}>Pre-filled Settings</p>
              <div className={styles.container12}>
                <p className={styles.allFieldsStartEmptyB}>
                  Load a campaign's brand guidelines, audience, and settings
                  automatically.
                </p>
              </div>
            </div>
            <div className={styles.containerMargin}>
              <div className={styles.container16}>
                <img src="../image/ms7h1w9a-sw2aok2.svg" className={styles.icon3} />
                <p className={styles.selectACampaign3}>
                  <span className={styles.selectACampaign}>S</span>
                  <span className={styles.selectACampaign2}>elect a Campaign</span>
                </p>
                <img src="../image/ms7h1w9a-vii85s3.svg" className={styles.icon3} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.container21}>
        <p className={styles.cancel}>Cancel</p>
        <div className={styles.container20}>
          <div className={styles.container18} />
          <div className={styles.container19} />
          <div className={styles.container19} />
          <div className={styles.container19} />
          <div className={styles.container19} />
        </div>
        <div className={styles.button4}>
          <p className={styles.continue}>Continue</p>
          <img src="../image/ms7h1w9a-54kkhlm.svg" className={styles.icon3} />
        </div>
      </div>
    </div>
  );
}

export default Component;
