// ** Icons Import

import {
  AlertTriangle,
  Bell,
  Book,
  Clipboard,
  File,
  FileText,
  List,
  MessageSquare,
  Settings,
  Trash,
  Users,
} from "react-feather";

export default [
  {
    id: "Students",
    title: "Students",
    icon: <Users />,
    children: [
      {
        id: "Approval",
        title: "Pending Approval",
        navLink: "/pages/Studentpending",
      },
      {
        id: "Approved",
        title: "Approved",
        navLink: "/pages/studentapproved",
      },
    ],
  },
  {
    id: "Teachers",
    title: "Teachers",
    icon: <Users />,
    children: [
      {
        id: "Approval",
        title: "Pending Approval",
        navLink: "/pages/teacherpending",
      },
      {
        id: "Approved",
        title: "Approved",
        navLink: "/pages/teacherapproved",
      },
    ],
  },
  {
    id: "DeleteRequest",
    title: "Delete Request",
    icon: <Trash />,
    navLink: "/pages/delete-request",
  },
  {
    id: "Suggestions",
    title: "Suggestions",
    icon: <MessageSquare />,
    navLink: "/pages/suggestions",
  },
  {
    id: "Notifications",
    title: "Notifications",
    icon: <Bell />,
    navLink: "/pages/notifications",
  },
  {
    id: "Administration",
    title: "Administration",
    icon: <Settings />,
    navLink: "/pages/administration",
  },
  {
    id: "Report",
    title: "Report",
    icon: <File />,
    navLink: "/pages/report",
  },
  {
    id: "illegal-messages",
    title: "Illegal Messages",
    icon: <AlertTriangle />,
    navLink: "/pages/illegal-messages",
  },
  {
    id: "Content",
    title: "Content",
    icon: <FileText />,
    children: [
      {
        id: "Subjects",
        title: "Subjects",
        navLink: "/pages/subjects",
      },
      {
        id: "Schools",
        title: "Schools",
        navLink: "/pages/school",
      },
      {
        id: "Class",
        title: "Class",
        navLink: "/pages/grade",
      },
      {
        id: "BadWords",
        title: "Bad Words",
        navLink: "/pages/badwords",
      },
    ],
  },
  {
    id: "allpages",
    title: "Pages",
    icon: <FileText />,
    navLink: "/pages/allpages",
  },
  {
    id: "accountSettings",
    title: "Settings",
    icon: <Settings />,
    navLink: "/pages/account-settings",
  },
];
