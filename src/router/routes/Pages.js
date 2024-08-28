import AssignUsers from "../../views/pages/administration/assignusers";
import DeleteRequest from "../../views/pages/deleteRequest/DeleteRequest";
import Editgroup from "../../views/pages/teacher/teacherapproved/viewteacher/teachergroup/editgroup";
import GroupDetails from "../../views/pages/IllegalMessages/GroupDetails";
import IndividualDetails from "../../views/pages/IllegalMessages/IndividualDetails";
import MyNotifications from "../../views/pages/notifications/mynotification";
import { Navigate } from "react-router-dom";
import Referral from "../../views/pages/student/studentapproved/viewstudent/referral";
import SentNotifications from "../../views/pages/notifications/sentnotification";
import { lazy } from "react";

const Teacherapproved = lazy(() =>
  import("../../views/pages/teacher/teacherapproved")
);
const Editteacher = lazy(() =>
  import("../../views/pages/teacher/teacherapproved/editteacher")
);
const Viewteacher = lazy(() =>
  import("../../views/pages/teacher/teacherapproved/viewteacher")
);
const Classworkdetail2 = lazy(() =>
  import(
    "../../views/pages/teacher/teacherapproved/viewteacher/classworkdetail2"
  )
);
const Teacherpending = lazy(() =>
  import("../../views/pages/teacher/teacherpending")
);
const Viewpendingteacher = lazy(() =>
  import("../../views/pages/teacher/teacherpending/viewpendingteacher")
);
const Studentapproved = lazy(() =>
  import("../../views/pages/student/studentapproved")
);
const IllegalMessages = lazy(() => import("../../views/pages/IllegalMessages"));
const Editstudent = lazy(() =>
  import("../../views/pages/student/studentapproved/editstudent")
);
const Viewstudent = lazy(() =>
  import("../../views/pages/student/studentapproved/viewstudent")
);
const Classworkdetail = lazy(() =>
  import(
    "../../views/pages/student/studentapproved/viewstudent/classworkdetail"
  )
);
const Meetingdetail2 = lazy(() =>
  import("../../views/pages/student/studentapproved/viewstudent/meetingdetail")
);
const Studentpending = lazy(() =>
  import("../../views/pages/student/studentpending")
);
const Viewpendingstudent = lazy(() =>
  import("../../views/pages/student/studentpending/viewpendingstudent")
);
const Subjects = lazy(() => import("../../views/pages/subjects"));
const Editsubject = lazy(() =>
  import("../../views/pages/subjects/editsubject")
);
const Addsubject = lazy(() => import("../../views/pages/subjects/addsubject"));
const Grade = lazy(() => import("../../views/pages/grade"));
const Badwords = lazy(() => import("../../views/pages/badwords"));
const Addbadword = lazy(() => import("../../views/pages/badwords/addbadword"));
const Editbadword = lazy(() =>
  import("../../views/pages/badwords/editbadword")
);
const Addgrade = lazy(() => import("../../views/pages/grade/addgrade"));
const Editgrade = lazy(() => import("../../views/pages/grade/editgrade"));
const School = lazy(() => import("../../views/pages/school"));
const Addschool = lazy(() => import("../../views/pages/school/addschool"));
const Editschool = lazy(() => import("../../views/pages/school/editschool"));
const Allpages = lazy(() => import("../../views/pages/allpages"));
const Editpage = lazy(() => import("../../views/pages/allpages/editpage"));
const Suggestions = lazy(() => import("../../views/pages/suggestions"));
const Meetingdetail = lazy(() =>
  import("../../views/pages/teacher/teacherapproved/viewteacher/meetingdetail")
);
const Error = lazy(() => import("../../views/pages/misc/Error"));
const ComingSoon = lazy(() => import("../../views/pages/misc/ComingSoon"));
const Maintenance = lazy(() => import("../../views/pages/misc/Maintenance"));
const AccountSettings = lazy(() =>
  import("../../views/pages/account-settings")
);
const NotAuthorized = lazy(() =>
  import("../../views/pages/misc/NotAuthorized")
);
const DocumentComments = lazy(() =>
  import(
    "../../views/pages/student/studentapproved/viewstudent/documentcomments"
  )
);
const Notifications = lazy(() => import("../../views/pages/notifications"));
const TeacherDocumentComments = lazy(() =>
  import(
    "../../views/pages/teacher/teacherapproved/viewteacher/teacherdocumentcomments"
  )
);
const Administration = lazy(() => import("../../views/pages/administration"));
const ReviewList = lazy(() =>
  import(
    "../../views/pages/teacher/teacherapproved/viewteacher/meetingdetail/reviewlist"
  )
);

const AdministrationView = lazy(() =>
  import("../../views/pages/administration/administrationview")
);

const Report = lazy(() => import("../../views/pages/report"));

