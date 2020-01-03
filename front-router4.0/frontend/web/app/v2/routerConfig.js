{/* <Route component={withRouter(PgError)} /> */}

/* start 这一坨都是为了改造过程中的批量操作，减少出错的机会 */
/* 后来发现没什么卵用，不过暂时放着不删除 */
const pagePath = './pages';

const componentsPath = './components';
const componentsItems = ['LoginAlert', 'FullLoading', 'DownloadApp', 'ChangePwdTips', 'SearchResultOnline', 'AppActivationTask', 'PendingReviewAlert', 'QRCodeSignIn', 'AttentionPlease',];

const messagePath = './Message';
const messageItems = ['ReviewNoticeList', 'AnswerNoticeList', 'CommentNoticeList', 'AdoptNoticeList', 'FocusNoticeList', 'EnrollNoticeList', 'OfflineChangeNoticeListTina', 'OfflineRemindNoticeList', 'InviteNoticeList', 'SystemNotification', 'EnterpriseAnnouncement', 'NoteDetails', 'AnnouncementDetails', 'TaskDetails',];

const accountPath = './AccountManage';
const accountItems = ['AccountManage', 'ChangePwd', 'SafetyVerification', 'SetNewPwd', 'Register', 'RegisterSetPD', 'SetPassword', 'BindPhoneNumber', 'InputPhoneNumber', 'InvitationCode', 'UserInvitedCode', 'BolueInvitationCode', 'ShowInvitedCode', 'PgCopyCode', 'AccountLogin', 'CompleteInfo', 'BindAccount', 'UpdateBindMobile', 'FindPassword', 'RegisterInvitationCode',];

const OAPath = './OA';
const QAItems = ['Qa', 'TopicCenter', 'TopicDetail', 'TeacherCenter', 'InviteTeacher', 'QaListFilter', 'QaDetail', 'BelongsToTopic', 'AnswerDetail', 'QuesLabelSelection', 'AnswerQuestion', 'AskQuestion', 'MyPersonalized', 'PgAnserByPhone',];

const pgCenterPath = './PgCenter';
const pgCenterItem = ['LecturerHomePage', 'PersonalPgHome', 'MemberPgHome', 'LectureQa', 'CoursePlan', 'ChoiceCourse', 'CoursePlanDetail', 'TaskDetail', 'Participants', 'Coupons', 'QaList', 'MyQa', 'MyAttention', 'SetDate', 'taskList', 'serviceProtocol',];

const reviewPath = './Review';
const reviewItem = ['PendingReview', 'PendingReviewDetail', 'ReviewDetail',];

const newbiePath = './NewbieTask';
const newbieItem = ['newbieTaskIndex', 'chooseTopic', 'perfectData', 'bindPhoneNumber', 'bindEmail', 'bindWx', 'focusOnWX', 'vipPerfectInfo', 'IntegralIntroduction', 'PointsMall', 'VipCouponsDetail', 'ExchangeRecords', 'Pointsdetails',]

const EMPPath = './EMP';
const EMPItem = ['PgECharts', 'bolueWeeklyReport'];

const offlineExaminePath = './offlineExamine';
const offlineExamineItem = ['offlineToExamine', 'offlineToExamineDetail', 'offlineHistoryToExamineDetail',];
/* end 这一坨都是为了改造过程中的批量操作，减少出错的机会 */

