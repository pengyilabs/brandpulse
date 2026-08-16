import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.posts}>
      <div className={styles.refinedPillDropdownV}>
        <div className={styles.modalCard}>
          <div className={styles.header}>
            <p className={styles.refinedRightAlignedP}>
              Refined: Right-Aligned Pill Dropdown
            </p>
            <p className={styles.adjustPublishingDeta}>
              Adjust publishing details and view local modifications.
            </p>
          </div>
          <div className={styles.line} />
          <div className={styles.formFields}>
            <div className={styles.fieldTitle}>
              <div className={styles.labelRow}>
                <p className={styles.title}>Title*</p>
                <div className={styles.pillModified}>
                  <div className={styles.ellipse} />
                  <p className={styles.modified}>Modified ▾</p>
                </div>
              </div>
              <div className={styles.inputContainer}>
                <p className={styles.a5EssentialTrainingT}>
                  5 Essential Training Tips for Summer Running
                </p>
              </div>
              <p className={styles.modifiedFromDefaultR}>
                Modified from default: Running Form Tips for Beginners
              </p>
              <div className={styles.dropdownMenu}>
                <div className={styles.menuItemRegenerate}>
                  <img
                    src="../image/msda0hek-ei2niy3.svg"
                    className={styles.sparkles}
                  />
                  <p className={styles.regenerateWithAi}>Regenerate with AI</p>
                </div>
                <div className={styles.menuItemReset}>
                  <img
                    src="../image/msda0hek-axybtmw.svg"
                    className={styles.sparkles}
                  />
                  <p className={styles.resetToDefault}>Reset to Default</p>
                </div>
              </div>
            </div>
            <div className={styles.fieldPublishDate}>
              <div className={styles.labelRow2}>
                <p className={styles.title}>Publish Date</p>
                <div className={styles.pillProjectDefault}>
                  <div className={styles.ellipse2} />
                  <p className={styles.projectDefault}>Project Default ▾</p>
                </div>
              </div>
              <div className={styles.inputContainer2}>
                <p className={styles.june202026}>June 20, 2026</p>
              </div>
              <div className={styles.menuItemRegenerate2}>
                <img
                  src="../image/msda0hek-mdzpkl2.svg"
                  className={styles.sparkles}
                />
                <p className={styles.regenerateWithAi2}>Regenerate with AI</p>
              </div>
            </div>
            <div className={styles.fieldPostContent}>
              <div className={styles.labelRow}>
                <p className={styles.title}>Post Content</p>
                <div className={styles.pillModified}>
                  <div className={styles.ellipse} />
                  <p className={styles.modified}>Modified ▾</p>
                </div>
              </div>
              <div className={styles.inputContainer3}>
                <p className={styles.controlRarelyIdentif}>
                  Control rarely identifies itself honestly. It arrives as planning,
                  as responsibility. It is fear in different clothing. Control does
                  not arrive announcing itself as fear.
                </p>
              </div>
              <p className={styles.modifiedFromDefaultR}>
                Modified from default template content
              </p>
            </div>
            <div className={styles.fieldTags}>
              <div className={styles.labelRow}>
                <p className={styles.title}>Tags</p>
                <div className={styles.pillModified}>
                  <div className={styles.ellipse} />
                  <p className={styles.modified}>Modified ▾</p>
                </div>
              </div>
              <div className={styles.inputContainer4}>
                <div className={styles.badges}>
                  <p className={styles.active}>SummerFit</p>
                </div>
                <div className={styles.badges}>
                  <p className={styles.active}>Running</p>
                </div>
                <div className={styles.badges}>
                  <p className={styles.active}>Wellness</p>
                </div>
              </div>
              <p className={styles.modifiedFromDefaultR}>
                Modified from default tags: #Fitness, #GeneralCoaching
              </p>
            </div>
          </div>
          <div className={styles.line} />
          <div className={styles.actionsRow}>
            <div className={styles.buttonCancel}>
              <p className={styles.cancel}>Cancel</p>
            </div>
            <div className={styles.buttonSave}>
              <p className={styles.saveChanges}>Save Changes</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.modalQaEvaluation}>
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.iconContainer}>
              <img src="../image/msda0hek-o69jyic.svg" className={styles.video} />
            </div>
            <div className={styles.textTitle}>
              <p className={styles.runningFormTips}>Running Form Tips</p>
              <p className={styles.resetToDefault}>Youtube Shorts Clip</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.versionPicker}>
              <p className={styles.version3}>Version 3</p>
              <img
                src="https://via.placeholder.com/10x10"
                className={styles.chevronDown}
              />
            </div>
            <div className={styles.actionPicker}>
              <p className={styles.version3}>Regenerate Content</p>
              <img
                src="https://via.placeholder.com/10x10"
                className={styles.chevronDown}
              />
            </div>
            <div className={styles.badges2}>
              <p className={styles.active2}>QA Evaluation</p>
            </div>
            <div className={styles.xCircle}>
              <div className={styles.vector} />
            </div>
          </div>
        </div>
        <div className={styles.qAStatusBar}>
          <div className={styles.statusDetails}>
            <div className={styles.vector2} />
            <p className={styles.aQaReviewNeeded710Pa}>
              ⚠&nbsp;&nbsp;QA Review Needed&nbsp;&nbsp;·&nbsp;&nbsp;7 / 10
              Passing&nbsp;&nbsp;·&nbsp;&nbsp;3 items to
              resolve&nbsp;&nbsp;·&nbsp;&nbsp;Revision Progress 25%
            </p>
          </div>
          <div className={styles.action}>
            <p className={styles.reviewAll}>Review all</p>
            <img
              src="https://via.placeholder.com/10x10"
              className={styles.chevronDown}
            />
          </div>
        </div>
        <div className={styles.panelContainer}>
          <div className={styles.previewPanel}>
            <p className={styles.preview}>Preview</p>
            <div className={styles.phoneInsideLayout}>
              <div className={styles.topControls}>
                <img
                  src="https://via.placeholder.com/18x18"
                  className={styles.arrowLeft}
                />
                <img
                  src="../image/msda0hek-fmxvdek.svg"
                  className={styles.arrowLeft}
                />
              </div>
              <div className={styles.bottomDetails}>
                <div className={styles.userInfo}>
                  <p className={styles.saveChanges}>@orcaru_fitness</p>
                  <p className={styles.contentIsFearInMotio}>
                    Content is Fear in Motion
                  </p>
                </div>
                <div className={styles.audioLabel}>
                  <img
                    src="../image/msda0hek-ugqnzhw.svg"
                    className={styles.sparkles}
                  />
                  <p className={styles.originalSound}>Original Sound</p>
                </div>
              </div>
            </div>
            <p className={styles.thisIsAnApproximatio}>
              This is an approximation of what your post will look like in the feed.
            </p>
          </div>
          <div className={styles.formSidepanel}>
            <div className={styles.fieldBlock}>
              <div className={styles.frame}>
                <p className={styles.title}>Title*</p>
                <div className={styles.projectDefaultIndica}>
                  <div className={styles.text} />
                  <p className={styles.modified2}>Modified</p>
                  <div className={styles.autoWrapper}>
                    <img
                      src="../image/msda0hek-fyc5xns.png"
                      className={styles.icon}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.inputField}>
                <p className={styles.a5EssentialTrainingT}>
                  5 Essential Training Tips for Summer Running
                </p>
                <div className={styles.resetAction}>
                  <img
                    src="../image/msda0hek-a46xp9m.svg"
                    className={styles.refreshCw}
                  />
                </div>
              </div>
              <p className={styles.modifiedFromProjectD}>
                Modified from project default: Running Form Tips for Beginners
              </p>
            </div>
            <div className={styles.publishRow}>
              <div className={styles.dateBlock}>
                <p className={styles.publishDate}>Publish Date</p>
                <div className={styles.frame2}>
                  <p className={styles.june2020262}>June 20, 2026</p>
                  <img
                    src="../image/msda0hek-195yc9r.svg"
                    className={styles.refreshCw}
                  />
                </div>
              </div>
              <div className={styles.timeBlock}>
                <p className={styles.publishDate}>Publish Time</p>
                <div className={styles.frame3}>
                  <p className={styles.june2020262}>3:00 PM</p>
                  <div className={styles.clock}>
                    <div className={styles.vector3} />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.fieldBlock2}>
              <div className={styles.frame}>
                <p className={styles.title}>Post Content</p>
                <div className={styles.projectDefaultIndica}>
                  <div className={styles.text} />
                  <p className={styles.modified2}>Modified</p>
                  <div className={styles.autoWrapper}>
                    <img
                      src="../image/msda0hek-fyc5xns.png"
                      className={styles.icon}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.inputFieldTextarea}>
                <p className={styles.controlRarelyIdentif2}>
                  Control rarely identifies itself honestly. It arrives as planning,
                  as responsibility. It is fear in different clothing. Control does
                  not arrive announcing itself as fear. It arrives as planning, as
                  preparation, as responsibility, as taking initiative.
                </p>
                <div className={styles.resetAction2}>
                  <img
                    src="../image/msda0hek-ypopuff.svg"
                    className={styles.refreshCw}
                  />
                </div>
              </div>
              <p className={styles.modifiedFromProjectD}>
                Content has been regenerated and differs from project template
              </p>
            </div>
            <div className={styles.tagsFieldBlock}>
              <div className={styles.frame}>
                <p className={styles.title}>Tags</p>
                <div className={styles.projectDefaultIndica}>
                  <div className={styles.text} />
                  <p className={styles.modified2}>Modified</p>
                  <div className={styles.autoWrapper}>
                    <img
                      src="../image/msda0hek-fyc5xns.png"
                      className={styles.icon}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.frame4}>
                <div className={styles.tagsRow}>
                  <div className={styles.badges}>
                    <p className={styles.active}>IAMYoga</p>
                  </div>
                  <div className={styles.badges}>
                    <p className={styles.active}>AmritYoga</p>
                  </div>
                  <div className={styles.badges}>
                    <p className={styles.active}>YogaWisdom</p>
                  </div>
                </div>
                <div className={styles.resetAction}>
                  <img
                    src="../image/msda0hek-bayadqd.svg"
                    className={styles.refreshCw}
                  />
                </div>
              </div>
              <p className={styles.modifiedFromProjectD}>
                Missing recommended tags: #SummerFitChallenge, #CoachApproved
              </p>
            </div>
            <div className={styles.commentsPanel}>
              <div className={styles.line} />
              <div className={styles.commentsTitleStack}>
                <p className={styles.comments}>Comments</p>
                <div className={styles.countPill}>
                  <p className={styles.a2}>2</p>
                </div>
              </div>
              <div className={styles.commentItem}>
                <div className={styles.avatar}>
                  <p className={styles.qB}>QB</p>
                </div>
                <div className={styles.commentContent}>
                  <div className={styles.metaRow}>
                    <p className={styles.title}>QA Bot</p>
                    <p className={styles.a4HAgo}>4h ago</p>
                  </div>
                  <p className={styles.a3ItemsFlaggedForRev}>
                    3 items flagged for review — title deviation, schedule conflict,
                    missing alt text
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.modalRejected}>
        <div className={styles.modalHeader2}>
          <div className={styles.headerLeft}>
            <div className={styles.iconContainer}>
              <img src="../image/msda0hek-hgtcfo4.svg" className={styles.video} />
            </div>
            <div className={styles.textTitle}>
              <p className={styles.runningFormTips}>Running Form Tips</p>
              <p className={styles.resetToDefault}>Youtube Shorts Clip</p>
            </div>
          </div>
          <div className={styles.headerRight2}>
            <div className={styles.versionPicker}>
              <p className={styles.version3}>Version 3</p>
              <img
                src="https://via.placeholder.com/10x10"
                className={styles.chevronDown}
              />
            </div>
            <div className={styles.actionPicker}>
              <p className={styles.version3}>Regenerate Content</p>
              <img
                src="https://via.placeholder.com/10x10"
                className={styles.chevronDown}
              />
            </div>
            <div className={styles.badges3}>
              <p className={styles.rejected}>Rejected</p>
            </div>
            <div className={styles.cTaButton}>
              <p className={styles.saveChanges}>Revise & Resubmit</p>
              <img
                src="https://via.placeholder.com/12x12"
                className={styles.sparkles}
              />
            </div>
            <div className={styles.xCircle}>
              <div className={styles.vector} />
            </div>
          </div>
        </div>
        <div className={styles.rejectedStatusBar}>
          <div className={styles.statusDetails2}>
            <img src="../image/msda0hek-aib15rp.svg" className={styles.refreshCw} />
            <p className={styles.aRejectedBySarahChen}>
              ✕ Rejected by Sarah Chen · Jun 18 — "The content doesn't align with
              our brand voice guidelines. The training tips..."
            </p>
          </div>
          <div className={styles.action}>
            <p className={styles.reviewAll}>Show more</p>
            <img
              src="https://via.placeholder.com/10x10"
              className={styles.chevronDown}
            />
          </div>
        </div>
        <div className={styles.panelContainer2}>
          <div className={styles.previewPanel2}>
            <p className={styles.preview}>Preview</p>
            <div className={styles.phoneInsideLayout2}>
              <div className={styles.topControls}>
                <img
                  src="https://via.placeholder.com/18x18"
                  className={styles.arrowLeft}
                />
                <img
                  src="../image/msda0hek-pqyl1g6.svg"
                  className={styles.arrowLeft}
                />
              </div>
              <div className={styles.bottomDetails}>
                <div className={styles.userInfo}>
                  <p className={styles.saveChanges}>@orcaru_fitness</p>
                  <p className={styles.contentIsFearInMotio}>
                    Content is Fear in Motion
                  </p>
                </div>
                <div className={styles.audioLabel}>
                  <img
                    src="../image/msda0hek-n0qzyf8.svg"
                    className={styles.sparkles}
                  />
                  <p className={styles.originalSound}>Original Sound</p>
                </div>
              </div>
            </div>
            <p className={styles.thisIsAnApproximatio}>
              This is an approximation of what your post will look like in the feed.
            </p>
          </div>
          <div className={styles.formSidepanel2}>
            <div className={styles.fieldBlock}>
              <div className={styles.frame}>
                <p className={styles.title}>Title*</p>
                <div className={styles.projectDefaultIndica}>
                  <div className={styles.text} />
                  <p className={styles.modified2}>Modified</p>
                  <div className={styles.autoWrapper}>
                    <img
                      src="../image/msda0hek-fyc5xns.png"
                      className={styles.icon}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.inputField}>
                <p className={styles.a5EssentialTrainingT}>
                  5 Essential Training Tips for Summer Running
                </p>
                <div className={styles.resetAction}>
                  <img
                    src="../image/msda0hek-g1hsuwx.svg"
                    className={styles.refreshCw}
                  />
                </div>
              </div>
              <p className={styles.modifiedFromProjectD}>
                Modified from project default: Running Form Tips for Beginners
              </p>
            </div>
            <div className={styles.publishRow}>
              <div className={styles.dateBlock}>
                <p className={styles.publishDate}>Publish Date</p>
                <div className={styles.frame2}>
                  <p className={styles.june2020262}>June 20, 2026</p>
                  <img
                    src="../image/msda0hek-fzxl8ww.svg"
                    className={styles.refreshCw}
                  />
                </div>
              </div>
              <div className={styles.timeBlock}>
                <p className={styles.publishDate}>Publish Time</p>
                <div className={styles.frame3}>
                  <p className={styles.june2020262}>3:00 PM</p>
                  <div className={styles.clock}>
                    <div className={styles.vector3} />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.fieldBlock3}>
              <div className={styles.frame5}>
                <p className={styles.title}>Post Content</p>
                <div className={styles.projectDefaultIndica2}>
                  <div className={styles.text2} />
                  <p className={styles.projectDefault2}>Project Default</p>
                </div>
              </div>
              <div className={styles.inputFieldTextarea2}>
                <p className={styles.controlRarelyIdentif3}>
                  Control rarely identifies itself honestly. It arrives as planning,
                  as responsibility. It is fear in different clothing. Control does
                  not arrive announcing itself as fear.
                </p>
              </div>
            </div>
            <div className={styles.tagsFieldBlock}>
              <div className={styles.frame}>
                <p className={styles.title}>Tags</p>
                <div className={styles.projectDefaultIndica}>
                  <div className={styles.text} />
                  <p className={styles.modified2}>Modified</p>
                  <div className={styles.autoWrapper}>
                    <img
                      src="../image/msda0hek-fyc5xns.png"
                      className={styles.icon}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.frame4}>
                <div className={styles.tagsRow}>
                  <div className={styles.badges}>
                    <p className={styles.active}>IAMYoga</p>
                  </div>
                  <div className={styles.badges}>
                    <p className={styles.active}>AmritYoga</p>
                  </div>
                  <div className={styles.badges}>
                    <p className={styles.active}>YogaWisdom</p>
                  </div>
                </div>
                <div className={styles.resetAction}>
                  <img
                    src="../image/msda0hek-hq076ye.svg"
                    className={styles.refreshCw}
                  />
                </div>
              </div>
              <p className={styles.modifiedFromProjectD}>
                Missing recommended tags: #SummerFitChallenge, #CoachApproved
              </p>
            </div>
            <div className={styles.commentsPanel2}>
              <div className={styles.line} />
              <div className={styles.commentsTitleStack}>
                <p className={styles.comments}>Comments</p>
                <div className={styles.countPill}>
                  <p className={styles.a2}>1</p>
                </div>
              </div>
              <div className={styles.commentItem2}>
                <div className={styles.avatar2}>
                  <p className={styles.qB}>SC</p>
                </div>
                <div className={styles.commentContent}>
                  <div className={styles.metaRow}>
                    <p className={styles.title}>Sarah Chen</p>
                    <p className={styles.a4HAgo}>4h ago</p>
                  </div>
                  <p className={styles.a3ItemsFlaggedForRev}>
                    Rejecting — see notes above about brand voice
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className={styles.sTatusdraft}>STATUS: DRAFT</p>
      <div className={styles.internalModalDraft}>
        <div className={styles.frame15}>
          <div className={styles.frame7}>
            <div className={styles.iconContainer2}>
              <img src="../image/msda0hel-jbjpak4.svg" className={styles.video} />
            </div>
            <div className={styles.frame6}>
              <p className={styles.runningFormTips}>Running Form Tips</p>
              <p className={styles.youtubeShortsClip}>Youtube Shorts Clip</p>
            </div>
          </div>
          <div className={styles.frame14}>
            <div className={styles.frame9}>
              <p className={styles.version3}>Version 3</p>
              <div className={styles.autoWrapper2}>
                <img
                  src="../image/msda0hel-xwji2li.png"
                  className={styles.frame8}
                />
              </div>
            </div>
            <div className={styles.frame10}>
              <p className={styles.version3}>Regenerate Content</p>
              <img src="../image/msda0hel-kiq0v4q.svg" className={styles.video} />
            </div>
            <div className={styles.frame12}>
              <div className={styles.frame11} />
              <p className={styles.version3}>Draft</p>
              <div className={styles.autoWrapper3}>
                <div className={styles.line2} />
              </div>
              <img
                src="../image/msda0hel-9uuih7u.svg"
                className={styles.refreshCw}
              />
            </div>
            <div className={styles.frame13}>
              <img src="../image/msda0hel-6w2i6ru.svg" className={styles.video} />
            </div>
          </div>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.previewPanel3}>
            <p className={styles.preview}>Preview</p>
            <div className={styles.frame19}>
              <div className={styles.frame17}>
                <img
                  src="../image/msda0hel-1tm1anq.svg"
                  className={styles.frame16}
                />
                <p className={styles.uploadVideo}>Upload Video</p>
                <p className={styles.clickToBrowse}>Click to browse</p>
              </div>
              <div className={styles.frame18}>
                <img
                  src="../image/msda0hel-tzablsd.svg"
                  className={styles.frame16}
                />
                <p className={styles.version3}>Generate AI Video</p>
                <p className={styles.thisWillCreateAVideo}>
                  This will create a video using details and references
                </p>
              </div>
            </div>
            <p className={styles.thisIsAnApproximatio2}>
              This is an approximation of what your post will look like.
            </p>
          </div>
          <div className={styles.frame42}>
            <div className={styles.frame21}>
              <p className={styles.title2}>Title*</p>
              <div className={styles.frame20}>
                <p className={styles.june2020262}>
                  5 Essential Training Tips for Summer Running
                </p>
              </div>
            </div>
            <div className={styles.frame24}>
              <div className={styles.frame23}>
                <p className={styles.title2}>Publish Date</p>
                <div className={styles.frame22}>
                  <p className={styles.june2020262}>June 20 2026</p>
                  <img
                    src="../image/msda0hel-4flrcj9.svg"
                    className={styles.refreshCw}
                  />
                </div>
              </div>
              <div className={styles.frame23}>
                <p className={styles.title2}>Publish Time</p>
                <div className={styles.frame22}>
                  <p className={styles.june2020262}>3:00 PM</p>
                  <img
                    src="../image/msda0hel-jtjo8cb.svg"
                    className={styles.refreshCw}
                  />
                </div>
              </div>
            </div>
            <div className={styles.frame26}>
              <p className={styles.title2}>Post Content</p>
              <div className={styles.frame25}>
                <p className={styles.controlRarelyIdentif4}>
                  Control rarely identifies itself honestly. It arrives as planning,
                  as responsibility. It is fear in different clothing. Control does
                  not arrive announcing itself as fear. It arrives as planning, as
                  preparation, as responsibility, as taking initiative.
                </p>
              </div>
            </div>
            <div className={styles.frame29}>
              <p className={styles.title2}>Tags</p>
              <div className={styles.frame28}>
                <div className={styles.frame27}>
                  <p className={styles.aIamYoga}>#IAMYoga</p>
                </div>
                <div className={styles.frame27}>
                  <p className={styles.aIamYoga}>#AmritYoga</p>
                </div>
                <div className={styles.frame27}>
                  <p className={styles.aIamYoga}>#YogaWisdom</p>
                </div>
              </div>
            </div>
            <div className={styles.commentsSection}>
              <div className={styles.line} />
              <div className={styles.frame30}>
                <p className={styles.comments}>Comments</p>
                <div className={styles.countPill}>
                  <p className={styles.a2}>3</p>
                </div>
              </div>
              <div className={styles.frame39}>
                <div className={styles.frame33}>
                  <div className={styles.avatar2}>
                    <p className={styles.qB}>SC</p>
                  </div>
                  <div className={styles.frame32}>
                    <div className={styles.frame31}>
                      <p className={styles.title}>Sarah Chen</p>
                      <p className={styles.a4HAgo}>2h ago</p>
                    </div>
                    <p className={styles.a3ItemsFlaggedForRev}>
                      Should we adjust the hashtags to include #SummerFitness?
                    </p>
                  </div>
                </div>
                <div className={styles.frame35}>
                  <div className={styles.frame34}>
                    <p className={styles.qB}>MT</p>
                  </div>
                  <div className={styles.frame32}>
                    <div className={styles.frame31}>
                      <p className={styles.title}>Mike Torres</p>
                      <p className={styles.a4HAgo}>1h ago</p>
                    </div>
                    <p className={styles.a3ItemsFlaggedForRev}>
                      Good call, also the publish date might conflict with the
                      campaign launch
                    </p>
                  </div>
                </div>
                <div className={styles.frame38}>
                  <div className={styles.avatar2}>
                    <p className={styles.qB}>SC</p>
                  </div>
                  <div className={styles.frame37}>
                    <div className={styles.frame36}>
                      <p className={styles.title}>Sarah Chen</p>
                      <p className={styles.a4HAgo}>30m ago</p>
                    </div>
                    <p className={styles.a3ItemsFlaggedForRev}>
                      Updated the tags, can you review?
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.frame41}>
                <p className={styles.addAComment}>Add a comment...</p>
                <div className={styles.frame40}>
                  <img
                    src="../image/msda0hel-nw3a4cv.svg"
                    className={styles.arrowUpRight}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.clientModalDraft}>
        <div className={styles.header2}>
          <div className={styles.leftInfo}>
            <div className={styles.iconContainer3}>
              <img
                src="../image/msda0hel-ntvs92g.svg"
                className={styles.refreshCw}
              />
            </div>
            <div className={styles.frame6}>
              <p className={styles.runningFormTips}>Running Form Tips</p>
              <p className={styles.youtubeShortsClip}>Youtube Shorts Clip</p>
            </div>
          </div>
          <div className={styles.rightActions}>
            <div className={styles.statusChip}>
              <p className={styles.reviewAll}>Draft</p>
            </div>
            <div className={styles.closeIcon}>
              <div className={styles.vector4} />
            </div>
          </div>
        </div>
        <div className={styles.modalBody2}>
          <div className={styles.previewSection}>
            <div className={styles.thumbnail}>
              <div className={styles.filePill}>
                <p className={styles.youTubeShortsRunning}>
                  YouTube Shorts - Running Form Tips V3.mp4
                </p>
              </div>
              <div className={styles.playCircle}>
                <div className={styles.vector5} />
              </div>
            </div>
          </div>
          <div className={styles.readOnlyInfoGrid}>
            <div className={styles.field}>
              <p className={styles.title3}>Title</p>
              <p className={styles.a5EssentialTrainingT2}>
                5 Essential Training Tips for Summer Running
              </p>
            </div>
            <div className={styles.datetimeRow}>
              <div className={styles.field2}>
                <p className={styles.title3}>Publish Date</p>
                <p className={styles.a5EssentialTrainingT2}>June 20, 2026</p>
              </div>
              <div className={styles.field2}>
                <p className={styles.title3}>Publish Time</p>
                <p className={styles.a5EssentialTrainingT2}>3:00 PM</p>
              </div>
            </div>
            <div className={styles.field3}>
              <p className={styles.title3}>Post Content</p>
              <p className={styles.controlRarelyIdentif5}>
                Control rarely identifies itself honestly. It arrives as planning,
                as responsibility. It is fear in different clothing...
              </p>
            </div>
            <div className={styles.tagsField}>
              <p className={styles.title3}>Tags</p>
              <div className={styles.tagsContainer}>
                <div className={styles.tag}>
                  <p className={styles.aIamYoga2}>#IAMYoga</p>
                </div>
                <div className={styles.tag}>
                  <p className={styles.aIamYoga2}>#AmritYoga</p>
                </div>
                <div className={styles.tag}>
                  <p className={styles.aIamYoga2}>#YogaWisdom</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.line3} />
          <div className={styles.commentsPanel3}>
            <div className={styles.commentsHeader}>
              <p className={styles.preview}>Comments</p>
              <div className={styles.badge}>
                <p className={styles.a1}>1</p>
              </div>
            </div>
            <div className={styles.commentItem3}>
              <div className={styles.avatar3}>
                <p className={styles.sC}>SC</p>
              </div>
              <div className={styles.commentTextGroup}>
                <div className={styles.meta}>
                  <p className={styles.sarahChen}>Sarah Chen</p>
                  <p className={styles.a2HAgo}>2h ago</p>
                </div>
                <p className={styles.shouldWeAdjustTheHas}>
                  Should we adjust the hashtags to focus more on running form
                  instead of yoga labels?
                </p>
              </div>
            </div>
            <div className={styles.commentComposer}>
              <p className={styles.addAComment2}>Add a comment...</p>
              <div className={styles.sendButton}>
                <img
                  src="../image/msda0hel-y40934r.svg"
                  className={styles.refreshCw}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className={styles.sTatusdraft}>STATUS: QA Evaluation or In Review</p>
      <div className={styles.clientModalQaEvaluat}>
        <div className={styles.header3}>
          <div className={styles.leftInfo}>
            <div className={styles.iconContainer3}>
              <img
                src="../image/msda0hel-l90i4b6.svg"
                className={styles.refreshCw}
              />
            </div>
            <div className={styles.frame6}>
              <p className={styles.runningFormTips}>Running Form Tips</p>
              <p className={styles.youtubeShortsClip}>Youtube Shorts Clip</p>
            </div>
          </div>
          <div className={styles.rightActions2}>
            <div className={styles.statusChip2}>
              <div className={styles.ellipse3} />
              <p className={styles.reviewAll}>In Review</p>
            </div>
            <div className={styles.closeIcon}>
              <div className={styles.vector4} />
            </div>
          </div>
        </div>
        <div className={styles.reviewStatusBanner}>
          <div className={styles.bannerText}>
            <div className={styles.alertCircle}>
              <div className={styles.vector6} />
            </div>
            <p className={styles.aQaReviewNeeded710Pa}>
              This post is ready for your review
            </p>
          </div>
          <div className={styles.bannerButtons}>
            <div className={styles.rejectButton}>
              <p className={styles.requestChanges}>Request Changes</p>
            </div>
            <div className={styles.approveButton}>
              <p className={styles.approve}>Approve</p>
            </div>
          </div>
        </div>
        <div className={styles.modalBody3}>
          <div className={styles.previewSection}>
            <div className={styles.thumbnail}>
              <div className={styles.filePill}>
                <p className={styles.youTubeShortsRunning}>
                  YouTube Shorts - Running Form Tips V3.mp4
                </p>
              </div>
              <div className={styles.playCircle}>
                <div className={styles.vector5} />
              </div>
            </div>
          </div>
          <div className={styles.readOnlyInfoGrid}>
            <div className={styles.field}>
              <p className={styles.title3}>Title</p>
              <p className={styles.a5EssentialTrainingT2}>
                5 Essential Training Tips for Summer Running
              </p>
            </div>
            <div className={styles.datetimeRow}>
              <div className={styles.field2}>
                <p className={styles.title3}>Publish Date</p>
                <p className={styles.a5EssentialTrainingT2}>June 20, 2026</p>
              </div>
              <div className={styles.field2}>
                <p className={styles.title3}>Publish Time</p>
                <p className={styles.a5EssentialTrainingT2}>3:00 PM</p>
              </div>
            </div>
            <div className={styles.field3}>
              <p className={styles.title3}>Post Content</p>
              <p className={styles.controlRarelyIdentif5}>
                Control rarely identifies itself honestly. It arrives as planning,
                as responsibility. It is fear in different clothing...
              </p>
            </div>
            <div className={styles.tagsField}>
              <p className={styles.title3}>Tags</p>
              <div className={styles.tagsContainer}>
                <div className={styles.tag}>
                  <p className={styles.aIamYoga2}>#IAMYoga</p>
                </div>
                <div className={styles.tag}>
                  <p className={styles.aIamYoga2}>#AmritYoga</p>
                </div>
                <div className={styles.tag}>
                  <p className={styles.aIamYoga2}>#YogaWisdom</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.line3} />
          <div className={styles.commentsPanel4}>
            <div className={styles.commentsHeader2}>
              <p className={styles.preview}>Comments</p>
              <div className={styles.badge}>
                <p className={styles.a1}>2</p>
              </div>
            </div>
            <div className={styles.commentsThreadContai}>
              <div className={styles.commentItem4}>
                <div className={styles.avatar4}>
                  <p className={styles.sC}>TO</p>
                </div>
                <div className={styles.commentTextGroup2}>
                  <div className={styles.meta2}>
                    <p className={styles.sarahChen}>Team Orcaru</p>
                    <p className={styles.a2HAgo}>4h ago</p>
                  </div>
                  <p className={styles.weReReviewingThisPos}>
                    We're reviewing this post against your brand guidelines to
                    ensure tags align with the campaign scope.
                  </p>
                </div>
              </div>
              <div className={styles.commentItem5}>
                <div className={styles.avatar5}>
                  <p className={styles.sC}>U</p>
                </div>
                <div className={styles.commentTextGroup3}>
                  <div className={styles.meta3}>
                    <p className={styles.sarahChen}>You</p>
                    <p className={styles.a2HAgo}>1h ago</p>
                  </div>
                  <p className={styles.shouldWeAdjustTheHas}>
                    Looks good to me, but can we change the publish time to 5:00 PM
                    instead of 3:00 PM?
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.commentComposer}>
              <p className={styles.addAComment2}>
                Ask a question or add details...
              </p>
              <div className={styles.sendButton}>
                <img
                  src="../image/msda0hel-wxkho0h.svg"
                  className={styles.refreshCw}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.elementModalReadyFor}>
        <div className={styles.headerBar}>
          <div className={styles.leftInfo2}>
            <div className={styles.iconContainer4}>
              <img src="../image/msda0hel-xwdirhk.svg" className={styles.video} />
            </div>
            <div className={styles.titleGroup}>
              <p className={styles.runningFormTips}>Running Form Tips</p>
              <p className={styles.youtubeShortsClip2}>Youtube Shorts Clip</p>
            </div>
          </div>
          <div className={styles.rightActions3}>
            <div className={styles.frame9}>
              <p className={styles.version3}>Version 3</p>
              <div className={styles.autoWrapper2}>
                <img
                  src="../image/msda0hel-xwji2li.png"
                  className={styles.frame8}
                />
              </div>
            </div>
            <div className={styles.frame43}>
              <div className={styles.statusDot} />
              <p className={styles.version3}>Ready for Review</p>
              <div className={styles.autoWrapper3}>
                <div className={styles.line2} />
              </div>
              <img
                src="../image/msda0hel-8i36u3e.svg"
                className={styles.refreshCw}
              />
            </div>
            <div className={styles.frame13}>
              <img src="../image/msda0hel-2m4lo7m.svg" className={styles.video} />
            </div>
          </div>
        </div>
        <div className={styles.statusBanner}>
          <div className={styles.infoIcon}>
            <img src="../image/msda0hel-3da3ttv.svg" className={styles.sparkles} />
          </div>
          <p className={styles.thisPostHasPassedInt}>
            This post has passed internal QA and is awaiting client approval
          </p>
        </div>
        <div className={styles.panelContainer3}>
          <div className={styles.previewPanel4}>
            <p className={styles.preview2}>Preview</p>
            <div className={styles.frame46}>
              <div className={styles.topControls}>
                <img
                  src="../image/msda0hel-puwcb0i.svg"
                  className={styles.arrowLeft}
                />
                <img
                  src="../image/msda0hel-9mmp9aj.svg"
                  className={styles.arrowLeft}
                />
              </div>
              <div className={styles.frame45}>
                <div className={styles.frame44}>
                  <p className={styles.aOrcaruFitness}>@orcaru_fitness</p>
                  <p className={styles.contentIsFearInMotio2}>
                    Content is Fear in Motion
                  </p>
                </div>
                <div className={styles.audioLabel}>
                  <img
                    src="../image/msda0hel-k9mbr2v.svg"
                    className={styles.sparkles}
                  />
                  <p className={styles.originalSound}>Original Sound</p>
                </div>
              </div>
            </div>
            <p className={styles.thisIsAnApproximatio3}>
              This is an approximation of what your post will look like.
            </p>
          </div>
          <div className={styles.editableFormGrid}>
            <div className={styles.inputsForms}>
              <p className={styles.default}>Title*</p>
              <div className={styles.input}>
                <p className={styles.enterProjectName}>
                  5 Essential Training Tips for Summer Running
                </p>
              </div>
            </div>
            <div className={styles.publishDateTime}>
              <div className={styles.inputsForms2}>
                <p className={styles.date}>Publish Date</p>
                <div className={styles.input2}>
                  <p className={styles.enterProjectName2}>June 20 2026</p>
                  <div className={styles.autoWrapper4}>
                    <img
                      src="../image/msda0hel-uhj8nbb.png"
                      className={styles.icon2}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.inputsForms2}>
                <p className={styles.date}>Publish Time</p>
                <div className={styles.input2}>
                  <p className={styles.enterProjectName2}>3:00 PM</p>
                  <div className={styles.autoWrapper4}>
                    <img
                      src="../image/msda0hel-z0t89uc.png"
                      className={styles.icon2}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.inputsForms3}>
              <p className={styles.default}>Post Content</p>
              <div className={styles.textarea}>
                <p className={styles.describeTheContentSt3}>
                  <span className={styles.describeTheContentSt}>
                    Control rarely identifies itself honestly. It arrives as
                    planning, as responsibility. It is fear in different clothing.
                    Control does not arrive announcing itself as fear. It arrives as
                    planning, as preparation, as responsibility, as taking
                    initiative.
                    <br />
                    <br />
                  </span>
                  <span className={styles.describeTheContentSt2}>
                    #IAMYoga #AmritYoga #YogaWisdom
                  </span>
                </p>
              </div>
            </div>
            <div className={styles.commentsSection2}>
              <div className={styles.line} />
              <div className={styles.frame47}>
                <p className={styles.comments}>Comments</p>
                <div className={styles.countPill}>
                  <p className={styles.a2}>2</p>
                </div>
              </div>
              <div className={styles.commentsList}>
                <div className={styles.commentRow}>
                  <div className={styles.alertCircle2}>
                    <div className={styles.vector7} />
                  </div>
                  <div className={styles.frame49}>
                    <div className={styles.frame48}>
                      <p className={styles.title}>System</p>
                      <p className={styles.a3HAgo}>3h ago</p>
                    </div>
                    <p className={styles.postSentToClientForR}>
                      Post sent to client for review — awaiting client sign-off.
                    </p>
                  </div>
                </div>
                <div className={styles.commentRow2}>
                  <div className={styles.avatar2}>
                    <p className={styles.qB}>SC</p>
                  </div>
                  <div className={styles.frame51}>
                    <div className={styles.frame50}>
                      <p className={styles.title}>Sarah Chen</p>
                      <p className={styles.a3HAgo}>1h ago</p>
                    </div>
                    <p className={styles.a3ItemsFlaggedForRev}>
                      Fingers crossed, the client has been quick with approvals
                      lately!
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.frame52}>
                <p className={styles.addAComment2}>Add a comment...</p>
                <div className={styles.frame40}>
                  <img
                    src="../image/msda0hel-poyvt4t.svg"
                    className={styles.arrowUpRight}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.elementModalQaEvalua}>
        <div className={styles.postContentContainer}>
          <div className={styles.header4}>
            <div className={styles.postDetailsHeader}>
              <div className={styles.frame102}>
                <div className={styles.container}>
                  <img
                    src="../image/msda0hel-ylfbc46.svg"
                    className={styles.video}
                  />
                </div>
                <div className={styles.container2}>
                  <p className={styles.postTitle}>Running Form Tips</p>
                  <p className={styles.contentType}>Youtube Shorts Clip</p>
                </div>
              </div>
              <div className={styles.frame112}>
                <div className={styles.button}>
                  <p className={styles.version32}>Version 3</p>
                  <div className={styles.autoWrapper4}>
                    <img
                      src="../image/msda0hel-hvjse0v.png"
                      className={styles.icon2}
                    />
                  </div>
                </div>
                <div className={styles.button2}>
                  <p className={styles.version32}>Regenerate Content</p>
                  <img
                    src="../image/msda0hel-lok7h2w.svg"
                    className={styles.frame16}
                  />
                </div>
                <div className={styles.statusDropdown}>
                  <div className={styles.statusDot2} />
                  <p className={styles.version3}>QA Evaluation</p>
                  <div className={styles.autoWrapper3}>
                    <div className={styles.line2} />
                  </div>
                  <img
                    src="../image/msda0hel-8lteaq2.svg"
                    className={styles.refreshCw}
                  />
                </div>
                <div className={styles.frame13}>
                  <img
                    src="../image/msda0hel-d1rostk.svg"
                    className={styles.video}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.postAlert}>
            <div className={styles.simpleHeader}>
              <p className={styles.preview}>Overall Checklist Status</p>
              <p className={styles.a710Passing}>7 / 10 Passing</p>
            </div>
            <div className={styles.progressBarComponent}>
              <div className={styles.track}>
                <div className={styles.greenSegments7}>
                  <div className={styles.greenBar} />
                  <div className={styles.greenBar} />
                  <div className={styles.greenBar} />
                  <div className={styles.greenBar} />
                  <div className={styles.greenBar} />
                  <div className={styles.greenBar} />
                  <div className={styles.greenBar} />
                </div>
                <div className={styles.amberSegments3}>
                  <div className={styles.amberBar} />
                  <div className={styles.amberBar} />
                  <div className={styles.amberBar} />
                </div>
              </div>
              <div className={styles.barLabels}>
                <p className={styles.aIamYoga2}>70% Approved</p>
                <p className={styles.a30ActionNeeded}>30% Action Needed</p>
              </div>
            </div>
            <div className={styles.frame66}>
              <div className={styles.frame65}>
                <div className={styles.warningIcon}>
                  <img
                    src="../image/msda0hel-frqrfgu.svg"
                    className={styles.sparkles}
                  />
                </div>
                <div className={styles.frame53}>
                  <div className={styles.ellipse4} />
                  <p className={styles.aQaReviewNeeded710Pa}>
                    3 of 3 QA Items unresolved
                  </p>
                </div>
                <div className={styles.frame54}>
                  <p className={styles.youtubeShortsClip}>Revision Progress</p>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressFill} />
                  </div>
                  <p className={styles.a25}>25%</p>
                </div>
              </div>
              <div className={styles.actionLink}>
                <p className={styles.aQaReviewNeeded710Pa}>Review all</p>
                <img
                  src="../image/msda0hel-n2jndb9.svg"
                  className={styles.sparkles}
                />
              </div>
            </div>
          </div>
          <div className={styles.postContent2}>
            <div className={styles.previewPanel5}>
              <p className={styles.preview3}>Preview</p>
              <div className={styles.postContentPreview}>
                <img
                  src="../image/msda0hga-o8xtskd.png"
                  className={styles.frame55}
                />
              </div>
              <p className={styles.thisIsAnApproximatio4}>
                This is an approximation of what your post will look like.&nbsp;
              </p>
            </div>
            <div className={styles.sidepanel}>
              <div className={styles.titleFieldQa}>
                <div className={styles.title4}>
                  <p className={styles.default}>Title*</p>
                  <div className={styles.input3}>
                    <p className={styles.enterProjectName}>
                      5 Essential Training Tips for Summer Running
                    </p>
                  </div>
                </div>
                <div className={styles.qANote}>
                  <div className={styles.clock}>
                    <div className={styles.vector3} />
                  </div>
                  <p className={styles.titleWasModifiedFrom}>
                    Title was modified from the default. Original: Running Form Tips
                    for Beginners
                  </p>
                  <p className={styles.viewDefault}>View default</p>
                </div>
              </div>
              <div className={styles.publishDateTime2}>
                <div className={styles.inputsForms4}>
                  <p className={styles.date}>Publish Date</p>
                  <div className={styles.input4}>
                    <p className={styles.enterProjectName2}>June 20 2026</p>
                    <div className={styles.autoWrapper4}>
                      <img
                        src="../image/msda0hel-uhj8nbb.png"
                        className={styles.icon2}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.inputsForms4}>
                  <p className={styles.date}>Publish Time</p>
                  <div className={styles.input4}>
                    <p className={styles.enterProjectName2}>3:00 PM</p>
                    <div className={styles.autoWrapper4}>
                      <img
                        src="../image/msda0hel-z0t89uc.png"
                        className={styles.icon2}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.qANote2}>
                <div className={styles.clock}>
                  <div className={styles.vector3} />
                </div>
                <p className={styles.publishDateDiffersFr}>
                  Publish date differs from the scheduled date (June 15, 2026)
                </p>
                <p className={styles.viewDefault}>Reset</p>
              </div>
              <div className={styles.postContent}>
                <p className={styles.default}>Post Content</p>
                <div className={styles.textarea2}>
                  <p className={styles.describeTheContentSt5}>
                    <span className={styles.describeTheContentSt}>
                      Control rarely identifies itself honestly.
                      <br />
                      It arrives as planning, as responsibility.
                      <br />
                      It is fear in different clothing.
                      <br />
                      Control does not arrive announcing itself as fear. It arrives
                      as planning, as preparation, as responsibility, as taking
                      initiative.
                      <br />
                      So we let it run, often for years, without recognizing that
                      the underlying engine is the same contraction fear is - only
                      now externalized, given somewhere to put itself.
                      <br />
                      Gurudev Shri Amritj's line on this is quietly devastating,
                      "When you seek the solution by attempting to change, manage,
                      and control forms, your actions become extrovert; you depend
                      on the undependable world of change."
                      <br />
                    </span>
                    <span className={styles.describeTheContentSt4}>
                      <br />
                    </span>
                    <span className={styles.describeTheContentSt2}>
                      #IAMYoga #AmritYoga #Fear #Control #Presence #Witnessing
                      #GurudevShriAmritji #ConsciousLiving #InnerFreedom #YogaWisdom
                      #LettingGo
                    </span>
                  </p>
                </div>
              </div>
              <div className={styles.tagsQa}>
                <div className={styles.inputsForms5}>
                  <p className={styles.default}>Tags</p>
                  <div className={styles.input5}>
                    <p className={styles.enterProjectName3}>Search of Tags</p>
                  </div>
                </div>
                <div className={styles.qANote3}>
                  <div className={styles.clock}>
                    <div className={styles.vector3} />
                  </div>
                  <p className={styles.titleWasModifiedFrom}>Tags need review.</p>
                </div>
              </div>
              <div className={styles.configuration}>
                <p className={styles.fieldsMarkedProjectD3}>
                  <span className={styles.fieldsMarkedProjectD}>
                    Fields marked&nbsp;
                  </span>
                  <span className={styles.fieldsMarkedProjectD2}>
                    Project Default
                  </span>
                  <span className={styles.fieldsMarkedProjectD}>
                    &nbsp;are pre-filled from your project settings.
                  </span>
                </p>
                <div className={styles.container3}>
                  <p className={styles.clipDurationSeconds}>
                    Clip Duration (seconds)
                  </p>
                  <div className={styles.numberInput}>
                    <p className={styles.a30}>30</p>
                  </div>
                </div>
                <div className={styles.container4}>
                  <div className={styles.fieldLabel}>
                    <div className={styles.text3}>
                      <p className={styles.brandGuidelines}>Brand Guidelines</p>
                    </div>
                    <div className={styles.projectDefaultTag} />
                  </div>
                  <div className={styles.textArea}>
                    <p className={styles.describeYourBrandVoi}>
                      Describe your brand voice, style guidelines, and any
                      dos/don'ts...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.internalModalQa}>
        <div className={styles.frame60}>
          <div className={styles.frame56}>
            <div className={styles.iconContainer5}>
              <img src="../image/msda0hem-r028vzp.svg" className={styles.video} />
            </div>
            <div className={styles.frame6}>
              <p className={styles.runningFormTips}>Running Form Tips</p>
              <p className={styles.youtubeShortsClip}>Youtube Shorts Clip</p>
            </div>
          </div>
          <div className={styles.frame59}>
            <div className={styles.frame9}>
              <p className={styles.version3}>Version 3</p>
              <div className={styles.autoWrapper2}>
                <img
                  src="../image/msda0hel-xwji2li.png"
                  className={styles.frame8}
                />
              </div>
            </div>
            <div className={styles.frame10}>
              <p className={styles.version3}>Regenerate Content</p>
              <img src="../image/msda0hem-bn4jvqy.svg" className={styles.video} />
            </div>
            <div className={styles.frame58}>
              <div className={styles.frame57} />
              <p className={styles.version3}>QA Evaluation</p>
              <div className={styles.autoWrapper3}>
                <div className={styles.line2} />
              </div>
              <img
                src="../image/msda0hem-hhipxdx.svg"
                className={styles.refreshCw}
              />
            </div>
            <div className={styles.frame13}>
              <img src="../image/msda0hem-2lkk6zy.svg" className={styles.video} />
            </div>
          </div>
        </div>
        <div className={styles.frame67}>
          <div className={styles.simpleHeader}>
            <p className={styles.preview}>Overall Checklist Status</p>
            <p className={styles.a710Passing}>7 / 10 Passing</p>
          </div>
          <div className={styles.progressBarComponent2}>
            <div className={styles.greenSegments}>
              <div className={styles.greenBar} />
              <div className={styles.greenBar} />
              <div className={styles.greenBar} />
              <div className={styles.greenBar} />
              <div className={styles.greenBar} />
              <div className={styles.greenBar} />
              <div className={styles.greenBar} />
              <div className={styles.amberBar} />
              <div className={styles.amberBar} />
              <div className={styles.amberBar} />
            </div>
            <div className={styles.barLabels}>
              <p className={styles.aIamYoga2}>70% Approved</p>
              <p className={styles.a30ActionNeeded}>30% Action Needed</p>
            </div>
          </div>
          <div className={styles.frame64}>
            <div className={styles.frame63}>
              <div className={styles.warningIcon}>
                <img
                  src="../image/msda0hem-xlxg8ge.svg"
                  className={styles.sparkles}
                />
              </div>
              <div className={styles.frame61}>
                <div className={styles.ellipse5} />
                <p className={styles.aQaReviewNeeded710Pa}>
                  3 of 3 QA Items unresolved
                </p>
              </div>
              <div className={styles.frame62}>
                <p className={styles.resetToDefault}>Revision Progress</p>
                <div className={styles.progressTrack2}>
                  <div className={styles.progressFill2} />
                </div>
                <p className={styles.a252}>25%</p>
              </div>
            </div>
            <div className={styles.actionLink}>
              <p className={styles.aQaReviewNeeded710Pa}>Review all</p>
              <img
                src="../image/msda0hem-f42lzle.svg"
                className={styles.sparkles}
              />
            </div>
          </div>
        </div>
        <div className={styles.modalBody4}>
          <div className={styles.previewPanel6}>
            <p className={styles.preview}>Preview</p>
            <div className={styles.frame68}>
              <img src="../image/msda0hga-29746yn.png" className={styles.frame55} />
            </div>
            <p className={styles.thisIsAnApproximatio2}>
              This is an approximation of what your post will look like.
            </p>
          </div>
          <div className={styles.sidepanelScrollable}>
            <div className={styles.frame75}>
              <div className={styles.frame69}>
                <p className={styles.title2}>Title*</p>
                <div className={styles.frame20}>
                  <p className={styles.june2020262}>
                    5 Essential Training Tips for Summer Running
                  </p>
                </div>
                <div className={styles.qANote4}>
                  <div className={styles.alertCircle3}>
                    <div className={styles.vector3} />
                  </div>
                  <p className={styles.titleWasModifiedFrom2}>
                    Title was modified from the default. Original: Running Form Tips
                    for Beginners
                  </p>
                  <p className={styles.viewDefault2}>View default</p>
                </div>
              </div>
              <div className={styles.frame24}>
                <div className={styles.frame23}>
                  <p className={styles.title2}>Publish Date</p>
                  <div className={styles.frame22}>
                    <p className={styles.june2020262}>June 20 2026</p>
                    <img
                      src="../image/msda0hel-4flrcj9.svg"
                      className={styles.refreshCw}
                    />
                  </div>
                </div>
                <div className={styles.frame23}>
                  <p className={styles.title2}>Publish Time</p>
                  <div className={styles.frame22}>
                    <p className={styles.june2020262}>3:00 PM</p>
                    <img
                      src="../image/msda0hel-jtjo8cb.svg"
                      className={styles.refreshCw}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.qANote4}>
                <div className={styles.alertCircle3}>
                  <div className={styles.vector3} />
                </div>
                <p className={styles.titleWasModifiedFrom2}>
                  Publish date differs from the scheduled date (June 15, 2026)
                </p>
                <p className={styles.viewDefault2}>Reset</p>
              </div>
              <div className={styles.frame26}>
                <p className={styles.title2}>Post Content</p>
                <div className={styles.frame25}>
                  <p className={styles.controlRarelyIdentif4}>
                    Control rarely identifies itself honestly. It arrives as
                    planning, as responsibility. It is fear in different clothing.
                    Control does not arrive announcing itself as fear. It arrives as
                    planning, as preparation, as responsibility, as taking
                    initiative.
                  </p>
                </div>
              </div>
              <div className={styles.frame70}>
                <p className={styles.title2}>Tags</p>
                <div className={styles.frame28}>
                  <div className={styles.frame27}>
                    <p className={styles.aIamYoga}>#IAMYoga</p>
                  </div>
                  <div className={styles.frame27}>
                    <p className={styles.aIamYoga}>#AmritYoga</p>
                  </div>
                  <div className={styles.frame27}>
                    <p className={styles.aIamYoga}>#YogaWisdom</p>
                  </div>
                </div>
                <div className={styles.qANote5}>
                  <div className={styles.alertCircle3}>
                    <div className={styles.vector3} />
                  </div>
                  <p className={styles.titleWasModifiedFrom2}>Tags need review.</p>
                </div>
              </div>
              <div className={styles.commentsSection3}>
                <div className={styles.line} />
                <div className={styles.frame47}>
                  <p className={styles.comments}>Comments</p>
                  <div className={styles.countPill}>
                    <p className={styles.a2}>2</p>
                  </div>
                </div>
                <div className={styles.frame74}>
                  <div className={styles.frame73}>
                    <div className={styles.avatar}>
                      <p className={styles.qB}>QB</p>
                    </div>
                    <div className={styles.frame72}>
                      <div className={styles.frame71}>
                        <p className={styles.title}>QA Bot</p>
                        <p className={styles.a4HAgo}>4h ago</p>
                      </div>
                      <p className={styles.a3ItemsFlaggedForRev}>
                        3 items flagged for review — title deviation, schedule
                        conflict, missing alt text
                      </p>
                    </div>
                  </div>
                  <div className={styles.frame33}>
                    <div className={styles.avatar2}>
                      <p className={styles.qB}>SC</p>
                    </div>
                    <div className={styles.frame32}>
                      <div className={styles.frame31}>
                        <p className={styles.title}>Sarah Chen</p>
                        <p className={styles.a4HAgo}>2h ago</p>
                      </div>
                      <p className={styles.a3ItemsFlaggedForRev}>
                        Title change was intentional, fixing the other two
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.frame41}>
                  <p className={styles.addAComment}>Add a comment...</p>
                  <div className={styles.frame40}>
                    <img
                      src="../image/msda0hem-cg5sjp4.svg"
                      className={styles.arrowUpRight}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className={styles.sTatusdraft}>STATUS:Rejected</p>
      <div className={styles.elementModalRejected}>
        <div className={styles.postDetailsHeader3}>
          <div className={styles.postDetailsHeader2}>
            <div className={styles.frame102}>
              <div className={styles.container}>
                <img src="../image/msda0hem-uidyuki.svg" className={styles.video} />
              </div>
              <div className={styles.container2}>
                <p className={styles.postTitle}>Running Form Tips</p>
                <p className={styles.contentType}>Youtube Shorts Clip</p>
              </div>
            </div>
            <div className={styles.frame113}>
              <div className={styles.button}>
                <p className={styles.version32}>Version 3</p>
                <div className={styles.autoWrapper4}>
                  <img
                    src="../image/msda0hel-hvjse0v.png"
                    className={styles.icon2}
                  />
                </div>
              </div>
              <div className={styles.button2}>
                <p className={styles.version32}>Regenerate Content</p>
                <img
                  src="../image/msda0hem-h4s7hbw.svg"
                  className={styles.frame16}
                />
              </div>
              <div className={styles.statusDropdown2}>
                <div className={styles.statusDot3} />
                <p className={styles.version3}>Rejected</p>
                <div className={styles.autoWrapper3}>
                  <div className={styles.line2} />
                </div>
                <img
                  src="../image/msda0hel-8lteaq2.svg"
                  className={styles.refreshCw}
                />
              </div>
              <div className={styles.frame13}>
                <img src="../image/msda0hem-c42rxqc.svg" className={styles.video} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.postAlert2}>
          <div className={styles.warningHeaderColumn}>
            <div className={styles.titleBlock}>
              <div className={styles.alertTriangle2}>
                <img
                  src="../image/msda0hem-1yhdy4o.svg"
                  className={styles.alertTriangle}
                />
              </div>
              <div className={styles.frame76}>
                <p className={styles.comments}>This post was rejected</p>
                <p className={styles.youtubeShortsClip}>
                  Rejected by Sarah Chen on June 18, 2026
                </p>
              </div>
            </div>
            <div className={styles.rejectionQuoteConten}>
              <p className={styles.aTheContentDoesnTAli}>
                "The content doesn't align with our brand voice guidelines. The
                training tips section needs to reference our certified coach
                program, and the hashtags should include our campaign tags
                #SummerFitChallenge and #CoachApproved."
              </p>
            </div>
          </div>
          <div className={styles.actionButton}>
            <p className={styles.title}>Revise & Resubmit</p>
            <img src="../image/msda0hem-yuzt092.svg" className={styles.sparkles} />
          </div>
        </div>
        <div className={styles.panelContainer4}>
          <div className={styles.previewPanel7}>
            <p className={styles.aOrcaruFitness}>Preview</p>
            <div className={styles.postContentPreview}>
              <img src="../image/msda0hga-o8xtskd.png" className={styles.frame55} />
            </div>
            <p className={styles.thisIsAnApproximatio4}>
              This is an approximation of what your post will look like.
            </p>
          </div>
          <div className={styles.formSidepanel3}>
            <div className={styles.editableFormGrid2}>
              <div className={styles.fieldWrap}>
                <div className={styles.title4}>
                  <p className={styles.default}>Title*</p>
                  <div className={styles.input3}>
                    <p className={styles.enterProjectName}>
                      5 Essential Training Tips for Summer Running
                    </p>
                  </div>
                </div>
                <div className={styles.warningCallout}>
                  <div className={styles.leftAccent} />
                  <p className={styles.warningText}>
                    Title was modified from the default. Original: "Running Form
                    Tips for Beginners"
                  </p>
                  <p className={styles.aIamYoga2}>View default →</p>
                </div>
              </div>
              <div className={styles.publishDateTime3}>
                <div className={styles.inputsForms4}>
                  <p className={styles.date}>Publish Date</p>
                  <div className={styles.input4}>
                    <p className={styles.enterProjectName2}>June 20 2026</p>
                    <div className={styles.autoWrapper4}>
                      <img
                        src="../image/msda0hel-uhj8nbb.png"
                        className={styles.icon2}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.inputsForms4}>
                  <p className={styles.date}>Publish Time</p>
                  <div className={styles.input4}>
                    <p className={styles.enterProjectName2}>3:00 PM</p>
                    <div className={styles.autoWrapper4}>
                      <img
                        src="../image/msda0hel-z0t89uc.png"
                        className={styles.icon2}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.inputsForms6}>
                <p className={styles.default}>Post Content</p>
                <div className={styles.textarea3}>
                  <p className={styles.describeTheContentSt3}>
                    <span className={styles.describeTheContentSt}>
                      Control rarely identifies itself honestly.
                      <br />
                      <br />
                      It arrives as planning, as responsibility.
                      <br />
                      <br />
                      It is fear in different clothing.
                      <br />
                      <br />
                      Control does not arrive announcing itself as fear. It arrives
                      as planning, as preparation, as responsibility, as taking
                      initiative.
                      <br />
                      <br />
                      So we let it run, often for years, without recognizing that
                      the underlying engine is the same contraction fear is - only
                      now externalized, given somewhere to put itself.
                      <br />
                      <br />
                      Gurudev Shri Amritj's line on this is quietly devastating,
                      "When you seek the solution by attempting to change, manage,
                      and control forms, your actions become extrovert; you depend
                      on the undependable world of change."
                      <br />
                      <br />
                    </span>
                    <span className={styles.describeTheContentSt2}>
                      #IAMYoga #AmritYoga #Fear #Control #Presence #Witnessing
                      #GurudevShriAmritji #ConsciousLiving #InnerFreedom #YogaWisdom
                      #LettingGo
                    </span>
                  </p>
                </div>
              </div>
              <p className={styles.fieldsMarkedProjectD6}>
                <span className={styles.fieldsMarkedProjectD4}>
                  Fields marked&nbsp;
                </span>
                <span className={styles.fieldsMarkedProjectD5}>
                  Project Default
                </span>
                <span className={styles.fieldsMarkedProjectD4}>
                  &nbsp;are pre-filled from your project settings.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.elementModalRejected2}>
        <div className={styles.headerBar2}>
          <div className={styles.frame77}>
            <div className={styles.iconContainer2}>
              <img src="../image/msda0hem-ih425j1.svg" className={styles.video} />
            </div>
            <div className={styles.titleGroup}>
              <p className={styles.runningFormTips}>Running Form Tips</p>
              <p className={styles.youtubeShortsClip2}>Youtube Shorts Clip</p>
            </div>
          </div>
          <div className={styles.frame79}>
            <div className={styles.frame9}>
              <p className={styles.version3}>Version 3</p>
              <div className={styles.autoWrapper2}>
                <img
                  src="../image/msda0hel-xwji2li.png"
                  className={styles.frame8}
                />
              </div>
            </div>
            <div className={styles.frame78}>
              <p className={styles.title}>Revise & Resubmit</p>
              <img
                src="../image/msda0hem-3ewoeyx.svg"
                className={styles.sparkles}
              />
            </div>
            <div className={styles.statusDropdown2}>
              <div className={styles.statusDot3} />
              <p className={styles.version3}>Rejected</p>
              <div className={styles.autoWrapper3}>
                <div className={styles.line2} />
              </div>
              <img
                src="../image/msda0hel-8lteaq2.svg"
                className={styles.refreshCw}
              />
            </div>
            <div className={styles.frame13}>
              <img src="../image/msda0hem-cqgjzt6.svg" className={styles.video} />
            </div>
          </div>
        </div>
        <div className={styles.frame83}>
          <div className={styles.frame81}>
            <div className={styles.frame80}>
              <img
                src="../image/msda0hem-pz0s512.svg"
                className={styles.sparkles}
              />
            </div>
            <div className={styles.frame76}>
              <p className={styles.comments}>This post was rejected</p>
              <p className={styles.youtubeShortsClip}>
                Rejected by Sarah Chen on June 18, 2026
              </p>
            </div>
          </div>
          <div className={styles.frame82}>
            <p className={styles.aTheContentDoesnTAli2}>
              "The content doesn't align with our brand voice guidelines. The
              training tips section needs to reference our certified coach program,
              and the hashtags should include our campaign tags #SummerFitChallenge
              and #CoachApproved."
            </p>
          </div>
        </div>
        <div className={styles.panelContainer5}>
          <div className={styles.previewPanel8}>
            <p className={styles.preview}>Preview</p>
            <div className={styles.frame86}>
              <div className={styles.topControls}>
                <img
                  src="../image/msda0hem-smlkf2x.svg"
                  className={styles.arrowLeft}
                />
                <img
                  src="../image/msda0hem-p8wqxcv.svg"
                  className={styles.arrowLeft}
                />
              </div>
              <div className={styles.frame85}>
                <div className={styles.frame84}>
                  <p className={styles.saveChanges}>@orcaru_fitness</p>
                  <p className={styles.contentIsFearInMotio2}>
                    Content is Fear in Motion
                  </p>
                </div>
                <div className={styles.audioLabel}>
                  <img
                    src="../image/msda0hem-xxb5b7h.svg"
                    className={styles.sparkles}
                  />
                  <p className={styles.originalSound}>Original Sound</p>
                </div>
              </div>
            </div>
            <p className={styles.thisIsAnApproximatio3}>
              This is an approximation of what your post will look like.
            </p>
          </div>
          <div className={styles.editableFormGrid3}>
            <div className={styles.frame87}>
              <div className={styles.inputsForms}>
                <p className={styles.default}>Title*</p>
                <div className={styles.input}>
                  <p className={styles.enterProjectName}>
                    5 Essential Training Tips for Summer Running
                  </p>
                </div>
              </div>
              <div className={styles.warningCallout}>
                <div className={styles.leftAccent} />
                <p className={styles.warningText}>
                  Title was modified from the default. Original: "Running Form Tips
                  for Beginners"
                </p>
                <p className={styles.aIamYoga2}>View default →</p>
              </div>
            </div>
            <div className={styles.publishDateTime4}>
              <div className={styles.inputsForms2}>
                <p className={styles.date}>Publish Date</p>
                <div className={styles.input2}>
                  <p className={styles.enterProjectName2}>June 20 2026</p>
                  <div className={styles.autoWrapper4}>
                    <img
                      src="../image/msda0hel-uhj8nbb.png"
                      className={styles.icon2}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.inputsForms2}>
                <p className={styles.date}>Publish Time</p>
                <div className={styles.input2}>
                  <p className={styles.enterProjectName2}>3:00 PM</p>
                  <div className={styles.autoWrapper4}>
                    <img
                      src="../image/msda0hel-z0t89uc.png"
                      className={styles.icon2}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.inputsForms7}>
              <p className={styles.default}>Post Content</p>
              <div className={styles.textarea}>
                <p className={styles.describeTheContentSt3}>
                  <span className={styles.describeTheContentSt}>
                    Control rarely identifies itself honestly. It arrives as
                    planning, as responsibility. It is fear in different clothing.
                    Control does not arrive announcing itself as fear. It arrives as
                    planning, as preparation, as responsibility, as taking
                    initiative.
                    <br />
                    <br />
                  </span>
                  <span className={styles.describeTheContentSt2}>
                    #IAMYoga #AmritYoga #YogaWisdom
                  </span>
                </p>
              </div>
            </div>
            <div className={styles.tagsArea}>
              <p className={styles.title2}>Tags</p>
              <div className={styles.tagChipsContainer}>
                <div className={styles.badges}>
                  <p className={styles.active}>IAMYoga</p>
                </div>
                <div className={styles.badges}>
                  <p className={styles.active}>AmritYoga</p>
                </div>
                <div className={styles.badges}>
                  <p className={styles.active}>YogaWisdom</p>
                </div>
              </div>
              <div className={styles.warningCallout}>
                <div className={styles.leftAccent} />
                <p className={styles.warningText}>
                  Tags are missing recommended defaults: #SummerFitChallenge,
                  #CoachApproved
                </p>
                <p className={styles.aIamYoga2}>Add defaults →</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.clientV2Rejected}>
        <div className={styles.header5}>
          <div className={styles.leftInfo}>
            <div className={styles.iconContainer3}>
              <img
                src="../image/msda0hem-kkvkrul.svg"
                className={styles.refreshCw}
              />
            </div>
            <div className={styles.frame6}>
              <p className={styles.runningFormTips}>Running Form Tips</p>
              <p className={styles.youtubeShortsClip}>Youtube Shorts Clip</p>
            </div>
          </div>
          <div className={styles.rightActions4}>
            <div className={styles.statusChip3}>
              <div className={styles.ellipse6} />
              <p className={styles.reviewAll}>Rejected</p>
            </div>
            <div className={styles.closeIcon}>
              <div className={styles.vector4} />
            </div>
          </div>
        </div>
        <div className={styles.modalBody5}>
          <div className={styles.previewSection2}>
            <div className={styles.thumbnail2}>
              <div className={styles.filePill2}>
                <p className={styles.youTubeShortsRunning}>
                  YouTube Shorts - Running Form Tips V3.mp4
                </p>
              </div>
              <div className={styles.playCircle}>
                <div className={styles.vector5} />
              </div>
            </div>
          </div>
          <div className={styles.readOnlyInfoGrid2}>
            <div className={styles.field4}>
              <p className={styles.title5}>Title</p>
              <p className={styles.a5EssentialTrainingT2}>
                5 Essential Training Tips for Summer Running
              </p>
            </div>
            <div className={styles.datetimeRow2}>
              <div className={styles.field5}>
                <p className={styles.title5}>Publish Date</p>
                <p className={styles.a5EssentialTrainingT2}>June 20, 2026</p>
              </div>
              <div className={styles.field5}>
                <p className={styles.title5}>Publish Time</p>
                <p className={styles.a5EssentialTrainingT2}>3:00 PM</p>
              </div>
            </div>
            <div className={styles.field6}>
              <p className={styles.title5}>Post Content</p>
              <p className={styles.controlRarelyIdentif6}>
                Control rarely identifies itself honestly. It arrives as planning,
                as responsibility. It is fear in different clothing...
              </p>
            </div>
            <div className={styles.tagsField2}>
              <p className={styles.title5}>Tags</p>
              <div className={styles.tagsContainer}>
                <div className={styles.tag}>
                  <p className={styles.aIamYoga2}>#IAMYoga</p>
                </div>
                <div className={styles.tag}>
                  <p className={styles.aIamYoga2}>#AmritYoga</p>
                </div>
                <div className={styles.tag}>
                  <p className={styles.aIamYoga2}>#YogaWisdom</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.line3} />
          <div className={styles.commentsPanel5}>
            <div className={styles.commentsHeader2}>
              <p className={styles.preview}>Comments</p>
              <div className={styles.badge}>
                <p className={styles.a1}>3</p>
              </div>
            </div>
            <div className={styles.commentsThreadContai2}>
              <div className={styles.commentItem3}>
                <div className={styles.avatar3}>
                  <p className={styles.sC}>SC</p>
                </div>
                <div className={styles.commentTextGroup}>
                  <div className={styles.meta}>
                    <p className={styles.sarahChen}>Sarah Chen</p>
                    <p className={styles.a2HAgo}>6h ago</p>
                  </div>
                  <p className={styles.shouldWeAdjustTheHas}>
                    Post is ready for your review.
                  </p>
                </div>
              </div>
              <div className={styles.commentItem6}>
                <div className={styles.avatar5}>
                  <p className={styles.sC}>U</p>
                </div>
                <div className={styles.commentTextGroup4}>
                  <div className={styles.meta4}>
                    <p className={styles.sarahChen}>You</p>
                    <p className={styles.a2HAgo}>4h ago</p>
                  </div>
                  <p className={styles.weReReviewingThisPos}>
                    The hashtags should include #SummerFitChallenge and
                    #CoachApproved for better alignment with our brand. Rejecting
                    for now.
                  </p>
                </div>
              </div>
              <div className={styles.commentItem7}>
                <div className={styles.avatar4}>
                  <p className={styles.sC}>MT</p>
                </div>
                <div className={styles.commentTextGroup5}>
                  <div className={styles.meta5}>
                    <p className={styles.sarahChen}>Mike Torres</p>
                    <p className={styles.a2HAgo}>2h ago</p>
                  </div>
                  <p className={styles.shouldWeAdjustTheHas}>
                    Got it, I'll update the hashtags and resubmit.
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.commentComposer2}>
              <p className={styles.addMoreFeedback}>Add more feedback...</p>
              <div className={styles.sendButton}>
                <img
                  src="../image/msda0hem-cz67zy6.svg"
                  className={styles.refreshCw}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className={styles.sTatusdraft}>STATUS: Approved</p>
      <div className={styles.clientV2Approved}>
        <div className={styles.header6}>
          <div className={styles.leftInfo}>
            <div className={styles.iconContainer3}>
              <img
                src="../image/msda0hem-i1gx30a.svg"
                className={styles.refreshCw}
              />
            </div>
            <div className={styles.frame6}>
              <p className={styles.runningFormTips}>Running Form Tips</p>
              <p className={styles.youtubeShortsClip}>Youtube Shorts Clip</p>
            </div>
          </div>
          <div className={styles.rightActions5}>
            <div className={styles.statusChip4}>
              <div className={styles.ellipse7} />
              <p className={styles.reviewAll}>Approved</p>
            </div>
            <div className={styles.closeIcon}>
              <div className={styles.vector4} />
            </div>
          </div>
        </div>
        <div className={styles.bannerText2}>
          <div className={styles.alertCircle}>
            <div className={styles.vector6} />
          </div>
          <p className={styles.aQaReviewNeeded710Pa}>
            This post has been approved and is ready to publish
          </p>
        </div>
        <div className={styles.modalBody6}>
          <div className={styles.previewSection2}>
            <div className={styles.thumbnail2}>
              <div className={styles.filePill2}>
                <p className={styles.youTubeShortsRunning}>
                  YouTube Shorts - Running Form Tips V3.mp4
                </p>
              </div>
              <div className={styles.playCircle}>
                <div className={styles.vector5} />
              </div>
            </div>
          </div>
          <div className={styles.readOnlyInfoGrid2}>
            <div className={styles.field4}>
              <p className={styles.title5}>Title</p>
              <p className={styles.a5EssentialTrainingT2}>
                5 Essential Training Tips for Summer Running
              </p>
            </div>
            <div className={styles.datetimeRow2}>
              <div className={styles.field5}>
                <p className={styles.title5}>Publish Date</p>
                <p className={styles.a5EssentialTrainingT2}>June 20, 2026</p>
              </div>
              <div className={styles.field5}>
                <p className={styles.title5}>Publish Time</p>
                <p className={styles.a5EssentialTrainingT2}>3:00 PM</p>
              </div>
            </div>
            <div className={styles.field6}>
              <p className={styles.title5}>Post Content</p>
              <p className={styles.controlRarelyIdentif6}>
                Control rarely identifies itself honestly. It arrives as planning,
                as responsibility. It is fear in different clothing...
              </p>
            </div>
            <div className={styles.tagsField2}>
              <p className={styles.title5}>Tags</p>
              <div className={styles.tagsContainer}>
                <div className={styles.tag}>
                  <p className={styles.aIamYoga2}>#IAMYoga</p>
                </div>
                <div className={styles.tag}>
                  <p className={styles.aIamYoga2}>#AmritYoga</p>
                </div>
                <div className={styles.tag}>
                  <p className={styles.aIamYoga2}>#YogaWisdom</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.line3} />
          <div className={styles.commentsPanel6}>
            <div className={styles.commentsHeader2}>
              <p className={styles.preview}>Comments</p>
              <div className={styles.badge}>
                <p className={styles.a1}>2</p>
              </div>
            </div>
            <div className={styles.commentsThreadContai3}>
              <div className={styles.commentItem3}>
                <div className={styles.avatar3}>
                  <p className={styles.sC}>SC</p>
                </div>
                <div className={styles.commentTextGroup}>
                  <div className={styles.meta}>
                    <p className={styles.sarahChen}>Sarah Chen</p>
                    <p className={styles.a2HAgo}>6h ago</p>
                  </div>
                  <p className={styles.shouldWeAdjustTheHas}>
                    All QA items resolved, submitting for approval.
                  </p>
                </div>
              </div>
              <div className={styles.commentItem8}>
                <div className={styles.avatar5}>
                  <p className={styles.sC}>U</p>
                </div>
                <div className={styles.commentTextGroup6}>
                  <div className={styles.meta4}>
                    <p className={styles.sarahChen}>You</p>
                    <p className={styles.a2HAgo}>2h ago</p>
                  </div>
                  <p className={styles.shouldWeAdjustTheHas}>
                    Looks great, approved!
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.commentComposer}>
              <p className={styles.addAComment2}>Add a comment...</p>
              <div className={styles.sendButton}>
                <img
                  src="../image/msda0hem-im560fa.svg"
                  className={styles.refreshCw}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.elementModalApproved}>
        <div className={styles.postDetailsHeader5}>
          <div className={styles.postDetailsHeader4}>
            <div className={styles.frame102}>
              <div className={styles.container}>
                <img src="../image/msda0hem-ihizjq3.svg" className={styles.video} />
              </div>
              <div className={styles.container2}>
                <p className={styles.postTitle}>Running Form Tips</p>
                <p className={styles.contentType}>Youtube Shorts Clip</p>
              </div>
            </div>
            <div className={styles.frame114}>
              <div className={styles.button}>
                <p className={styles.version32}>Version 3</p>
                <div className={styles.autoWrapper4}>
                  <img
                    src="../image/msda0hel-hvjse0v.png"
                    className={styles.icon2}
                  />
                </div>
              </div>
              <div className={styles.button2}>
                <p className={styles.version32}>Regenerate Content</p>
                <img
                  src="../image/msda0hem-3bog367.svg"
                  className={styles.frame16}
                />
              </div>
              <div className={styles.statusDropdown3}>
                <div className={styles.statusDot4} />
                <p className={styles.version3}>Approved</p>
                <div className={styles.autoWrapper3}>
                  <div className={styles.line2} />
                </div>
                <img
                  src="../image/msda0hel-8lteaq2.svg"
                  className={styles.refreshCw}
                />
              </div>
              <div className={styles.frame13}>
                <img src="../image/msda0hel-d1rostk.svg" className={styles.video} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.postAlert3}>
          <div className={styles.iconFrame}>
            <img src="../image/msda0hem-6e9cy5s.svg" className={styles.check} />
          </div>
          <p className={styles.cancel}>
            This post has been approved and is ready to publish
          </p>
        </div>
        <div className={styles.panelContainer6}>
          <div className={styles.previewPanel7}>
            <p className={styles.aOrcaruFitness}>Preview</p>
            <div className={styles.postContentPreview}>
              <img src="../image/msda0hga-o8xtskd.png" className={styles.frame55} />
            </div>
            <p className={styles.thisIsAnApproximatio4}>
              This is an approximation of what your post will look like.
            </p>
          </div>
          <div className={styles.formSidepanel4}>
            <div className={styles.editableFormGrid4}>
              <div className={styles.fieldWrap2}>
                <div className={styles.inputsForms8}>
                  <p className={styles.default}>Title*</p>
                  <div className={styles.input}>
                    <p className={styles.enterProjectName}>
                      5 Essential Training Tips for Summer Running
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.publishDateTime5}>
                <div className={styles.inputsForms9}>
                  <p className={styles.date}>Publish Date</p>
                  <div className={styles.input2}>
                    <p className={styles.enterProjectName2}>June 20 2026</p>
                    <div className={styles.autoWrapper4}>
                      <img
                        src="../image/msda0hel-uhj8nbb.png"
                        className={styles.icon2}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.inputsForms9}>
                  <p className={styles.date}>Publish Time</p>
                  <div className={styles.input2}>
                    <p className={styles.enterProjectName2}>3:00 PM</p>
                    <div className={styles.autoWrapper4}>
                      <img
                        src="../image/msda0hel-z0t89uc.png"
                        className={styles.icon2}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.inputsForms10}>
                <p className={styles.default}>Post Content</p>
                <div className={styles.textarea}>
                  <p className={styles.describeTheContentSt3}>
                    <span className={styles.describeTheContentSt}>
                      Control rarely identifies itself honestly.
                      <br />
                      <br />
                      It arrives as planning, as responsibility.
                      <br />
                      <br />
                      It is fear in different clothing.
                      <br />
                      <br />
                      Control does not arrive announcing itself as fear. It arrives
                      as planning, as preparation, as responsibility, as taking
                      initiative.
                      <br />
                      <br />
                      So we let it run, often for years, without recognizing that
                      the underlying engine is the same contraction fear is - only
                      now externalized, given somewhere to put itself.
                      <br />
                      <br />
                      Gurudev Shri Amritj's line on this is quietly devastating,
                      "When you seek the solution by attempting to change, manage,
                      and control forms, your actions become extrovert; you depend
                      on the undependable world of change."
                      <br />
                      <br />
                    </span>
                    <span className={styles.describeTheContentSt2}>
                      #IAMYoga #AmritYoga #Fear #Control #Presence #Witnessing
                      #GurudevShriAmritji #ConsciousLiving #InnerFreedom #YogaWisdom
                      #LettingGo
                    </span>
                  </p>
                </div>
              </div>
              <div className={styles.tagsArea2}>
                <div className={styles.title4}>
                  <p className={styles.default}>Tags</p>
                  <div className={styles.input3}>
                    <p className={styles.enterProjectName}>
                      SummerRunning, FitnessGoals, TrainingTips
                    </p>
                  </div>
                </div>
                <div className={styles.tagChipsContainer}>
                  <div className={styles.badges}>
                    <p className={styles.active}>IAMYoga</p>
                  </div>
                  <div className={styles.badges}>
                    <p className={styles.active}>Guru</p>
                  </div>
                  <div className={styles.badges}>
                    <p className={styles.active}>YogaWisdom</p>
                  </div>
                </div>
              </div>
              <p className={styles.fieldsMarkedProjectD7}>
                <span className={styles.fieldsMarkedProjectD4}>
                  Fields marked&nbsp;
                </span>
                <span className={styles.fieldsMarkedProjectD5}>
                  Project Default
                </span>
                <span className={styles.fieldsMarkedProjectD4}>
                  &nbsp;are pre-filled from your project settings.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.elementModalApproved2}>
        <div className={styles.headerBar3}>
          <div className={styles.frame77}>
            <div className={styles.iconContainer2}>
              <img src="../image/msda0hem-ih425j1.svg" className={styles.video} />
            </div>
            <div className={styles.titleGroup}>
              <p className={styles.runningFormTips}>Running Form Tips</p>
              <p className={styles.youtubeShortsClip2}>Youtube Shorts Clip</p>
            </div>
          </div>
          <div className={styles.frame88}>
            <div className={styles.frame9}>
              <p className={styles.version3}>Version 3</p>
              <div className={styles.autoWrapper2}>
                <img
                  src="../image/msda0hel-xwji2li.png"
                  className={styles.frame8}
                />
              </div>
            </div>
            <div className={styles.statusDropdown3}>
              <div className={styles.statusDot4} />
              <p className={styles.version3}>Approved</p>
              <div className={styles.autoWrapper3}>
                <div className={styles.line2} />
              </div>
              <img
                src="../image/msda0hel-8lteaq2.svg"
                className={styles.refreshCw}
              />
            </div>
            <div className={styles.frame13}>
              <img src="../image/msda0hem-adaqs1w.svg" className={styles.video} />
            </div>
          </div>
        </div>
        <div className={styles.frame89}>
          <div className={styles.successIcon}>
            <img src="../image/msda0hem-6e9cy5s.svg" className={styles.sparkles} />
          </div>
          <p className={styles.cancel}>
            This post has been approved and is ready to publish
          </p>
        </div>
        <div className={styles.panelContainer7}>
          <div className={styles.previewPanel9}>
            <p className={styles.preview}>Preview</p>
            <div className={styles.frame90}>
              <div className={styles.topControls}>
                <img
                  src="../image/msda0hel-puwcb0i.svg"
                  className={styles.arrowLeft}
                />
                <img
                  src="../image/msda0hel-9mmp9aj.svg"
                  className={styles.arrowLeft}
                />
              </div>
              <div className={styles.frame85}>
                <div className={styles.frame84}>
                  <p className={styles.saveChanges}>@orcaru_fitness</p>
                  <p className={styles.contentIsFearInMotio2}>
                    Content is Fear in Motion
                  </p>
                </div>
                <div className={styles.audioLabel}>
                  <img
                    src="../image/msda0hem-xnw6l04.svg"
                    className={styles.sparkles}
                  />
                  <p className={styles.originalSound}>Original Sound</p>
                </div>
              </div>
            </div>
            <p className={styles.thisIsAnApproximatio3}>
              This is an approximation of what your post will look like.
            </p>
          </div>
          <div className={styles.editableFormGrid5}>
            <div className={styles.inputsForms}>
              <p className={styles.default}>Title*</p>
              <div className={styles.input}>
                <p className={styles.enterProjectName}>
                  5 Essential Training Tips for Summer Running
                </p>
              </div>
            </div>
            <div className={styles.publishDateTime}>
              <div className={styles.inputsForms2}>
                <p className={styles.date}>Publish Date</p>
                <div className={styles.input2}>
                  <p className={styles.enterProjectName2}>June 20 2026</p>
                  <div className={styles.autoWrapper4}>
                    <img
                      src="../image/msda0hel-uhj8nbb.png"
                      className={styles.icon2}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.inputsForms2}>
                <p className={styles.date}>Publish Time</p>
                <div className={styles.input2}>
                  <p className={styles.enterProjectName2}>3:00 PM</p>
                  <div className={styles.autoWrapper4}>
                    <img
                      src="../image/msda0hel-z0t89uc.png"
                      className={styles.icon2}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.inputsForms3}>
              <p className={styles.default}>Post Content</p>
              <div className={styles.textarea}>
                <p className={styles.describeTheContentSt3}>
                  <span className={styles.describeTheContentSt}>
                    Control rarely identifies itself honestly. It arrives as
                    planning, as responsibility. It is fear in different clothing.
                    Control does not arrive announcing itself as fear. It arrives as
                    planning, as preparation, as responsibility, as taking
                    initiative.
                    <br />
                    <br />
                  </span>
                  <span className={styles.describeTheContentSt2}>
                    #IAMYoga #AmritYoga #YogaWisdom
                  </span>
                </p>
              </div>
            </div>
            <div className={styles.tagsArea3}>
              <p className={styles.title2}>Tags</p>
              <div className={styles.tagChipsContainer}>
                <div className={styles.badges}>
                  <p className={styles.active}>IAMYoga</p>
                </div>
                <div className={styles.badges}>
                  <p className={styles.active}>AmritYoga</p>
                </div>
                <div className={styles.badges}>
                  <p className={styles.active}>YogaWisdom</p>
                </div>
              </div>
            </div>
            <div className={styles.commentsSection4}>
              <div className={styles.line} />
              <div className={styles.frame47}>
                <p className={styles.comments}>Comments</p>
                <div className={styles.countPill}>
                  <p className={styles.a2}>2</p>
                </div>
              </div>
              <div className={styles.frame93}>
                <div className={styles.frame33}>
                  <div className={styles.avatar2}>
                    <p className={styles.qB}>SC</p>
                  </div>
                  <div className={styles.frame32}>
                    <div className={styles.frame31}>
                      <p className={styles.title}>Sarah Chen</p>
                      <p className={styles.a4HAgo}>6h ago</p>
                    </div>
                    <p className={styles.a3ItemsFlaggedForRev}>
                      All QA items resolved, submitting for approval
                    </p>
                  </div>
                </div>
                <div className={styles.commentRow3}>
                  <div className={styles.avatar6}>
                    <p className={styles.qB}>AK</p>
                  </div>
                  <div className={styles.frame92}>
                    <div className={styles.frame91}>
                      <p className={styles.title}>Alex Kim</p>
                      <p className={styles.a4HAgo}>2h ago</p>
                    </div>
                    <p className={styles.a3ItemsFlaggedForRev}>
                      Looks great, approved! ✓
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.frame41}>
                <p className={styles.addAComment}>Add a comment...</p>
                <div className={styles.frame40}>
                  <img
                    src="../image/msda0hel-nw3a4cv.svg"
                    className={styles.arrowUpRight}
                  />
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
