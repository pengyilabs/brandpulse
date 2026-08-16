import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.modalBody}>
      <div className={styles.previewPanel}>
        <p className={styles.preview}>Preview</p>
        <div className={styles.frame4}>
          <div className={styles.frame2}>
            <img src="../image/msd9atxb-6n49suf.svg" className={styles.frame} />
            <p className={styles.uploadVideo}>Upload Video</p>
            <p className={styles.clickToBrowse}>Click to browse</p>
          </div>
          <div className={styles.frame3}>
            <img src="../image/msd9atxb-dlftcr3.svg" className={styles.frame} />
            <p className={styles.generateAiVideo}>Generate AI Video</p>
            <p className={styles.thisWillCreateAVideo}>
              This will create a video using details and references
            </p>
          </div>
        </div>
        <p className={styles.thisIsAnApproximatio}>
          This is an approximation of what your post will look like.
        </p>
      </div>
      <div className={styles.frame30}>
        <div className={styles.frame6}>
          <p className={styles.title}>Title*</p>
          <div className={styles.frame5}>
            <p className={styles.a5EssentialTrainingT}>
              5 Essential Training Tips for Summer Running
            </p>
          </div>
        </div>
        <div className={styles.frame10}>
          <div className={styles.frame9}>
            <p className={styles.title}>Publish Date</p>
            <div className={styles.frame8}>
              <p className={styles.a5EssentialTrainingT}>June 20 2026</p>
              <img src="../image/msd9atxb-mgrr61f.svg" className={styles.frame7} />
            </div>
          </div>
          <div className={styles.frame9}>
            <p className={styles.title}>Publish Time</p>
            <div className={styles.frame8}>
              <p className={styles.a5EssentialTrainingT}>3:00 PM</p>
              <img src="../image/msd9atxb-evuv6q4.svg" className={styles.frame7} />
            </div>
          </div>
        </div>
        <div className={styles.frame12}>
          <p className={styles.title}>Post Content</p>
          <div className={styles.frame11}>
            <p className={styles.controlRarelyIdentif}>
              Control rarely identifies itself honestly. It arrives as planning, as
              responsibility. It is fear in different clothing. Control does not
              arrive announcing itself as fear. It arrives as planning, as
              preparation, as responsibility, as taking initiative.
            </p>
          </div>
        </div>
        <div className={styles.frame15}>
          <p className={styles.title}>Tags</p>
          <div className={styles.frame14}>
            <div className={styles.frame13}>
              <p className={styles.aIamYoga}>#IAMYoga</p>
            </div>
            <div className={styles.frame13}>
              <p className={styles.aIamYoga}>#AmritYoga</p>
            </div>
            <div className={styles.frame13}>
              <p className={styles.aIamYoga}>#YogaWisdom</p>
            </div>
          </div>
        </div>
        <div className={styles.commentsSection}>
          <div className={styles.line} />
          <div className={styles.frame17}>
            <p className={styles.comments}>Comments</p>
            <div className={styles.frame16}>
              <p className={styles.a3}>3</p>
            </div>
          </div>
          <div className={styles.frame27}>
            <div className={styles.frame21}>
              <div className={styles.frame18}>
                <p className={styles.sC}>SC</p>
              </div>
              <div className={styles.frame20}>
                <div className={styles.frame19}>
                  <p className={styles.sarahChen}>Sarah Chen</p>
                  <p className={styles.a2HAgo}>2h ago</p>
                </div>
                <p className={styles.shouldWeAdjustTheHas}>
                  Should we adjust the hashtags to include #SummerFitness?
                </p>
              </div>
            </div>
            <div className={styles.frame23}>
              <div className={styles.frame22}>
                <p className={styles.sC}>MT</p>
              </div>
              <div className={styles.frame20}>
                <div className={styles.frame19}>
                  <p className={styles.sarahChen}>Mike Torres</p>
                  <p className={styles.a2HAgo}>1h ago</p>
                </div>
                <p className={styles.shouldWeAdjustTheHas}>
                  Good call, also the publish date might conflict with the campaign
                  launch
                </p>
              </div>
            </div>
            <div className={styles.frame26}>
              <div className={styles.frame18}>
                <p className={styles.sC}>SC</p>
              </div>
              <div className={styles.frame25}>
                <div className={styles.frame24}>
                  <p className={styles.sarahChen}>Sarah Chen</p>
                  <p className={styles.a2HAgo}>30m ago</p>
                </div>
                <p className={styles.shouldWeAdjustTheHas}>
                  Updated the tags, can you review?
                </p>
              </div>
            </div>
          </div>
          <div className={styles.frame29}>
            <p className={styles.addAComment}>Add a comment...</p>
            <div className={styles.frame28}>
              <img
                src="../image/msd9atxb-q7ziacu.svg"
                className={styles.arrowUpRight}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
