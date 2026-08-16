import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.auditWizardStep1Mult}>
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
            <img src="../image/ms78y3b3-ujkw7et.svg" className={styles.icon} />
            <div className={styles.container3}>
              <p className={styles.dashboard}>Dashboard</p>
            </div>
          </div>
          <div className={styles.sidebarNavigationIte2}>
            <img src="../image/ms78y3b3-ifxi7np.svg" className={styles.icon} />
            <div className={styles.container4}>
              <p className={styles.dashboard}>Projects</p>
            </div>
          </div>
          <div className={styles.sidebarNavigationIte2}>
            <img src="../image/ms78y3b3-o7j3mor.svg" className={styles.icon} />
            <div className={styles.container4}>
              <p className={styles.dashboard}>Brand Kit</p>
            </div>
          </div>
          <div className={styles.sidebarNavigationIte3}>
            <img src="../image/ms78y3b3-5lupqgc.svg" className={styles.icon} />
            <div className={styles.container5}>
              <p className={styles.dashboard2}>Audits</p>
            </div>
            <div className={styles.text2} />
          </div>
          <div className={styles.sidebarNavigationIte2}>
            <img src="../image/ms78y3b3-a8r9box.svg" className={styles.icon} />
            <div className={styles.container4}>
              <p className={styles.dashboard}>Writer Profiles</p>
            </div>
          </div>
          <div className={styles.sidebarNavigationIte2}>
            <img src="../image/ms78y3b3-prilba6.svg" className={styles.icon} />
            <div className={styles.container4}>
              <p className={styles.dashboard}>Resources</p>
            </div>
          </div>
          <div className={styles.sidebarNavigationIte2}>
            <img src="../image/ms78y3b3-rdc28uz.svg" className={styles.icon} />
            <div className={styles.container4}>
              <p className={styles.dashboard}>Templates</p>
            </div>
          </div>
          <div className={styles.sidebarNavigationIte4}>
            <img src="../image/ms78y3b3-zeyf1ph.svg" className={styles.icon} />
            <div className={styles.container4}>
              <p className={styles.dashboard}>Settings</p>
            </div>
          </div>
        </div>
        <div className={styles.buttonCollapseSideba}>
          <img src="../image/ms78y3b3-xgg5g30.svg" className={styles.icon2} />
          <div className={styles.container6}>
            <p className={styles.collapse}>Collapse</p>
          </div>
        </div>
      </div>
      <div className={styles.mainWorkspace}>
        <div className={styles.containerInner}>
          <div className={styles.titleBlock}>
            <p className={styles.newSocialMediaAudit}>New Social Media Audit</p>
            <p className={styles.analysisStep1Of4}>Analysis step 1 of 4</p>
          </div>
          <div className={styles.stepperBar}>
            <div className={styles.stepperStepperItem}>
              <div className={styles.container7}>
                <p className={styles.a1}>1</p>
              </div>
              <p className={styles.currentStep}>Input Profile</p>
              <div className={styles.line} />
            </div>
            <div className={styles.stepperStepperItem2}>
              <div className={styles.container8}>
                <p className={styles.a12}>2</p>
              </div>
              <p className={styles.nextSteps}>Processing</p>
              <div className={styles.line} />
            </div>
            <div className={styles.stepperStepperItem3}>
              <div className={styles.container8}>
                <p className={styles.a12}>3</p>
              </div>
              <p className={styles.nextSteps}>Audit Results</p>
            </div>
          </div>
          <div className={styles.formContentRow}>
            <div className={styles.formSide}>
              <div className={styles.analysisPeriod2}>
                <p className={styles.analysisPeriod}>Analysis Period</p>
                <div className={styles.periodSelectorGrid}>
                  <div className={styles.frame}>
                    <p className={styles.a1Month}>1 Month</p>
                  </div>
                  <div className={styles.frame2}>
                    <p className={styles.a3Months}>3 Months</p>
                  </div>
                  <div className={styles.frame}>
                    <p className={styles.a1Month}>6 Months</p>
                  </div>
                  <div className={styles.projectDefaultIndica}>
                    <div className={styles.text3} />
                    <p className={styles.modified}>Modified</p>
                    <div className={styles.autoWrapper}>
                      <img
                        src="../image/ms78y3b3-ek7prfr.png"
                        className={styles.icon3}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.profilesSection}>
                <p className={styles.analysisPeriod}>Social Media Profiles</p>
                <div className={styles.multiplePlatformRows}>
                  <div className={styles.profileRow1}>
                    <div className={styles.platformDropdown}>
                      <div className={styles.instagram}>
                        <div className={styles.vector} />
                      </div>
                      <p className={styles.instagram2}>Instagram</p>
                      <img
                        src="../image/ms78y3b3-rvb77z6.svg"
                        className={styles.chevronDown}
                      />
                    </div>
                    <div className={styles.inputField}>
                      <p className={styles.httpsInstagramComFas}>
                        https://instagram.com/fashionbrand_official
                      </p>
                      <div className={styles.removeIconContainer}>
                        <img
                          src="../image/ms78y3b3-f7vem0h.svg"
                          className={styles.chevronDown}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.profileRow2}>
                    <div className={styles.platformDropdown2}>
                      <div className={styles.youTubeIconWrapper}>
                        <img
                          src="../image/ms78y3b3-63jsqvx.svg"
                          className={styles.youtube}
                        />
                      </div>
                      <p className={styles.instagram2}>YouTube</p>
                      <img
                        src="../image/ms78y3b3-rvb77z6.svg"
                        className={styles.chevronDown}
                      />
                    </div>
                    <div className={styles.inputField2}>
                      <p className={styles.httpsInstagramComFas}>
                        https://youtube.com/@fashionbrand
                      </p>
                      <div className={styles.removeIconContainer}>
                        <img
                          src="../image/ms78y3b3-f7vem0h.svg"
                          className={styles.chevronDown}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.profileRow3}>
                    <div className={styles.platformDropdown2}>
                      <div className={styles.youTubeIconWrapper}>
                        <img
                          src="../image/ms78y3b3-qbrca2p.svg"
                          className={styles.youtube}
                        />
                      </div>
                      <p className={styles.instagram2}>TikTok</p>
                      <img
                        src="../image/ms78y3b3-rvb77z6.svg"
                        className={styles.chevronDown}
                      />
                    </div>
                    <div className={styles.inputField3}>
                      <p className={styles.httpsTiktokComUserna}>
                        https://tiktok.com/username
                      </p>
                      <div className={styles.removeIconContainer}>
                        <img
                          src="../image/ms78y3b3-f7vem0h.svg"
                          className={styles.chevronDown}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.addActionRow}>
                  <img
                    src="../image/ms78y3b3-ts816es.svg"
                    className={styles.youtube}
                  />
                  <p className={styles.a3Months}>Add Another Platform</p>
                </div>
              </div>
              <div className={styles.blogWebsitesSection}>
                <p className={styles.analysisPeriod}>Blog / Websites</p>
                <div className={styles.blogWebsiteRow}>
                  <div className={styles.typeDropdown}>
                    <p className={styles.instagram2}>Website</p>
                    <img
                      src="../image/ms78y3b3-rvb77z6.svg"
                      className={styles.chevronDown}
                    />
                  </div>
                  <div className={styles.urlInput}>
                    <p className={styles.httpsTiktokComUserna}>
                      https://example.com
                    </p>
                  </div>
                </div>
                <div className={styles.addActionRow2}>
                  <img
                    src="../image/ms78y3b3-ts816es.svg"
                    className={styles.youtube}
                  />
                  <p className={styles.a3Months}>+ Add Another</p>
                </div>
              </div>
              <div className={styles.campaignNameSection}>
                <p className={styles.analysisPeriod}>Campaign Name (Optional)</p>
                <div className={styles.frame3}>
                  <p className={styles.enterAnAuditNameToId}>
                    Enter an audit name to identify this report...
                  </p>
                </div>
              </div>
              <div className={styles.actionButtons}>
                <div className={styles.frame4}>
                  <p className={styles.a1Month}>Cancel</p>
                </div>
                <div className={styles.frame5}>
                  <p className={styles.nextStep}>Next Step</p>
                </div>
              </div>
            </div>
            <div className={styles.whyAuditCard}>
              <div className={styles.content}>
                <p className={styles.whyAudit}>Why Audit?</p>
                <p className={styles.ourAiAuditEngineAnal}>
                  Our AI audit engine analyzes content performance, engagement
                  patterns, and competitor benchmarks to give you a clear roadmap
                  for growth.
                </p>
              </div>
              <div className={styles.bullets}>
                <div className={styles.bullet1}>
                  <img
                    src="../image/ms78y3b3-ncp18la.svg"
                    className={styles.icon}
                  />
                  <p className={styles.discoverYourBestPerf}>
                    Discover your best performing content themes.
                  </p>
                </div>
                <div className={styles.bullet1}>
                  <img
                    src="../image/ms78y3b3-ncp18la.svg"
                    className={styles.icon}
                  />
                  <p className={styles.discoverYourBestPerf}>
                    Identify optimal posting times for your audience.
                  </p>
                </div>
                <div className={styles.bullet1}>
                  <img
                    src="../image/ms78y3b3-ncp18la.svg"
                    className={styles.icon}
                  />
                  <p className={styles.discoverYourBestPerf}>
                    Generate data-driven content ideas for next month.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
