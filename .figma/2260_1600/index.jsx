import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.addResourcesModal}>
      <div className={styles.header}>
        <p className={styles.addResources}>Add Resources</p>
        <p className={styles.uploadFilesOrPasteUr}>
          Upload files or paste URLs to add to your library
        </p>
      </div>
      <div className={styles.body}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarItemUploadFro}>
            <img src="../image/ms75iyld-p9o6w37.svg" className={styles.upload} />
            <p className={styles.uploadFromDevice}>Upload from Device</p>
          </div>
          <div className={styles.sidebarItemGoogleDri}>
            <img src="../image/ms75iyle-vn1kt47.svg" className={styles.upload} />
            <p className={styles.googleDrive}>Google Drive</p>
          </div>
          <div className={styles.sidebarItemGoogleDri}>
            <img src="../image/ms75iyle-zdiizzx.svg" className={styles.upload} />
            <p className={styles.googleDrive}>Dropbox</p>
          </div>
          <div className={styles.sidebarItemGoogleDri}>
            <img src="../image/ms75iyle-ampzcm1.svg" className={styles.upload} />
            <p className={styles.googleDrive}>Web URL</p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.uploadZone}>
            <img
              src="../image/ms75iyle-4simpmd.svg"
              className={styles.cloudUpload}
            />
            <p className={styles.clickOrDragToUpload}>Click or drag to upload</p>
          </div>
          <div className={styles.recentAssets2}>
            <p className={styles.recentAssets}>Recent Assets</p>
            <div className={styles.grid}>
              <div className={styles.frame4}>
                <div className={styles.assetCard}>
                  <div className={styles.previewArea}>
                    <img
                      src="../image/ms75iyle-qbjxkgn.svg"
                      className={styles.image}
                    />
                    <div className={styles.frame}>
                      <p className={styles.usedIn}>Used in</p>
                      <p className={styles.runningFormTips}>Running Form Tips</p>
                    </div>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.heroBannerPng}>hero-banner.png</p>
                    <p className={styles.a2MinsAgo}>2 mins ago</p>
                  </div>
                </div>
                <div className={styles.assetCard2}>
                  <div className={styles.previewArea2}>
                    <img
                      src="../image/ms75iyle-vty7bh4.svg"
                      className={styles.image}
                    />
                    <div className={styles.frame2}>
                      <p className={styles.unused}>Unused</p>
                    </div>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.heroBannerPng}>project-brief.pdf</p>
                    <p className={styles.a2MinsAgo}>1 hour ago</p>
                  </div>
                </div>
                <div className={styles.assetCard3}>
                  <div className={styles.previewArea3}>
                    <img
                      src="../image/ms75iyle-vbumhuq.svg"
                      className={styles.image}
                    />
                    <div className={styles.frame3}>
                      <p className={styles.usedIn}>Used in</p>
                      <p className={styles.runningFormTips}>Father's Day</p>
                    </div>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.heroBannerPng}>intro-video.mp4</p>
                    <p className={styles.a2MinsAgo}>Yesterday</p>
                  </div>
                </div>
                <div className={styles.assetCard2}>
                  <div className={styles.previewArea2}>
                    <img
                      src="../image/ms75iyle-qbjxkgn.svg"
                      className={styles.image}
                    />
                    <div className={styles.frame2}>
                      <p className={styles.unused}>Unused</p>
                    </div>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.heroBannerPng}>thumbnail-01.jpg</p>
                    <p className={styles.a2MinsAgo}>2 days ago</p>
                  </div>
                </div>
              </div>
              <div className={styles.frame7}>
                <div className={styles.assetCard4}>
                  <div className={styles.previewArea4}>
                    <img
                      src="../image/ms75iyle-qbjxkgn.svg"
                      className={styles.image}
                    />
                    <div className={styles.frame5}>
                      <p className={styles.usedIn}>Used in</p>
                      <p className={styles.runningFormTips}>Summer Sol</p>
                    </div>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.heroBannerPng}>logo-dark.svg</p>
                    <p className={styles.a2MinsAgo}>3 days ago</p>
                  </div>
                </div>
                <div className={styles.assetCard2}>
                  <div className={styles.previewArea2}>
                    <img
                      src="../image/ms75iyle-8m4copb.svg"
                      className={styles.image}
                    />
                    <div className={styles.frame2}>
                      <p className={styles.unused}>Unused</p>
                    </div>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.heroBannerPng}>notes.txt</p>
                    <p className={styles.a2MinsAgo}>Last week</p>
                  </div>
                </div>
                <div className={styles.assetCard5}>
                  <div className={styles.previewArea5}>
                    <img
                      src="../image/ms75iyle-vty7bh4.svg"
                      className={styles.image}
                    />
                    <div className={styles.frame6}>
                      <p className={styles.usedIn}>Used in</p>
                      <p className={styles.runningFormTips}>Community</p>
                    </div>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.heroBannerPng}>brand-kit.pdf</p>
                    <p className={styles.a2MinsAgo}>Last week</p>
                  </div>
                </div>
                <div className={styles.assetCard2}>
                  <div className={styles.previewArea2}>
                    <img
                      src="../image/ms75iyle-8m4copb.svg"
                      className={styles.image}
                    />
                    <div className={styles.frame2}>
                      <p className={styles.unused}>Unused</p>
                    </div>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.heroBannerPng}>campaign-deck.pptx</p>
                    <p className={styles.a2MinsAgo}>2 weeks ago</p>
                  </div>
                </div>
              </div>
              <div className={styles.frame10}>
                <div className={styles.assetCard6}>
                  <div className={styles.previewArea6}>
                    <img
                      src="../image/ms75iyle-nyfor56.svg"
                      className={styles.image}
                    />
                    <div className={styles.frame8}>
                      <p className={styles.usedIn}>Used in</p>
                      <p className={styles.runningFormTips}>Back to School</p>
                    </div>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.heroBannerPng}>promo-video.mp4</p>
                    <p className={styles.a2MinsAgo}>2 weeks ago</p>
                  </div>
                </div>
                <div className={styles.assetCard2}>
                  <div className={styles.previewArea2}>
                    <img
                      src="../image/ms75iyle-vty7bh4.svg"
                      className={styles.image}
                    />
                    <div className={styles.frame2}>
                      <p className={styles.unused}>Unused</p>
                    </div>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.heroBannerPng}>style-guide.pdf</p>
                    <p className={styles.a2MinsAgo}>3 weeks ago</p>
                  </div>
                </div>
                <div className={styles.assetCard7}>
                  <div className={styles.previewArea7}>
                    <img
                      src="../image/ms75iyle-qbjxkgn.svg"
                      className={styles.image}
                    />
                    <div className={styles.frame9}>
                      <p className={styles.usedIn}>Used in</p>
                      <p className={styles.runningFormTips}>Athlete Profile</p>
                    </div>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.heroBannerPng}>cover-art.png</p>
                    <p className={styles.a2MinsAgo}>Last month</p>
                  </div>
                </div>
                <div className={styles.assetCard2}>
                  <div className={styles.previewArea2}>
                    <img
                      src="../image/ms75iyle-vbumhuq.svg"
                      className={styles.image}
                    />
                    <div className={styles.frame2}>
                      <p className={styles.unused}>Unused</p>
                    </div>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.heroBannerPng}>raw-footage.mov</p>
                    <p className={styles.a2MinsAgo}>Last month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <p className={styles.cancel}>Cancel</p>
        <div className={styles.primaryBtn}>
          <p className={styles.upload2}>Upload</p>
        </div>
      </div>
    </div>
  );
}

export default Component;
