import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.resourcesPageV1}>
      <div className={styles.sidebar}>
        <div className={styles.container2}>
          <div className={styles.text}>
            <p className={styles.o}>O</p>
          </div>
          <div className={styles.container}>
            <p className={styles.orcaru}>Orcaru</p>
          </div>
        </div>
        <div className={styles.navigation}>
          <div className={styles.sidebarNavigationIte}>
            <img src="../image/ms30yebi-b8g5p7y.svg" className={styles.icon} />
            <div className={styles.container3}>
              <p className={styles.dashboard}>Dashboard</p>
            </div>
          </div>
          <div className={styles.sidebarNavigationIte2}>
            <img src="../image/ms30yebi-7s19xfu.svg" className={styles.icon} />
            <div className={styles.container4}>
              <p className={styles.dashboard}>Projects</p>
            </div>
          </div>
          <div className={styles.sidebarNavigationIte2}>
            <img src="../image/ms30yebi-h053uek.svg" className={styles.icon} />
            <div className={styles.container4}>
              <p className={styles.dashboard}>Brand Kit</p>
            </div>
          </div>
          <div className={styles.sidebarNavigationIte2}>
            <img src="../image/ms30yebi-gdtpbyn.svg" className={styles.icon} />
            <div className={styles.container4}>
              <p className={styles.dashboard}>Audits</p>
            </div>
          </div>
          <div className={styles.sidebarNavigationIte2}>
            <img src="../image/ms30yebi-ce2o6fs.svg" className={styles.icon} />
            <div className={styles.container4}>
              <p className={styles.dashboard}>Writer Profiles</p>
            </div>
          </div>
          <div className={styles.sidebarNavigationIte3}>
            <img src="../image/ms30yebi-el68gox.svg" className={styles.icon} />
            <div className={styles.container5}>
              <p className={styles.dashboard2}>Resources</p>
            </div>
            <div className={styles.text2} />
          </div>
          <div className={styles.sidebarNavigationIte2}>
            <img src="../image/ms30yebi-mrvikgz.svg" className={styles.icon} />
            <div className={styles.container4}>
              <p className={styles.dashboard}>Templates</p>
            </div>
          </div>
          <div className={styles.sidebarNavigationIte4}>
            <img src="../image/ms30yebi-j8a671f.svg" className={styles.icon} />
            <div className={styles.container4}>
              <p className={styles.dashboard}>Settings</p>
            </div>
          </div>
        </div>
        <div className={styles.buttonCollapseSideba}>
          <img src="../image/ms30yebi-zf5nf80.svg" className={styles.icon2} />
          <div className={styles.container6}>
            <p className={styles.collapse}>Collapse</p>
          </div>
        </div>
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.header}>
          <div className={styles.titleContent}>
            <p className={styles.resourceLibrary}>Resource Library</p>
            <p className={styles.uploadFilesAndUrLsTh}>
              Upload files and URLs that can be used as reference for content
              generation
            </p>
          </div>
          <div className={styles.addResourcesButton}>
            <img src="../image/ms30yebi-r4g1van.svg" className={styles.icon} />
            <p className={styles.addResources}>Add Resources</p>
          </div>
        </div>
        <div className={styles.searchFilterBar}>
          <div className={styles.searchInputContainer}>
            <img src="../image/ms30yebi-ekk3rmf.svg" className={styles.icon} />
            <p className={styles.searchResources}>Search resources...</p>
          </div>
          <div className={styles.filters}>
            <div className={styles.allTab}>
              <p className={styles.all8}>All (8)</p>
            </div>
            <p className={styles.videos2}>Videos (2)</p>
            <p className={styles.videos2}>Documents (2)</p>
            <p className={styles.videos2}>Images (4)</p>
          </div>
        </div>
        <div className={styles.cardGrid}>
          <div className={styles.resourceCard}>
            <div className={styles.imageFrame}>
              <img
                src="../image/ms30yec2-s0yand5.png"
                className={styles.videoBackground}
              />
              <div className={styles.typeBadge}>
                <p className={styles.video}>video</p>
              </div>
            </div>
            <div className={styles.contentInfo}>
              <div className={styles.titleRow}>
                <p className={styles.yogaSessionRecording}>
                  Yoga Session Recording.mp4
                </p>
                <div className={styles.cardMenu}>
                  <img
                    src="../image/ms30yebi-y4xexhe.svg"
                    className={styles.moreHorizontal}
                  />
                </div>
              </div>
              <div className={styles.metadata}>
                <div className={styles.sizeAndLength}>
                  <p className={styles.size245Mb}>Size: 245 MB</p>
                  <p className={styles.size245Mb}>45:32</p>
                </div>
                <div className={styles.uploadDate}>
                  <div className={styles.clockIcon}>
                    <div className={styles.vector} />
                  </div>
                  <p className={styles.size245Mb}>Uploaded 2 hours ago</p>
                </div>
              </div>
            </div>
            <div className={styles.resourceLinkedConten}>
              <div className={styles.avatarStackContainer}>
                <div className={styles.avatarWrapper}>
                  <img
                    src="../image/ms30yec2-bf5cexz.png"
                    className={styles.socialPreview}
                  />
                </div>
                <div className={styles.avatarWrapper2}>
                  <img
                    src="../image/ms30yec2-5i5u3f9.png"
                    className={styles.socialPreview}
                  />
                </div>
                <div className={styles.avatarWrapper2}>
                  <img
                    src="../image/ms30yec2-bfm8lze.png"
                    className={styles.socialPreview}
                  />
                </div>
                <div className={styles.avatarWrapper2}>
                  <img
                    src="../image/ms30yec2-7ih97gu.png"
                    className={styles.socialPreview}
                  />
                </div>
                <div className={styles.overflowBadge}>
                  <p className={styles.a3}>+3</p>
                </div>
              </div>
              <p className={styles.a7PostsCreated}>7 posts created</p>
            </div>
          </div>
          <div className={styles.resourceCard2}>
            <div className={styles.imageFrame2}>
              <div className={styles.thumbImg} />
              <div className={styles.badgeContainer}>
                <div className={styles.typeBadge2}>
                  <p className={styles.video}>document</p>
                </div>
              </div>
            </div>
            <div className={styles.contentInfo}>
              <div className={styles.titleRow}>
                <p className={styles.yogaSessionRecording}>
                  Brand Guidelines 2026.pdf
                </p>
                <div className={styles.cardMenu}>
                  <img
                    src="../image/ms30yebi-y4xexhe.svg"
                    className={styles.moreHorizontal}
                  />
                </div>
              </div>
              <div className={styles.metadata}>
                <div className={styles.sizeAndLength}>
                  <p className={styles.size245Mb}>Size: 2.1 MB</p>
                  <p className={styles.size245Mb}>32 pages</p>
                </div>
                <div className={styles.uploadDate}>
                  <div className={styles.clockIcon}>
                    <div className={styles.vector} />
                  </div>
                  <p className={styles.size245Mb}>Uploaded 3 days ago</p>
                </div>
              </div>
            </div>
            <div className={styles.resourceLinkedConten2}>
              <p className={styles.noContentCreated}>No content created</p>
            </div>
          </div>
          <div className={styles.resourceCard3}>
            <div className={styles.imageFrame3}>
              <div className={styles.thumbImg} />
              <div className={styles.badgeContainer2}>
                <div className={styles.typeBadge3}>
                  <p className={styles.video}>text</p>
                </div>
              </div>
            </div>
            <div className={styles.contentInfo}>
              <div className={styles.titleRow}>
                <p className={styles.yogaSessionRecording}>Blog Posts Collection</p>
                <div className={styles.cardMenu}>
                  <img
                    src="../image/ms30yebi-y4xexhe.svg"
                    className={styles.moreHorizontal}
                  />
                </div>
              </div>
              <div className={styles.metadata}>
                <div className={styles.sizeAndLength}>
                  <p className={styles.size245Mb}>Size: 840 KB</p>
                  <p className={styles.size245Mb}>12,500 words</p>
                </div>
                <div className={styles.uploadDate}>
                  <div className={styles.clockIcon}>
                    <div className={styles.vector} />
                  </div>
                  <p className={styles.size245Mb}>Uploaded 1 week ago</p>
                </div>
              </div>
            </div>
            <div className={styles.resourceLinkedConten2}>
              <p className={styles.noContentCreated}>No content created</p>
            </div>
          </div>
          <div className={styles.resourceCard4}>
            <div className={styles.imageFrame4}>
              <img
                src="../image/ms30yec2-bsxw9cl.png"
                className={styles.thumbImg2}
              />
              <div className={styles.badgeContainer3}>
                <div className={styles.typeBadge4}>
                  <p className={styles.video}>image</p>
                </div>
              </div>
            </div>
            <div className={styles.contentInfo}>
              <div className={styles.titleRow}>
                <p className={styles.yogaSessionRecording}>
                  Air Max Launch Graphic
                </p>
                <div className={styles.cardMenu}>
                  <img
                    src="../image/ms30yebi-y4xexhe.svg"
                    className={styles.moreHorizontal}
                  />
                </div>
              </div>
              <div className={styles.metadata}>
                <div className={styles.sizeAndLength}>
                  <p className={styles.size245Mb}>Size: 1.8 MB</p>
                  <p className={styles.size245Mb}>2400×1600</p>
                </div>
                <div className={styles.uploadDate}>
                  <div className={styles.clockIcon}>
                    <div className={styles.vector} />
                  </div>
                  <p className={styles.size245Mb}>Uploaded 3 weeks ago</p>
                </div>
              </div>
            </div>
            <div className={styles.resourceLinkedConten}>
              <div className={styles.avatarStackContainer}>
                <div className={styles.avatarWrapper}>
                  <img
                    src="../image/ms30yec2-bf5cexz.png"
                    className={styles.socialPreview}
                  />
                </div>
                <div className={styles.avatarWrapper2}>
                  <img
                    src="../image/ms30yec2-5i5u3f9.png"
                    className={styles.socialPreview}
                  />
                </div>
                <div className={styles.avatarWrapper2}>
                  <img
                    src="../image/ms30yec2-bfm8lze.png"
                    className={styles.socialPreview}
                  />
                </div>
                <div className={styles.avatarWrapper2}>
                  <img
                    src="../image/ms30yec2-7ih97gu.png"
                    className={styles.socialPreview}
                  />
                </div>
                <div className={styles.overflowBadge}>
                  <p className={styles.a3}>+3</p>
                </div>
              </div>
              <p className={styles.a7PostsCreated}>7 posts created</p>
            </div>
          </div>
          <div className={styles.resourceCard}>
            <div className={styles.imageFrame}>
              <img
                src="../image/ms30yec2-s0yand5.png"
                className={styles.videoBackground}
              />
              <div className={styles.typeBadge}>
                <p className={styles.video}>video</p>
              </div>
            </div>
            <div className={styles.contentInfo}>
              <div className={styles.titleRow}>
                <p className={styles.yogaSessionRecording}>
                  Yoga Session Recording.mp4
                </p>
                <div className={styles.cardMenu}>
                  <img
                    src="../image/ms30yebi-y4xexhe.svg"
                    className={styles.moreHorizontal}
                  />
                </div>
              </div>
              <div className={styles.metadata}>
                <div className={styles.sizeAndLength}>
                  <p className={styles.size245Mb}>Size: 245 MB</p>
                  <p className={styles.size245Mb}>45:32</p>
                </div>
                <div className={styles.uploadDate}>
                  <div className={styles.clockIcon}>
                    <div className={styles.vector} />
                  </div>
                  <p className={styles.size245Mb}>Uploaded 2 hours ago</p>
                </div>
              </div>
            </div>
            <div className={styles.resourceLinkedConten}>
              <div className={styles.avatarStackContainer}>
                <div className={styles.avatarWrapper}>
                  <img
                    src="../image/ms30yec2-bf5cexz.png"
                    className={styles.socialPreview}
                  />
                </div>
                <div className={styles.avatarWrapper2}>
                  <img
                    src="../image/ms30yec2-5i5u3f9.png"
                    className={styles.socialPreview}
                  />
                </div>
                <div className={styles.avatarWrapper2}>
                  <img
                    src="../image/ms30yec2-bfm8lze.png"
                    className={styles.socialPreview}
                  />
                </div>
                <div className={styles.avatarWrapper2}>
                  <img
                    src="../image/ms30yec2-7ih97gu.png"
                    className={styles.socialPreview}
                  />
                </div>
                <div className={styles.overflowBadge}>
                  <p className={styles.a3}>+3</p>
                </div>
              </div>
              <p className={styles.a7PostsCreated}>7 posts created</p>
            </div>
          </div>
          <div className={styles.resourceCard3}>
            <div className={styles.imageFrame3}>
              <div className={styles.thumbImg} />
              <div className={styles.badgeContainer2}>
                <div className={styles.typeBadge3}>
                  <p className={styles.video}>text</p>
                </div>
              </div>
            </div>
            <div className={styles.contentInfo}>
              <div className={styles.titleRow}>
                <p className={styles.yogaSessionRecording}>Blog Posts Collection</p>
                <div className={styles.cardMenu}>
                  <img
                    src="../image/ms30yebi-y4xexhe.svg"
                    className={styles.moreHorizontal}
                  />
                </div>
              </div>
              <div className={styles.metadata}>
                <div className={styles.sizeAndLength}>
                  <p className={styles.size245Mb}>Size: 840 KB</p>
                  <p className={styles.size245Mb}>12,500 words</p>
                </div>
                <div className={styles.uploadDate}>
                  <div className={styles.clockIcon}>
                    <div className={styles.vector} />
                  </div>
                  <p className={styles.size245Mb}>Uploaded 1 week ago</p>
                </div>
              </div>
            </div>
            <div className={styles.resourceLinkedConten2}>
              <p className={styles.noContentCreated}>No content created</p>
            </div>
          </div>
          <div className={styles.resourceCard3}>
            <div className={styles.imageFrame3}>
              <div className={styles.thumbImg} />
              <div className={styles.badgeContainer2}>
                <div className={styles.typeBadge3}>
                  <p className={styles.video}>text</p>
                </div>
              </div>
            </div>
            <div className={styles.contentInfo}>
              <div className={styles.titleRow}>
                <p className={styles.yogaSessionRecording}>Blog Posts Collection</p>
                <div className={styles.cardMenu}>
                  <img
                    src="../image/ms30yebi-y4xexhe.svg"
                    className={styles.moreHorizontal}
                  />
                </div>
              </div>
              <div className={styles.metadata}>
                <div className={styles.sizeAndLength}>
                  <p className={styles.size245Mb}>Size: 840 KB</p>
                  <p className={styles.size245Mb}>12,500 words</p>
                </div>
                <div className={styles.uploadDate}>
                  <div className={styles.clockIcon}>
                    <div className={styles.vector} />
                  </div>
                  <p className={styles.size245Mb}>Uploaded 1 week ago</p>
                </div>
              </div>
            </div>
            <div className={styles.resourceLinkedConten2}>
              <p className={styles.noContentCreated}>No content created</p>
            </div>
          </div>
          <div className={styles.resourceCard}>
            <div className={styles.imageFrame}>
              <img
                src="../image/ms30yec2-s0yand5.png"
                className={styles.videoBackground}
              />
              <div className={styles.typeBadge}>
                <p className={styles.video}>video</p>
              </div>
            </div>
            <div className={styles.contentInfo}>
              <div className={styles.titleRow}>
                <p className={styles.yogaSessionRecording}>
                  Yoga Session Recording.mp4
                </p>
                <div className={styles.cardMenu}>
                  <img
                    src="../image/ms30yebi-y4xexhe.svg"
                    className={styles.moreHorizontal}
                  />
                </div>
              </div>
              <div className={styles.metadata}>
                <div className={styles.sizeAndLength}>
                  <p className={styles.size245Mb}>Size: 245 MB</p>
                  <p className={styles.size245Mb}>45:32</p>
                </div>
                <div className={styles.uploadDate}>
                  <div className={styles.clockIcon}>
                    <div className={styles.vector} />
                  </div>
                  <p className={styles.size245Mb}>Uploaded 2 hours ago</p>
                </div>
              </div>
            </div>
            <div className={styles.resourceLinkedConten}>
              <div className={styles.avatarStackContainer}>
                <div className={styles.avatarWrapper}>
                  <img
                    src="../image/ms30yec2-bf5cexz.png"
                    className={styles.socialPreview}
                  />
                </div>
                <div className={styles.avatarWrapper2}>
                  <img
                    src="../image/ms30yec2-5i5u3f9.png"
                    className={styles.socialPreview}
                  />
                </div>
                <div className={styles.avatarWrapper2}>
                  <img
                    src="../image/ms30yec2-bfm8lze.png"
                    className={styles.socialPreview}
                  />
                </div>
                <div className={styles.avatarWrapper2}>
                  <img
                    src="../image/ms30yec2-7ih97gu.png"
                    className={styles.socialPreview}
                  />
                </div>
                <div className={styles.overflowBadge}>
                  <p className={styles.a3}>+3</p>
                </div>
              </div>
              <p className={styles.a7PostsCreated}>7 posts created</p>
            </div>
          </div>
          <div className={styles.resourceCard2}>
            <div className={styles.imageFrame2}>
              <div className={styles.thumbImg} />
              <div className={styles.badgeContainer}>
                <div className={styles.typeBadge2}>
                  <p className={styles.video}>document</p>
                </div>
              </div>
            </div>
            <div className={styles.contentInfo}>
              <div className={styles.titleRow}>
                <p className={styles.yogaSessionRecording}>
                  Brand Guidelines 2026.pdf
                </p>
                <div className={styles.cardMenu}>
                  <img
                    src="../image/ms30yebi-y4xexhe.svg"
                    className={styles.moreHorizontal}
                  />
                </div>
              </div>
              <div className={styles.metadata}>
                <div className={styles.sizeAndLength}>
                  <p className={styles.size245Mb}>Size: 2.1 MB</p>
                  <p className={styles.size245Mb}>32 pages</p>
                </div>
                <div className={styles.uploadDate}>
                  <div className={styles.clockIcon}>
                    <div className={styles.vector} />
                  </div>
                  <p className={styles.size245Mb}>Uploaded 3 days ago</p>
                </div>
              </div>
            </div>
            <div className={styles.resourceLinkedConten2}>
              <p className={styles.noContentCreated}>No content created</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