export default [
    {
        path: `${__rootDir}/list/:type`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgLessonList' */ `${pagePath}/PgLessonList`),
            loading: () => 'loading...',
            webpackChunkName: 'PgLessonList',
        })
    },
    {
        path: `${__rootDir}/lesson/online/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgOnlineDetail' */ `${pagePath}/PgOnlineDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'PgOnlineDetail',
        })
    },
    {
        path: `${__rootDir}/lesson/live/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgLiveDetail' */ `${pagePath}/PgLiveDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'PgLiveDetail',
        })
    },
    {
        path: `${__rootDir}/lesson/offline/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgOfflineDetail' */ `${pagePath}/PgOfflineDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'PgOfflineDetail',
        })
    },
    {
        path: `${__rootDir}/price`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgPriceIntroduction' */ `${pagePath}/PgPriceIntroduction`),
            loading: () => 'loading...',
            webpackChunkName: 'PgPriceIntroduction',
        })
    },
    {
        path: `${__rootDir}/teacher/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgTeacherDetail' */ `${pagePath}/PgTeacherDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'PgTeacherDetail',
        })
    },
    {
        path: `${__rootDir}/commentList/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgOnlineCommentList' */ `${pagePath}/PgOnlineCommentList`),
            loading: () => 'loading...',
            webpackChunkName: 'PgOnlineCommentList',
        })
    },
    {
        path: `${__rootDir}/question`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgQuestion' */ `${pagePath}/PgQuestion`),
            loading: () => 'loading...',
            webpackChunkName: 'PgQuestion',
        })
    },
    {
        path: `${__rootDir}/lessonQuestion/:type/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgLessonQuestion' */ `${pagePath}/PgLessonQuestion`),
            loading: () => 'loading...',
            webpackChunkName: 'PgLessonQuestion',
        })
    },
    {
        path: `${__rootDir}/comment/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgOnlineComment' */ `${pagePath}/PgOnlineComment`),
            loading: () => 'loading...',
            webpackChunkName: 'PgOnlineComment',
        })
    },
    {
        path: `${__rootDir}/exam/:id/:catalogId`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgExam' */ `${pagePath}/PgExam`),
            loading: () => 'loading...',
            webpackChunkName: 'PgExam',
        })
    },
    {
        path: `${__rootDir}/enroll/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgOfflineEnroll' */ `${pagePath}/PgOfflineEnroll`),
            loading: () => 'loading...',
            webpackChunkName: 'PgOfflineEnroll',
        })
    },
    {
        path: `${__rootDir}/questionDetail/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgQuestionDetail' */ `${pagePath}/PgQuestionDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'PgQuestionDetail',
        })
    },
    {
        path: `${__rootDir}/questionList`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgQuestionList' */ `${pagePath}/PgQuestionList`),
            loading: () => 'loading...',
            webpackChunkName: 'PgQuestionList',
        })
    },
    {
        path: `${__rootDir}/answerDetail/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'AnswerDetail' */ `${OAPath}/AnswerDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'AnswerDetail',
        })
    },
    {
        path: `${__rootDir}/addAnswer`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgAddAnswer' */ `${pagePath}/PgAddAnswer`),
            loading: () => 'loading...',
            webpackChunkName: 'PgAddAnswer',
        })
    },
    {
        path: `${__rootDir}/addAnswerComment`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgAddAnswerComment' */ `${pagePath}/PgAddAnswerComment`),
            loading: () => 'loading...',
            webpackChunkName: 'PgAddAnswerComment',
        })
    },
    {
        path: `${__rootDir}/teacher/lesson/list/:type`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgTeacherLessonList' */ `${pagePath}/PgTeacherLessonList`),
            loading: () => 'loading...',
            webpackChunkName: 'PgTeacherLessonList',
        })
    },
    {
        path: `${__rootDir}/reserveDetail/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgLiveReserve' */ `${pagePath}/PgLiveReserve`),
            loading: () => 'loading...',
            webpackChunkName: 'PgLiveReserve',
        })
    },
    {
        path: `${__rootDir}/map`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgAdress' */ `${pagePath}/PgAdress`),
            loading: () => 'loading...',
            webpackChunkName: 'PgAdress',
        })
    },
    {
        path: `${__rootDir}/examDetail/:id/:catalogId`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgExamResult' */ `${pagePath}/PgExamResult`),
            loading: () => 'loading...',
            webpackChunkName: 'PgExamResult',
        })
    },
    {
        path: `${__rootDir}/home`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgHome' */ `${pagePath}/PgHome`),
            loading: () => 'loading...',
            webpackChunkName: 'PgHome',
        })
    },
    {
        path: `${__rootDir}/useDiscount/:type/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgUseDiscountForOnline' */ `${pagePath}/PgUseDiscountForOnline`),
            loading: () => 'loading...',
            webpackChunkName: 'PgUseDiscountForOnline',
        })
    },
    {
        path: `${__rootDir}/chooseAccount`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgChooseAccount' */ `${pagePath}/PgChooseAccount`),
            loading: () => 'loading...',
            webpackChunkName: 'PgChooseAccount',
        })
    },
    {
        path: `${__rootDir}/quickLogin`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgQuickLogin' */ `${pagePath}/PgQuickLogin`),
            loading: () => 'loading...',
            webpackChunkName: 'PgQuickLogin',
        })
    },
    {
        path: `${__rootDir}/LoginAlert`,
        component: ({
            loader: () => import(/* webpackChunkName: 'LoginAlert' */ `${componentsPath}/LoginAlert`),
            loading: () => 'loading...',
            webpackChunkName: 'LoginAlert',
        })
    },
    {
        path: `${__rootDir}/PgLawLastest`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgLawLastest' */ `${pagePath}/PgLawLastest`),
            loading: () => 'loading...',
            webpackChunkName: 'PgLawLastest',
        })
    },
    {
        path: `${__rootDir}/FullLoading`,
        component: ({
            loader: () => import(/* webpackChunkName: 'FullLoading' */ `${componentsPath}/FullLoading`),
            loading: () => 'loading...',
            webpackChunkName: 'FullLoading',
        })
    },
    {
        path: `${__rootDir}/freeInvited`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgFreeInvited' */ `${pagePath}/PgFreeInvited`),
            loading: () => 'loading...',
            webpackChunkName: 'PgFreeInvited',
        })
    },
    {
        path: `${__rootDir}/AccountManage`,
        component: ({
            loader: () => import(/* webpackChunkName: 'AccountManage' */ `${accountPath}/AccountManage`),
            loading: () => 'loading...',
            webpackChunkName: 'AccountManage',
        })
    },
    {
        path: `${__rootDir}/ChangePwd`,
        component: ({
            loader: () => import(/* webpackChunkName: 'ChangePwd' */ `${accountPath}/ChangePwd`),
            loading: () => 'loading...',
            webpackChunkName: 'ChangePwd',
        })
    },
    {
        path: `${__rootDir}/SafetyVerification`,
        component: ({
            loader: () => import(/* webpackChunkName: 'SafetyVerification' */ `${accountPath}/SafetyVerification`),
            loading: () => 'loading...',
            webpackChunkName: 'SafetyVerification',
        })
    },
    {
        path: `${__rootDir}/SetNewPwd`,
        component: ({
            loader: () => import(/* webpackChunkName: 'SetNewPwd' */ `${accountPath}/SetNewPwd`),
            loading: () => 'loading...',
            webpackChunkName: 'SetNewPwd',
        })
    },
    {
        path: `${__rootDir}/PhoneRegister`,
        component: ({
            loader: () => import(/* webpackChunkName: 'Register' */ `${accountPath}/Register`),
            loading: () => 'loading...',
            webpackChunkName: 'Register',
        })
    },
    {
        path: `${__rootDir}/SetPassword`,
        component: ({
            loader: () => import(/* webpackChunkName: 'SetPassword' */ `${accountPath}/SetPassword`),
            loading: () => 'loading...',
            webpackChunkName: 'SetPassword',
        })
    },
    {
        path: `${__rootDir}/RegisterSetPD`,
        component: ({
            loader: () => import(/* webpackChunkName: 'RegisterSetPD' */ `${accountPath}/RegisterSetPD`),
            loading: () => 'loading...',
            webpackChunkName: 'RegisterSetPD',
        })
    },
    {
        path: `${__rootDir}/BindPhoneNumber`,
        component: ({
            loader: () => import(/* webpackChunkName: 'BindPhoneNumber' */ `${accountPath}/BindPhoneNumber`),
            loading: () => 'loading...',
            webpackChunkName: 'BindPhoneNumber',
        })
    },
    {
        path: `${__rootDir}/InputPhoneNumber`,
        component: ({
            loader: () => import(/* webpackChunkName: 'InputPhoneNumber' */ `${accountPath}/InputPhoneNumber`),
            loading: () => 'loading...',
            webpackChunkName: 'InputPhoneNumber',
        })
    },
    {
        path: `${__rootDir}/login`,
        component: ({
            loader: () => import(/* webpackChunkName: 'AccountLogin' */ `${accountPath}/AccountLogin`),
            loading: () => 'loading...',
            webpackChunkName: 'AccountLogin',
        })
    },
    {
        path: `${__rootDir}/CompleteInfo`,
        component: ({
            loader: () => import(/* webpackChunkName: 'CompleteInfo' */ `${accountPath}/CompleteInfo`),
            loading: () => 'loading...',
            webpackChunkName: 'CompleteInfo',
        })
    },
    {
        path: `${__rootDir}/BindAccount`,
        component: ({
            loader: () => import(/* webpackChunkName: 'BindAccount' */ `${accountPath}/BindAccount`),
            loading: () => 'loading...',
            webpackChunkName: 'BindAccount',
        })
    },
    {
        path: `${__rootDir}/UpdateBindMobile`,
        component: ({
            loader: () => import(/* webpackChunkName: 'UpdateBindMobile' */ `${accountPath}/UpdateBindMobile`),
            loading: () => 'loading...',
            webpackChunkName: 'UpdateBindMobile',
        })
    },
    {
        path: `${__rootDir}/FindPassword`,
        component: ({
            loader: () => import(/* webpackChunkName: 'FindPassword' */ `${accountPath}/FindPassword`),
            loading: () => 'loading...',
            webpackChunkName: 'FindPassword',
        })
    },
    {
        path: `${__rootDir}/PgMyReserveDetail/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgMyReserveDetail' */ `${pagePath}/PgMyReserveDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'PgMyReserveDetail',
        })
    },
    {
        path: `${__rootDir}/PgMyEnrollDetail/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgMyEnrollDetail' */ `${pagePath}/PgMyEnrollDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'PgMyEnrollDetail',
        })
    },
    {
        path: `${__rootDir}/PgMyReserveEnrollList`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgMyReserveEnrollList' */ `${pagePath}/PgMyReserveEnrollList`),
            loading: () => 'loading...',
            webpackChunkName: 'PgMyReserveEnrollList',
        })
    },
    {
        path: `${__rootDir}/PgLiveReserveEnrollList`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgLiveReserveEnrollList' */ `${pagePath}/PgLiveReserveEnrollList`),
            loading: () => 'loading...',
            webpackChunkName: 'PgLiveReserveEnrollList',
        })
    },
    {
        path: `${__rootDir}/PgOfflineReserveEnrollList`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgOfflineReserveEnrollList' */ `${pagePath}/PgOfflineReserveEnrollList`),
            loading: () => 'loading...',
            webpackChunkName: 'PgOfflineReserveEnrollList',
        })
    },
    {
        path: `${__rootDir}/PgEnrollPerson/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgEnrollPerson' */ `${pagePath}/PgEnrollPerson`),
            loading: () => 'loading...',
            webpackChunkName: 'PgEnrollPerson',
        })
    },
    {
        path: `${__rootDir}/PgLawDetail/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgLawDetail' */ `${pagePath}/PgLawDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'PgLawDetail',
        })
    },
    {
        path: `${__rootDir}/PgLawSearch`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgLawSearch' */ `${pagePath}/PgLawSearch`),
            loading: () => 'loading...',
            webpackChunkName: 'PgLawSearch',
        })
    },
    {
        path: `${__rootDir}/PgECharts`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgECharts' */ `${EMPPath}/PgECharts`),
            loading: () => 'loading...',
            webpackChunkName: 'PgECharts',
        })
    },
    {
        path: `${__rootDir}/PgBindWeixinFromWeb`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgBindWeixinFromWeb' */ `${pagePath}/PgBindWeixinFromWeb`),
            loading: () => 'loading...',
            webpackChunkName: 'PgBindWeixinFromWeb',
        })
    },
    {
        path: `${__rootDir}/nplogin`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgNoPassLogin' */ `${pagePath}/PgNoPassLogin`),
            loading: () => 'loading...',
            webpackChunkName: 'PgNoPassLogin',
        })
    },
    {
        path: `${__rootDir}/findpass`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgFindPass' */ `${pagePath}/PgFindPass`),
            loading: () => 'loading...',
            webpackChunkName: 'PgFindPass',
        })
    },
    {
        path: `${__rootDir}/register`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgRegister' */ `${pagePath}/PgRegister`),
            loading: () => 'loading...',
            webpackChunkName: 'PgRegister',
        })
    },
    {
        path: `${__rootDir}/PgCompleteData`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgCompleteData' */ `${pagePath}/PgCompleteData`),
            loading: () => 'loading...',
            webpackChunkName: 'PgCompleteData',
        })
    },
    {
        path: `${__rootDir}/PgCenter`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PersonalCenter' */ `${pagePath}/PersonalCenter`),
            loading: () => 'loading...',
            webpackChunkName: 'PersonalCenter',
        })
    },
    {
        path: `${__rootDir}/PgCenterSet`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgCenterSet' */ `${pagePath}/PgCenterSet`),
            loading: () => 'loading...',
            webpackChunkName: 'PgCenterSet',
        })
    },
    {
        path: `${__rootDir}/PgSetInfo`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgSetInfo' */ `${pagePath}/PgSetInfo`),
            loading: () => 'loading...',
            webpackChunkName: 'PgSetInfo',
        })
    },
    {
        path: `${__rootDir}/PgSetNickname`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgSetNickname' */ `${pagePath}/PgSetNickname`),
            loading: () => 'loading...',
            webpackChunkName: 'PgSetNickname',
        })
    },
    {
        path: `${__rootDir}/PgAdvice`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgAdvice' */ `${pagePath}/PgAdvice`),
            loading: () => 'loading...',
            webpackChunkName: 'PgAdvice',
        })
    },
    {
        path: `${__rootDir}/PgSetPassword`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgSetPassword' */ `${pagePath}/PgSetPassword`),
            loading: () => 'loading...',
            webpackChunkName: 'PgSetPassword',
        })
    },
    {
        path: `${__rootDir}/PgSelectAccount`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgSelectAccount' */ `${pagePath}/PgSelectAccount`),
            loading: () => 'loading...',
            webpackChunkName: 'PgSelectAccount',
        })
    },
    {
        path: `${__rootDir}/promptBox`,
        component: ({
            loader: () => import(/* webpackChunkName: 'promptBox' */ `${pagePath}/promptBox`),
            loading: () => 'loading...',
            webpackChunkName: 'promptBox',
        })
    },
    {
        path: `${__rootDir}/PgProductList`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgProductList' */ `${pagePath}/PgProductList`),
            loading: () => 'loading...',
            webpackChunkName: 'PgProductList',
        })
    },
    {
        path: `${__rootDir}/ProductDetail/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgProductDetail' */ `${pagePath}/PgProductDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'PgProductDetail',
        })
    },
    {
        path: `${__rootDir}/PgMyDiscount`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgMyDiscount' */ `${pagePath}/PgMyDiscount`),
            loading: () => 'loading...',
            webpackChunkName: 'PgMyDiscount',
        })
    },
    {
        path: `${__rootDir}/PgAddDiscount`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgAddDiscount' */ `${pagePath}/PgAddDiscount`),
            loading: () => 'loading...',
            webpackChunkName: 'PgAddDiscount',
        })
    },
    {
        path: `${__rootDir}/PgMyCollect`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgMyCollect' */ `${pagePath}/PgMyCollect`),
            loading: () => 'loading...',
            webpackChunkName: 'PgMyCollect',
        })
    },
    {
        path: `${__rootDir}/PgLearnRecord`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgLearnRecord' */ `${pagePath}/PgLearnRecord`),
            loading: () => 'loading...',
            webpackChunkName: 'PgLearnRecord',
        })
    },
    {
        path: `${__rootDir}/PgSearchResult`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgSearchResult' */ `${pagePath}/PgSearchResult`),
            loading: () => 'loading...',
            webpackChunkName: 'PgSearchResult',
        })
    },
    {
        path: `${__rootDir}/PgHomeIndex`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgHomeIndex' */ `${pagePath}/PgHomeIndex`),
            loading: () => 'loading...',
            webpackChunkName: 'PgHomeIndex',
        })
    },
    {
        path: `${__rootDir}/PgMyQuestion`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgMyQuestion' */ `${pagePath}/PgMyQuestion`),
            loading: () => 'loading...',
            webpackChunkName: 'PgMyQuestion',
        })
    },
    {
        path: `${__rootDir}/PgPositionList`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgPositionList' */ `${pagePath}/PgPositionList`),
            loading: () => 'loading...',
            webpackChunkName: 'PgPositionList',
        })
    },
    {
        path: `${__rootDir}/PgSetPhone`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgSetPhone' */ `${pagePath}/PgSetPhone`),
            loading: () => 'loading...',
            webpackChunkName: 'PgSetPhone',
        })
    },
    {
        path: `${__rootDir}/PgUpdatePhone`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgUpdatePhone' */ `${pagePath}/PgUpdatePhone`),
            loading: () => 'loading...',
            webpackChunkName: 'PgUpdatePhone',
        })
    },
    {
        path: `${__rootDir}/PgSetEmail`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgSetEmail' */ `${pagePath}/PgSetEmail`),
            loading: () => 'loading...',
            webpackChunkName: 'PgSetEmail',
        })
    },
    {
        path: `${__rootDir}/PgSetPosition`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgSetPosition' */ `${pagePath}/PgSetPosition`),
            loading: () => 'loading...',
            webpackChunkName: 'PgSetPosition',
        })
    },
    {
        path: `${__rootDir}/PgMyReserveEnroll`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgMyReserveEnroll' */ `${pagePath}/PgMyReserveEnroll`),
            loading: () => 'loading...',
            webpackChunkName: 'PgMyReserveEnroll',
        })
    },
    {
        path: `${__rootDir}/PgPay`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgPay' */ `${pagePath}/PgPay`),
            loading: () => 'loading...',
            webpackChunkName: 'PgPay',
        })
    },
    {
        path: `${__rootDir}/Qa`,
        component: ({
            loader: () => import(/* webpackChunkName: 'Qa' */ `${OAPath}/Qa`),
            loading: () => 'loading...',
            webpackChunkName: 'Qa',
        })
    },
    {
        path: `${__rootDir}/TopicCenter`,
        component: ({
            loader: () => import(/* webpackChunkName: 'TopicCenter' */ `${OAPath}/TopicCenter`),
            loading: () => 'loading...',
            webpackChunkName: 'TopicCenter',
        })
    },
    {
        path: `${__rootDir}/TopicDetail/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'TopicDetail' */ `${OAPath}/TopicDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'TopicDetail',
        })
    },
    {
        path: `${__rootDir}/TeacherCenter`,
        component: ({
            loader: () => import(/* webpackChunkName: 'TeacherCenter' */ `${OAPath}/TeacherCenter`),
            loading: () => 'loading...',
            webpackChunkName: 'TeacherCenter',
        })
    },
    {
        path: `${__rootDir}/InviteTeacher`,
        component: ({
            loader: () => import(/* webpackChunkName: 'InviteTeacher' */ `${OAPath}/InviteTeacher`),
            loading: () => 'loading...',
            webpackChunkName: 'InviteTeacher',
        })
    },
    {
        path: `${__rootDir}/QaListFilter`,
        component: ({
            loader: () => import(/* webpackChunkName: 'QaListFilter' */ `${OAPath}/QaListFilter`),
            loading: () => 'loading...',
            webpackChunkName: 'QaListFilter',
        })
    },
    {
        path: `${__rootDir}/QaDetail/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'QaDetail' */ `${OAPath}/QaDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'QaDetail',
        })
    },
    {
        path: `${__rootDir}/BelongsToTopic`,
        component: ({
            loader: () => import(/* webpackChunkName: 'BelongsToTopic' */ `${OAPath}/BelongsToTopic`),
            loading: () => 'loading...',
            webpackChunkName: 'BelongsToTopic',
        })
    },
    {
        path: `${__rootDir}/QuesLabelSelection`,
        component: ({
            loader: () => import(/* webpackChunkName: 'QuesLabelSelection' */ `${OAPath}/QuesLabelSelection`),
            loading: () => 'loading...',
            webpackChunkName: 'QuesLabelSelection',
        })
    },
    {
        path: `${__rootDir}/AnswerQuestion`,
        component: ({
            loader: () => import(/* webpackChunkName: 'AnswerQuestion' */ `${OAPath}/AnswerQuestion`),
            loading: () => 'loading...',
            webpackChunkName: 'AnswerQuestion',
        })
    },
    {
        path: `${__rootDir}/AskQuestion`,
        component: ({
            loader: () => import(/* webpackChunkName: 'AskQuestion' */ `${OAPath}/AskQuestion`),
            loading: () => 'loading...',
            webpackChunkName: 'AskQuestion',
        })
    },
    {
        path: `${__rootDir}/MyPersonalized`,
        component: ({
            loader: () => import(/* webpackChunkName: 'MyPersonalized' */ `${OAPath}/MyPersonalized`),
            loading: () => 'loading...',
            webpackChunkName: 'MyPersonalized',
        })
    },
    {
        path: `${__rootDir}/LecturerHomePage/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'LecturerHomePage' */ `${pgCenterPath}/LecturerHomePage`),
            loading: () => 'loading...',
            webpackChunkName: 'LecturerHomePage',
        })
    },
    {
        path: `${__rootDir}/MemberPgHome`,
        component: ({
            loader: () => import(/* webpackChunkName: 'MemberPgHome' */ `${pgCenterPath}/MemberPgHome`),
            loading: () => 'loading...',
            webpackChunkName: 'MemberPgHome',
        })
    },
    {
        path: `${__rootDir}/LectureQa`,
        component: ({
            loader: () => import(/* webpackChunkName: 'LectureQa' */ `${pgCenterPath}/LectureQa`),
            loading: () => 'loading...',
            webpackChunkName: 'LectureQa',
        })
    },
    {
        path: `${__rootDir}/CoursePlan`,
        component: ({
            loader: () => import(/* webpackChunkName: 'CoursePlan' */ `${pgCenterPath}/CoursePlan`),
            loading: () => 'loading...',
            webpackChunkName: 'CoursePlan',
        })
    },
    {
        path: `${__rootDir}/CoursePlanDetail/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'CoursePlanDetail' */ `${pgCenterPath}/CoursePlanDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'CoursePlanDetail',
        })
    },
    {
        path: `${__rootDir}/Task`,
        component: ({
            loader: () => import(/* webpackChunkName: 'Task' */ `${pagePath}/Task`),
            loading: () => 'loading...',
            webpackChunkName: 'Task',
        })
    },
    {
        path: `${__rootDir}/TaskDetail/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'TaskDetail' */ `${pgCenterPath}/TaskDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'TaskDetail',
        })
    },
    {
        path: `${__rootDir}/Participants`,
        component: ({
            loader: () => import(/* webpackChunkName: 'Participants' */ `${pgCenterPath}/Participants`),
            loading: () => 'loading...',
            webpackChunkName: 'Participants',
        })
    },
    {
        path: `${__rootDir}/Coupons`,
        component: ({
            loader: () => import(/* webpackChunkName: 'Coupons' */ `${pgCenterPath}/Coupons`),
            loading: () => 'loading...',
            webpackChunkName: 'Coupons',
        })
    },
    {
        path: `${__rootDir}/QaList`,
        component: ({
            loader: () => import(/* webpackChunkName: 'QaList' */ `${pgCenterPath}/QaList`),
            loading: () => 'loading...',
            webpackChunkName: 'QaList',
        })
    },
    {
        path: `${__rootDir}/MyQa`,
        component: ({
            loader: () => import(/* webpackChunkName: 'MyQa' */ `${pgCenterPath}/MyQa`),
            loading: () => 'loading...',
            webpackChunkName: 'MyQa',
        })
    },
    {
        path: `${__rootDir}/MyAttention`,
        component: ({
            loader: () => import(/* webpackChunkName: 'MyAttention' */ `${pgCenterPath}/MyAttention`),
            loading: () => 'loading...',
            webpackChunkName: 'MyAttention',
        })
    },
    {
        path: `${__rootDir}/SetDate`,
        component: ({
            loader: () => import(/* webpackChunkName: 'SetDate' */ `${pgCenterPath}/SetDate`),
            loading: () => 'loading...',
            webpackChunkName: 'SetDate',
        })
    },
    {
        path: `${__rootDir}/PgMessageList`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgMessageList' */ `${pagePath}/PgMessageList`),
            loading: () => 'loading...',
            webpackChunkName: 'PgMessageList',
        })
    },
    {
        path: `${__rootDir}/PgEnrollList`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgEnrollList' */ `${pagePath}/PgEnrollList`),
            loading: () => 'loading...',
            webpackChunkName: 'PgEnrollList',
        })
    },
    {
        path: `${__rootDir}/PgLiveVideo/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgLiveVideo' */ `${pagePath}/PgLiveVideo`),
            loading: () => 'loading...',
            webpackChunkName: 'PgLiveVideo',
        })
    },
    {
        path: `${__rootDir}/PgChooseCity`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgChooseCity' */ `${pagePath}/PgChooseCity`),
            loading: () => 'loading...',
            webpackChunkName: 'PgChooseCity',
        })
    },
    {
        path: `${__rootDir}/PgOfflineEnrollManyPeople`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgOfflineEnrollManyPeople' */ `${pagePath}/PgOfflineEnrollManyPeople`),
            loading: () => 'loading...',
            webpackChunkName: 'PgOfflineEnrollManyPeople',
        })
    },
    {
        path: `${__rootDir}/NewEnrollManyPeople`,
        component: ({
            loader: () => import(/* webpackChunkName: 'NewEnrollManyPeople' */ `${pagePath}/NewEnrollManyPeople`),
            loading: () => 'loading...',
            webpackChunkName: 'NewEnrollManyPeople',
        })
    },
    {
        path: `${__rootDir}/PgConfirmenrollment`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgConfirmenrollment' */ `${pagePath}/PgConfirmenrollment`),
            loading: () => 'loading...',
            webpackChunkName: 'PgConfirmenrollment',
        })
    },
    {
        path: `${__rootDir}/PgOfflineAddEnroll`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgOfflineAddEnroll' */ `${pagePath}/PgOfflineAddEnroll`),
            loading: () => 'loading...',
            webpackChunkName: 'PgOfflineAddEnroll',
        })
    },
    {
        path: `${__rootDir}/PgPersonEnroll`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgPersonEnroll' */ `${pagePath}/PgPersonEnroll`),
            loading: () => 'loading...',
            webpackChunkName: 'PgPersonEnroll',
        })
    },
    {
        path: `${__rootDir}/PgtestPaper`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgtestPaper' */ `${pagePath}/PgtestPaper`),
            loading: () => 'loading...',
            webpackChunkName: 'PgtestPaper',
        })
    },
    {
        path: `${__rootDir}/PgtestPaperResult/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgtestPaperResult' */ `${pagePath}/PgtestPaperResult`),
            loading: () => 'loading...',
            webpackChunkName: 'PgtestPaperResult',
        })
    },
    {
        path: `${__rootDir}/offlineCheckin`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgofflineCheckin' */ `${pagePath}/PgofflineCheckin`),
            loading: () => 'loading...',
            webpackChunkName: 'PgofflineCheckin',
        })
    },
    {
        path: `${__rootDir}/PgTaskPaper`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgTaskPaper' */ `${pagePath}/PgTaskPaper`),
            loading: () => 'loading...',
            webpackChunkName: 'PgTaskPaper',
        })
    },
    {
        path: `${__rootDir}/ChoiceCourse`,
        component: ({
            loader: () => import(/* webpackChunkName: 'ChoiceCourse' */ `${pgCenterPath}/ChoiceCourse`),
            loading: () => 'loading...',
            webpackChunkName: 'ChoiceCourse',
        })
    },
    {
        path: `${__rootDir}/PersonalPgHome/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PersonalPgHome' */ `${pgCenterPath}/PersonalPgHome`),
            loading: () => 'loading...',
            webpackChunkName: 'PersonalPgHome',
        })
    },
    {
        path: `${__rootDir}/AnswerNoticeList`,
        component: ({
            loader: () => import(/* webpackChunkName: 'AnswerNoticeList' */ `${messagePath}/AnswerNoticeList`),
            loading: () => 'loading...',
            webpackChunkName: 'AnswerNoticeList',
        })
    },
    {
        path: `${__rootDir}/CommentNoticeList`,
        component: ({
            loader: () => import(/* webpackChunkName: 'CommentNoticeList' */ `${messagePath}/CommentNoticeList`),
            loading: () => 'loading...',
            webpackChunkName: 'CommentNoticeList',
        })
    },
    {
        path: `${__rootDir}/AdoptNoticeList`,
        component: ({
            loader: () => import(/* webpackChunkName: 'AdoptNoticeList' */ `${messagePath}/AdoptNoticeList`),
            loading: () => 'loading...',
            webpackChunkName: 'AdoptNoticeList',
        })
    },
    {
        path: `${__rootDir}/ReviewNoticeList`,
        component: ({
            loader: () => import(/* webpackChunkName: 'ReviewNoticeList' */ `${messagePath}/ReviewNoticeList`),
            loading: () => 'loading...',
            webpackChunkName: 'ReviewNoticeList',
        })
    },
    {
        path: `${__rootDir}/FocusNoticeList`,
        component: ({
            loader: () => import(/* webpackChunkName: 'FocusNoticeList' */ `${messagePath}/FocusNoticeList`),
            loading: () => 'loading...',
            webpackChunkName: 'FocusNoticeList',
        })
    },
    {
        path: `${__rootDir}/EnrollNoticeList`,
        component: ({
            loader: () => import(/* webpackChunkName: 'EnrollNoticeList' */ `${messagePath}/EnrollNoticeList`),
            loading: () => 'loading...',
            webpackChunkName: 'EnrollNoticeList',
        })
    },
    {
        path: `${__rootDir}/OfflineRemindNoticeList`,
        component: ({
            loader: () => import(/* webpackChunkName: 'OfflineRemindNoticeList' */ `${messagePath}/OfflineRemindNoticeList`),
            loading: () => 'loading...',
            webpackChunkName: 'OfflineRemindNoticeList',
        })
    },
    {
        path: `${__rootDir}/OfflineChangeNoticeList`,
        component: ({
            loader: () => import(/* webpackChunkName: 'OfflineChangeNoticeListTina' */ `${messagePath}/OfflineChangeNoticeListTina`),
            loading: () => 'loading...',
            webpackChunkName: 'OfflineChangeNoticeListTina',
        })
    },
    {
        path: `${__rootDir}/InviteNoticeList`,
        component: ({
            loader: () => import(/* webpackChunkName: 'InviteNoticeList' */ `${messagePath}/InviteNoticeList`),
            loading: () => 'loading...',
            webpackChunkName: 'InviteNoticeList',
        })
    },
    {
        path: `${__rootDir}/SystemNotification`,
        component: ({
            loader: () => import(/* webpackChunkName: 'SystemNotification' */ `${messagePath}/SystemNotification`),
            loading: () => 'loading...',
            webpackChunkName: 'SystemNotification',
        })
    },
    {
        path: `${__rootDir}/EnterpriseAnnouncement`,
        component: ({
            loader: () => import(/* webpackChunkName: 'EnterpriseAnnouncement' */ `${messagePath}/EnterpriseAnnouncement`),
            loading: () => 'loading...',
            webpackChunkName: 'EnterpriseAnnouncement',
        })
    },
    {
        path: `${__rootDir}/NoteDetails/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'NoteDetails' */ `${messagePath}/NoteDetails`),
            loading: () => 'loading...',
            webpackChunkName: 'NoteDetails',
        })
    },
    {
        path: `${__rootDir}/AnnouncementDetails/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'AnnouncementDetails' */ `${messagePath}/AnnouncementDetails`),
            loading: () => 'loading...',
            webpackChunkName: 'AnnouncementDetails',
        })
    },
    {
        path: `${__rootDir}/TaskDetails/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'TaskDetails' */ `${messagePath}/TaskDetails`),
            loading: () => 'loading...',
            webpackChunkName: 'TaskDetails',
        })
    },
    {
        path: `${__rootDir}/PendingReview`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PendingReview' */ `${reviewPath}/PendingReview`),
            loading: () => 'loading...',
            webpackChunkName: 'PendingReview',
        })
    },
    {
        path: `${__rootDir}/PendingReviewDetail/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PendingReviewDetail' */ `${reviewPath}/PendingReviewDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'PendingReviewDetail',
        })
    },
    {
        path: `${__rootDir}/ReviewDetail/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'ReviewDetail' */ `${reviewPath}/ReviewDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'ReviewDetail',
        })
    },
    {
        path: `${__rootDir}/PgError`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgError' */ `${pagePath}/PgError`),
            loading: () => 'loading...',
            webpackChunkName: 'PgError',
        })
    },
    {
        path: `${__rootDir}/PgOffLlineEnrollDetail/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgOffLlineEnrollDetail' */ `${pagePath}/PgOffLlineEnrollDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'PgOffLlineEnrollDetail',
        })
    },
    {
        path: `${__rootDir}/PgOffLlineMainHolderEnrollDetail/:_id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgOffLlineEnrollDetail' */ `${pagePath}/PgOffLlineEnrollDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'PgOffLlineEnrollDetail',
        })
    },
    {
        path: `${__rootDir}/PgOfflineJoinDetail/:id/:checkcode`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgOfflineJoinCodeDetail' */ `${pagePath}/PgOfflineJoinCodeDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'PgOfflineJoinCodeDetail',
        })
    },
    {
        path: `${__rootDir}/offlineToExamine`,
        component: ({
            loader: () => import(/* webpackChunkName: 'offlineToExamine' */ `${offlineExaminePath}/offlineToExamine`),
            loading: () => 'loading...',
            webpackChunkName: 'offlineToExamine',
        })
    },
    {
        path: `${__rootDir}/offlineToExamineDetail/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'offlineToExamineDetail' */ `${offlineExaminePath}/offlineToExamineDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'offlineToExamineDetail',
        })
    },
    {
        path: `${__rootDir}/offlineHistoryToExamineDetail/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'offlineHistoryToExamineDetail' */ `${offlineExaminePath}/offlineHistoryToExamineDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'offlineHistoryToExamineDetail',
        })
    },
    {
        path: `${__rootDir}/newbieTaskIndex`,
        component: ({
            loader: () => import(/* webpackChunkName: 'newbieTaskIndex' */ `${newbiePath}/newbieTaskIndex`),
            loading: () => 'loading...',
            webpackChunkName: 'newbieTaskIndex',
        })
    },
    {
        path: `${__rootDir}/taskList`,
        component: ({
            loader: () => import(/* webpackChunkName: 'taskList' */ `${pgCenterPath}/taskList`),
            loading: () => 'loading...',
            webpackChunkName: 'taskList',
        })
    },
    {
        path: `${__rootDir}/chooseTopic`,
        component: ({
            loader: () => import(/* webpackChunkName: 'chooseTopic' */ `${newbiePath}/chooseTopic`),
            loading: () => 'loading...',
            webpackChunkName: 'chooseTopic',
        })
    },
    {
        path: `${__rootDir}/perfectData`,
        component: ({
            loader: () => import(/* webpackChunkName: 'perfectData' */ `${newbiePath}/perfectData`),
            loading: () => 'loading...',
            webpackChunkName: 'perfectData',
        })
    },
    {
        path: `${__rootDir}/bindPhone`,
        component: ({
            loader: () => import(/* webpackChunkName: 'bindPhone' */ `${pagePath}/bindPhone`),
            loading: () => 'loading...',
            webpackChunkName: 'bindPhone',
        })
    },
    {
        path: `${__rootDir}/bindEmail`,
        component: ({
            loader: () => import(/* webpackChunkName: 'bindEmail' */ `${newbiePath}/bindEmail`),
            loading: () => 'loading...',
            webpackChunkName: 'bindEmail',
        })
    },
    {
        path: `${__rootDir}/bindWx`,
        component: ({
            loader: () => import(/* webpackChunkName: 'bindWx' */ `${newbiePath}/bindWx`),
            loading: () => 'loading...',
            webpackChunkName: 'bindWx',
        })
    },
    {
        path: `${__rootDir}/focusOnWX`,
        component: ({
            loader: () => import(/* webpackChunkName: 'focusOnWX' */ `${newbiePath}/focusOnWX`),
            loading: () => 'loading...',
            webpackChunkName: 'focusOnWX',
        })
    },
    {
        path: `${__rootDir}/vipPerfectInfo`,
        component: ({
            loader: () => import(/* webpackChunkName: 'vipPerfectInfo' */ `${newbiePath}/vipPerfectInfo`),
            loading: () => 'loading...',
            webpackChunkName: 'vipPerfectInfo',
        })
    },
    {
        path: `${__rootDir}/IntegralIntroduction`,
        component: ({
            loader: () => import(/* webpackChunkName: 'IntegralIntroduction' */ `${newbiePath}/IntegralIntroduction`),
            loading: () => 'loading...',
            webpackChunkName: 'IntegralIntroduction',
        })
    },
    {
        path: `${__rootDir}/PointsMall`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PointsMall' */ `${newbiePath}/PointsMall`),
            loading: () => 'loading...',
            webpackChunkName: 'PointsMall',
        })
    },
    {
        path: `${__rootDir}/VipCouponsDetail/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'VipCouponsDetail' */ `${newbiePath}/VipCouponsDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'VipCouponsDetail',
        })
    },
    {
        path: `${__rootDir}/ExchangeRecords`,
        component: ({
            loader: () => import(/* webpackChunkName: 'ExchangeRecords' */ `${newbiePath}/ExchangeRecords`),
            loading: () => 'loading...',
            webpackChunkName: 'ExchangeRecords',
        })
    },
    {
        path: `${__rootDir}/Pointsdetails`,
        component: ({
            loader: () => import(/* webpackChunkName: 'Pointsdetails' */ `${newbiePath}/Pointsdetails`),
            loading: () => 'loading...',
            webpackChunkName: 'Pointsdetails',
        })
    },
    {
        path: `${__rootDir}/InvitationCode`,
        component: ({
            loader: () => import(/* webpackChunkName: 'InvitationCode' */ `${accountPath}/InvitationCode`),
            loading: () => 'loading...',
            webpackChunkName: 'InvitationCode',
        })
    },
    {
        path: `${__rootDir}/about/service-protocol`,
        component: ({
            loader: () => import(/* webpackChunkName: 'serviceProtocol' */ `${pgCenterPath}/serviceProtocol`),
            loading: () => 'loading...',
            webpackChunkName: 'serviceProtocol',
        })
    },
    {
        path: `${__rootDir}/RegisterInvitationCode`,
        component: ({
            loader: () => import(/* webpackChunkName: 'RegisterInvitationCode' */ `${accountPath}/RegisterInvitationCode`),
            loading: () => 'loading...',
            webpackChunkName: 'RegisterInvitationCode',
        })
    },
    {
        path: `${__rootDir}/UserInvitedCode`,
        component: ({
            loader: () => import(/* webpackChunkName: 'UserInvitedCode' */ `${accountPath}/UserInvitedCode`),
            loading: () => 'loading...',
            webpackChunkName: 'UserInvitedCode',
        })
    },
    {
        path: `${__rootDir}/BolueInvitationCode`,
        component: ({
            loader: () => import(/* webpackChunkName: 'BolueInvitationCode' */ `${accountPath}/BolueInvitationCode`),
            loading: () => 'loading...',
            webpackChunkName: 'BolueInvitationCode',
        })
    },
    {
        path: `${__rootDir}/ShowInvitedCode`,
        component: ({
            loader: () => import(/* webpackChunkName: 'ShowInvitedCode' */ `${accountPath}/ShowInvitedCode`),
            loading: () => 'loading...',
            webpackChunkName: 'ShowInvitedCode',
        })
    },
    {
        path: `${__rootDir}/PgCopyCode`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgCopyCode' */ `${accountPath}/PgCopyCode`),
            loading: () => 'loading...',
            webpackChunkName: 'PgCopyCode',
        })
    },
    {
        path: `${__rootDir}/PgOfflineJoinCodeDetail/:checkcode`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgOfflineJoinCodeDetail' */ `${pagePath}/PgOfflineJoinCodeDetail`),
            loading: () => 'loading...',
            webpackChunkName: 'PgOfflineJoinCodeDetail',
        })
    },
    {
        path: `${__rootDir}/resourceShare/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgresourceShare' */ `${pagePath}/PgresourceShare`),
            loading: () => 'loading...',
            webpackChunkName: 'PgresourceShare',
        })
    },
    {
        path: `${__rootDir}/PgAnserByPhone/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgAnserByPhone' */ `${OAPath}/PgAnserByPhone`),
            loading: () => 'loading...',
            webpackChunkName: 'PgAnserByPhone',
        })
    },
    {
        path: `${__rootDir}/AttentionPlease`,
        component: ({
            loader: () => import(/* webpackChunkName: 'AttentionPlease' */ `${componentsPath}/AttentionPlease`),
            loading: () => 'loading...',
            webpackChunkName: 'AttentionPlease',
        })
    },
    {
        path: `${__rootDir}/`,
        component: ({
            loader: () => import(/* webpackChunkName: 'PgHomeIndex' */ `${pagePath}/PgHomeIndex`),
            loading: () => 'loading...',
            webpackChunkName: 'PgHomeIndex',
        })
    },
    {
        path: `${__rootDir}/GetKnowledgeCard/:id`,
        component: ({
            loader: () => import(/* webpackChunkName: 'GetKnowledgeCard' */ `${pagePath}/GetKnowledgeCard`),
            loading: () => 'loading...',
            webpackChunkName: 'GetKnowledgeCard',
        })
    },
];

