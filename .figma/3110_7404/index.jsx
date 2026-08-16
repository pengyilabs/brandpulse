import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.modalBody}>
      <div className={styles.previewSection}>
        <div className={styles.thumbnail}>
          <div className={styles.filePill}>
            <p className={styles.youTubeShortsRunning}>
              YouTube Shorts - Running Form Tips V3.mp4
            </p>
          </div>
          <div className={styles.playCircle}>
            <div className={styles.vector} />
          </div>
        </div>
      </div>
      <div className={styles.readOnlyInfoGrid}>
        <div className={styles.field}>
          <p className={styles.title}>Title</p>
          <p className={styles.a5EssentialTrainingT}>
            5 Essential Training Tips for Summer Running
          </p>
        </div>
        <div className={styles.datetimeRow}>
          <div className={styles.field2}>
            <p className={styles.title}>Publish Date</p>
            <p className={styles.a5EssentialTrainingT}>June 20, 2026</p>
          </div>
          <div className={styles.field2}>
            <p className={styles.title}>Publish Time</p>
            <p className={styles.a5EssentialTrainingT}>3:00 PM</p>
          </div>
        </div>
        <div className={styles.field3}>
          <p className={styles.title}>Post Content</p>
          <p className={styles.controlRarelyIdentif}>
            Control rarely identifies itself honestly. It arrives as planning, as
            responsibility. It is fear in different clothing...
          </p>
        </div>
        <div className={styles.tagsField}>
          <p className={styles.title}>Tags</p>
          <div className={styles.tagsContainer}>
            <div className={styles.tag}>
              <p className={styles.aIamYoga}>#IAMYoga</p>
            </div>
            <div className={styles.tag}>
              <p className={styles.aIamYoga}>#AmritYoga</p>
            </div>
            <div className={styles.tag}>
              <p className={styles.aIamYoga}>#YogaWisdom</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.line} />
      <div className={styles.commentsPanel}>
        <div className={styles.commentsHeader}>
          <p className={styles.comments}>Comments</p>
          <div className={styles.badge}>
            <p className={styles.a1}>1</p>
          </div>
        </div>
        <div className={styles.commentItem}>
          <div className={styles.avatar}>
            <p className={styles.sC}>SC</p>
          </div>
          <div className={styles.commentTextGroup}>
            <div className={styles.meta}>
              <p className={styles.sarahChen}>Sarah Chen</p>
              <p className={styles.a2HAgo}>2h ago</p>
            </div>
            <p className={styles.shouldWeAdjustTheHas}>
              Should we adjust the hashtags to focus more on running form instead of
              yoga labels?
            </p>
          </div>
        </div>
        <div className={styles.commentComposer}>
          <p className={styles.addAComment}>Add a comment...</p>
          <div className={styles.sendButton}>
            <img src="../image/msd9bn6y-g4bge3t.svg" className={styles.sendIcon} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
