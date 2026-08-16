import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.auditWizardStep2}>
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
            <img src="../image/ms7c0oyh-kzj61pa.svg" className={styles.icon} />
            <div className={styles.container3}>
              <p className={styles.dashboard}>Dashboard</p>
            </div>
          </div>
          <div className={styles.sidebarNavigationIte2}>
            <img src="../image/ms7c0oyh-e0wze0a.svg" className={styles.icon} />
            <div className={styles.container4}>
              <p className={styles.dashboard}>Projects</p>
            </div>
          </div>
          <div className={styles.sidebarNavigationIte2}>
            <img src="../image/ms7c0oyh-cmlr77t.svg" className={styles.icon} />
            <div className={styles.container4}>
              <p className={styles.dashboard}>Brand Kit</p>
            </div>
          </div>
          <div className={styles.sidebarNavigationIte3}>
            <img src="../image/ms7c0oyh-4nu9vq5.svg" className={styles.icon} />
            <div className={styles.container5}>
              <p className={styles.dashboard2}>Audits</p>
            </div>
            <div className={styles.text2} />
          </div>
          <div className={styles.sidebarNavigationIte2}>
            <img src="../image/ms7c0oyh-h9y88p1.svg" className={styles.icon} />
            <div className={styles.container4}>
              <p className={styles.dashboard}>Writer Profiles</p>
            </div>
          </div>
          <div className={styles.sidebarNavigationIte2}>
            <img src="../image/ms7c0oyh-1mpv7qv.svg" className={styles.icon} />
            <div className={styles.container4}>
              <p className={styles.dashboard}>Resources</p>
            </div>
          </div>
          <div className={styles.sidebarNavigationIte2}>
            <img src="../image/ms7c0oyh-lw3iw7x.svg" className={styles.icon} />
            <div className={styles.container4}>
              <p className={styles.dashboard}>Templates</p>
            </div>
          </div>
          <div className={styles.sidebarNavigationIte4}>
            <img src="../image/ms7c0oyh-jz69wox.svg" className={styles.icon} />
            <div className={styles.container4}>
              <p className={styles.dashboard}>Settings</p>
            </div>
          </div>
        </div>
        <div className={styles.buttonCollapseSideba}>
          <img src="../image/ms7c0oyh-s6ow6dn.svg" className={styles.icon2} />
          <div className={styles.container6}>
            <p className={styles.collapse}>Collapse</p>
          </div>
        </div>
      </div>
      <div className={styles.frame7}>
        <div className={styles.frame}>
          <p className={styles.analyzingProfile}>Analyzing Profile</p>
          <p className={styles.analysisStep2Of4}>Analysis step 2 of 4</p>
        </div>
        <div className={styles.stepperBar}>
          <div className={styles.stepperStepperItem}>
            <div className={styles.container7}>
              <img src="../image/ms7c0oyh-22kyijx.svg" className={styles.icon3} />
            </div>
            <p className={styles.finishedStep}>Input profile</p>
            <div className={styles.line} />
          </div>
          <div className={styles.stepperStepperItem2}>
            <div className={styles.container8}>
              <p className={styles.a1}>2</p>
            </div>
            <p className={styles.currentStep}>processing</p>
            <div className={styles.line2} />
          </div>
          <div className={styles.stepperStepperItem3}>
            <div className={styles.container9}>
              <p className={styles.a12}>3</p>
            </div>
            <p className={styles.nextSteps}>Audit Results</p>
          </div>
        </div>
        <div className={styles.frame6}>
          <div className={styles.platformAnalysisList}>
            <div className={styles.platformRow}>
              <div className={styles.left}>
                <div className={styles.icon4}>
                  <img
                    src="../image/ms7c0oyi-vfvotai.svg"
                    className={styles.icon}
                  />
                </div>
                <p className={styles.label}>Amrit Yoga YouTube Channel</p>
              </div>
              <div className={styles.loadingIcon}>
                <img
                  src="../image/ms7c0oyi-5gsyy3b.svg"
                  className={styles.spinner}
                />
              </div>
            </div>
            <div className={styles.platformRow2}>
              <div className={styles.left2}>
                <div className={styles.instagram}>
                  <div className={styles.vector} />
                </div>
                <p className={styles.label}>Amrit Yoga Instagram</p>
              </div>
              <div className={styles.loadingIcon}>
                <img
                  src="../image/ms7c0oyi-5gsyy3b.svg"
                  className={styles.spinner}
                />
              </div>
            </div>
            <div className={styles.platformRow}>
              <div className={styles.left}>
                <div className={styles.icon4}>
                  <img
                    src="../image/ms7c0oyi-hxlo4eg.svg"
                    className={styles.icon}
                  />
                </div>
                <p className={styles.label}>Amrit Yoga Facebook</p>
              </div>
              <div className={styles.loadingIcon}>
                <img
                  src="../image/ms7c0oyi-5gsyy3b.svg"
                  className={styles.spinner}
                />
              </div>
            </div>
          </div>
          <div className={styles.frame3}>
            <div className={styles.frame2}>
              <p className={styles.a42158}>42 / 158</p>
            </div>
            <p className={styles.postsImported}>posts imported</p>
          </div>
          <div className={styles.frame4}>
            <p className={styles.scanningAndClassifyi}>
              Scanning and classifying profile content
            </p>
            <p className={styles.weRePullingTheLast15}>
              We're pulling the last 158 posts from your Instagram profile and
              categorizing them by engagement and topic.
            </p>
          </div>
          <div className={styles.frame5}>
            <p className={styles.cancelAnalysis}>Cancel Analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