const TabStudents = lazy(() =>
  import("../../views/pages/teacher/teacherapproved/viewteacher/tabstudents")
);
const TeacherGroup = lazy(() =>
  import("../../views/pages/teacher/teacherapproved/viewteacher/teachergroup")
);

const PagesRoutes = [
  {
    path: "/pages/teacherapproved",
    element: <Teacherapproved />,
  },
  {
    path: "/pages/editteacher",
    element: <Editteacher />,
  },
  {
    path: "/pages/viewteacher",
    element: <Viewteacher />,
  },
  {
    path: "/pages/teacherpending",
    element: <Teacherpending />,
  },
  {
    path: "/pages/viewpendingteacher",
    element: <Viewpendingteacher />,
  },
  {
    path: "/pages/studentapproved",
    element: <Studentapproved />,
  },
  {
    path: "/pages/illegal-messages",
    element: <IllegalMessages />,
  },
  {
    path: "/pages/delete-request",
    element: <DeleteRequest />,
  },
  {
    path: "/pages/illegal-messages/individual-chat-details",
    element: <IndividualDetails />,
  },
  {
    path: "/pages/illegal-messages/group-chat-details",
    element: <GroupDetails />,
  },
  {
    path: "/pages/editstudent",
    element: <Editstudent />,
  },
  {
    path: "/pages/viewstudent",
    element: <Viewstudent />,
  },
  {
    path: "/pages/documentcomments",
    element: <DocumentComments />,
  },
  {
    path: "/pages/teacherdocumentcomments",
    element: <TeacherDocumentComments />,
  },
  {
    path: "/pages/studentpending",
    element: <Studentpending />,
  },
  {
    path: "/pages/viewpendingstudent",
    element: <Viewpendingstudent />,
  },
  {
    path: "/pages/classworkdetail",
    element: <Classworkdetail />,
  },
  {
    path: "/pages/notifications",
    element: <Notifications />,
  },
  {
    path: "/pages/sentnotifications",
    element: <SentNotifications />,
  },
  {
    path: "/pages/mynotifications",
    element: <MyNotifications />,
  },
  {
    path: "/pages/classworkdetail2",
    element: <Classworkdetail2 />,
  },
  {
    path: "/pages/meetingdetail2",
    element: <Meetingdetail2 />,
  },
  {
    path: "/pages/account-settings",
    element: <AccountSettings />,
  },
  {
    path: "/pages/subjects",
    element: <Subjects />,
  },
  {
    path: "/pages/editsubject",
    element: <Editsubject />,
  },
  {
    path: "/pages/addsubject",
    element: <Addsubject />,
  },
  {
    path: "/pages/badwords",
    element: <Badwords />,
  },
  {
    path: "/pages/addbadword",
    element: <Addbadword />,
  },
  {
    path: "/pages/editbadword",
    element: <Editbadword />,
  },
  {
    path: "/pages/grade",
    element: <Grade />,
  },
  {
    path: "/pages/addgrade",
    element: <Addgrade />,
  },
  {
    path: "/pages/editgrade",
    element: <Editgrade />,
  },
  {
    path: "/pages/school",
    element: <School />,
  },
  {
    path: "/pages/addschool",
    element: <Addschool />,
  },
  {
    path: "/pages/editschool",
    element: <Editschool />,
  },
  {
    path: "/pages/allpages",
    element: <Allpages />,
  },
  {
    path: "/pages/reviewlist",
    element: <ReviewList />,
  },
  {
    path: "/pages/editpage",
    element: <Editpage />,
  },
  {
    path: "/pages/suggestions",
    element: <Suggestions />,
  },
  {
    path: "/pages/meetingdetail",
    element: <Meetingdetail />,
  },
  {
    path: "/pages/meetingdetail",
    element: <Meetingdetail />,
  },
  {
    path: "/pages/administration",
    element: <Administration />,
  },
  {
    path: "/pages/administrationview",
    element: <AdministrationView />,
  },
  {
    path: "/pages/assignusers",
    element: <AssignUsers />,
  },
  {
    path: "/pages/report",
    element: <Report />,
  },
  {
    path: "/pages/tabstudent",
    element: <TabStudents />,
  },
  {
    path: "/pages/teachergroup",
    element: <TeacherGroup />,
  },
  {
    path: "/pages/editgroup",
    element: <Editgroup />,
  },
  {
    path: "/pages/referral",
    element: <Referral />,
  },
  {
    path: "/misc/coming-soon",
    element: <ComingSoon />,
    meta: {
      publicRoute: true,
      layout: "blank",
    },
  },
  {
    path: "/misc/not-authorized",
    element: <NotAuthorized />,
    meta: {
      publicRoute: true,
      layout: "blank",
    },
  },
  {
    path: "/misc/maintenance",
    element: <Maintenance />,
    meta: {
      publicRoute: true,
      layout: "blank",
    },
  },
  {
    path: "/misc/error",
    element: <Error />,
    meta: {
      publicRoute: true,
      layout: "blank",
    },
  },
];

export default PagesRoutes;
